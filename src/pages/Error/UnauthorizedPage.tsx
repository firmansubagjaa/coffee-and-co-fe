import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "../../components/common/Button";
import { motion } from "framer-motion";

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ShieldAlert className="w-12 h-12 text-error" />
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-coffee-900 mb-4">
          Access Denied
        </h1>
        <p className="text-coffee-600 text-lg mb-8 leading-relaxed">
          Sorry, you don't have permission to view this page. This area is
          restricted to authorized personnel only.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
          <Button onClick={() => navigate("/")} className="shadow-lg">
            Return Home
          </Button>
        </div>

        <p className="text-xs text-coffee-400 mt-12 font-mono">
          Error 403: Forbidden
        </p>
      </motion.div>
    </div>
  );
};
