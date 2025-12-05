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
import { useProductReviews, useCreateReview, useUpdateReview, useDeleteReview } from '@/api';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

// Types - using global Review from types.ts

const reviewSchema = z.object({
  comment: z.string().min(3, "Review must be at least 3 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewSectionProps {
  productId: string;  // ✅ Need productId from parent
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [isWriting, setIsWriting] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  
  // ✅ Backend integration
  const [page, setPage] = useState(1);
  const LIMIT = 5;
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  
  // ✅ Backend integration with pagination
  const { data: reviews = [], isLoading, isPlaceholderData } = useProductReviews(productId, page, LIMIT);
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

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

  const onSubmit = async (data: ReviewFormValues) => {
    if (!user) return;

    try {
      if (editingReviewId) {
        await updateReviewMutation.mutateAsync({
          reviewId: editingReviewId,
          data: {
            rating: data.rating,
            comment: data.comment || '',
          },
        });
        toast.success("Review updated!");
        setEditingReviewId(null);
      } else {
        await createReviewMutation.mutateAsync({
          productId,
          rating: data.rating,
          comment: data.comment || '',
        });
        toast.success("Review posted!");
      }
      
      setIsWriting(false);
      reset();
    } catch (error) {
      console.error("Submit review error:", error);
      toast.error("Failed to save review. Please try again.");
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setDeletingReviewId(reviewId);
  };

  const handleConfirmDelete = async () => {
    if (!deletingReviewId) return;
    
    try {
      await deleteReviewMutation.mutateAsync(deletingReviewId);
      setDeletingReviewId(null);
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error("Failed to delete review");
    }
  };

  const handleEdit = (review: any) => {
    setEditingReviewId(review.id);
    setValue("rating", review.rating);
    setValue("comment", review.comment);
    setIsWriting(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {isWriting ? "Cancel" : "Write a Review"}
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
                <Button type="submit" className="gap-2" disabled={createReviewMutation.isPending || updateReviewMutation.isPending}>
                  {editingReviewId ? "Update Review" : "Post Review"} <Send className="w-4 h-4" />
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
                <span className="text-xs text-coffee-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
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
              <div className="flex gap-4 items-center">
                <button className="text-xs font-medium text-coffee-400 hover:text-coffee-700 flex items-center gap-1 transition-colors">
                  <ThumbsUp className="w-3 h-3" /> Helpful ({review.likes || 0})
                </button>
                
                {/* Edit/Delete for Owner */}
                {user?.id === review.userId && (
                  <div className="flex gap-2 ml-auto">
                    <button 
                      onClick={() => handleEdit(review)}
                      className="text-xs font-medium text-coffee-600 hover:text-coffee-900 flex items-center gap-1 transition-colors"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(review.id)}
                      className="text-xs font-medium text-error/70 hover:text-error flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || isLoading}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <span className="text-coffee-600 dark:text-coffee-400 font-medium">
          Page {page}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={reviews.length < LIMIT || isPlaceholderData || isLoading}
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingReviewId} onOpenChange={(open) => !open && setDeletingReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-error hover:bg-error/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
