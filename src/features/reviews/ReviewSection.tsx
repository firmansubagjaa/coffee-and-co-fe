import React, { useState } from "react";
import { Star, ThumbsUp, MessageSquare, Send } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../auth/store";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Types
interface Review {
  id: string;
  userId: string;
  userName: string;
  avatarColor?: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Alice Johnson",
    avatarColor: "795548",
    rating: 5,
    comment: "Absolutely delicious! The roast is perfect.",
    date: "2 days ago",
    likes: 12,
  },
  {
    id: "2",
    userId: "u2",
    userName: "Mark D.",
    avatarColor: "1e40af",
    rating: 4,
    comment: "Great taste, but took a bit long to arrive.",
    date: "1 week ago",
    likes: 3,
  },
  {
    id: "3",
    userId: "u3",
    userName: "Sarah Lee",
    avatarColor: "166534",
    rating: 5,
    comment: "My daily driver. Can't start the morning without it.",
    date: "2 weeks ago",
    likes: 8,
  },
];

const reviewSchema = z.object({
  comment: z.string().min(3, "Review must be at least 3 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export const ReviewSection: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [isWriting, setIsWriting] = useState(false);

  // Form Hook
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  const currentRating = watch("rating");

  const onSubmit = (data: ReviewFormValues) => {
    if (!user) return;

    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      avatarColor: user.avatarColor,
      rating: data.rating,
      comment: data.comment,
      date: "Just now",
      likes: 0,
    };

    setReviews([newReview, ...reviews]);
    setIsWriting(false);
    reset();
    toast.success("Review posted!");
  };

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to leave a review");
      return;
    }
    setIsWriting(!isWriting);
  };

  // Calculate Average
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0;

  return (
    <div className="py-10 border-t border-coffee-100 dark:border-coffee-800">
      <h2 className="text-2xl font-serif font-bold text-coffee-900 dark:text-white mb-8">
        Customer Reviews
      </h2>

      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-8 mb-10 items-center bg-coffee-50 dark:bg-coffee-900 p-6 rounded-3xl border border-coffee-100 dark:border-coffee-800">
        <div className="text-center">
          <div className="text-5xl font-bold text-coffee-900 dark:text-white">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex gap-1 justify-center my-2 text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(avgRating)
                    ? "fill-current"
                    : "text-coffee-200"
                }`}
              />
            ))}
          </div>
          <p className="text-coffee-500 dark:text-coffee-400 text-sm">
            {reviews.length} Verified Reviews
          </p>
        </div>

        <div className="h-px w-full md:w-px md:h-20 bg-coffee-200 dark:bg-coffee-700"></div>

        <div className="flex-1 w-full text-center md:text-left">
          <p className="text-coffee-700 dark:text-coffee-300 italic mb-4">
            "We love hearing from our community. Share your experience!"
          </p>
          <Button
            onClick={handleWriteClick}
            variant={isWriting ? "ghost" : "primary"}
          >
            {isWriting ? "Cancel Review" : "Write a Review"}
          </Button>
        </div>
      </div>

      {/* Write Form */}
      <AnimatePresence>
        {isWriting && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="mb-10 overflow-hidden"
          >
            <div className="bg-white dark:bg-coffee-800 p-6 rounded-2xl border border-coffee-100 dark:border-coffee-700 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-bold text-coffee-900 dark:text-white mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("rating", star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= currentRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-coffee-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-coffee-900 dark:text-white mb-2">
                  Review
                </label>
                <Input
                  {...register("comment")}
                  placeholder="Tell us what you liked..."
                  className={`h-24 ${errors.comment ? "border-error" : ""}`}
                />
                {errors.comment && (
                  <p className="text-error text-xs mt-1">
                    {errors.comment.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="gap-2">
                  Post Review <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex gap-4 p-4 border-b border-coffee-50 dark:border-coffee-800 last:border-0"
          >
            <Avatar className="w-10 h-10 border border-coffee-100 dark:border-coffee-700">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${
                  review.userName
                }&background=${review.avatarColor || "795548"}&color=fff`}
              />
              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-coffee-900 dark:text-white">
                  {review.userName}
                </h4>
                <span className="text-xs text-coffee-400">{review.date}</span>
              </div>
              <div className="flex gap-0.5 mb-2 text-yellow-500">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3 h-3 ${
                      star <= review.rating ? "fill-current" : "text-coffee-100"
                    }`}
                  />
                ))}
              </div>
              <p className="text-coffee-600 dark:text-coffee-300 text-sm leading-relaxed mb-3">
                {review.comment}
              </p>
              <div className="flex gap-4">
                <button className="text-xs font-medium text-coffee-400 hover:text-coffee-700 flex items-center gap-1 transition-colors">
                  <ThumbsUp className="w-3 h-3" /> Helpful ({review.likes})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
