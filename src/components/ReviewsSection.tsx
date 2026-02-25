"use client";

import { FiMessageSquare, FiStar, FiUser } from "react-icons/fi";
import { useState } from "react";
import Image from "next/image";
import { useAddReviewMutation } from "@/redux/services/ProductApi";
import toast from "react-hot-toast";

interface ReviewsSectionProps {
  reviews: any[];
  averageRating: number;
  productId: string;
}

const ReviewsSection = ({ reviews, averageRating, productId }: ReviewsSectionProps) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addReview] = useAddReviewMutation();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      await addReview({
        productId,
        rating,
        comment,
      }).unwrap();

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setShowReviewForm(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => Math.floor(r.rating) === stars).length,
    percentage:
      reviews.length > 0
        ? (reviews.filter((r) => Math.floor(r.rating) === stars).length / reviews.length) * 100
        : 0,
  }));

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.floor(averageRating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-medium text-gray-900 ml-2">
              {averageRating.toFixed(1)} out of 5
            </span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </div>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="mt-4 md:mt-0 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors">
          Write a Review
        </button>
      </div>

      {/* Rating Distribution */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-3">Rating Breakdown</h4>
        <div className="space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center">
              <div className="flex items-center w-16">
                <span className="text-sm text-gray-600 mr-2">{stars}</span>
                <FiStar className="text-amber-500 w-4 h-4" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mx-3">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-16">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button title="rating" key={star} type="button" onClick={() => setRating(star)} className="p-1">
                    <FiStar
                      className={`w-8 h-8 ${
                        star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                rows={4}
                placeholder="Share your experience with this product..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {review.user?.avatar ? (
                      <Image
                        src={review.user.avatar}
                        alt={review.user?.name || "User"}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    ) : (
                      <FiUser className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {review.user?.name || review.name || "Anonymous"}
                    </h5>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {review.comment && (
                <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
