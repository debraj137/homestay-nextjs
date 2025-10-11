"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ReviewForm({ roomId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Please provide both a rating and comment.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ roomId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");

      toast.success("Review submitted successfully!");
      onReviewAdded(data);
      setRating(0);
      setHover(0);
      setComment("");
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

      {/* Rating Stars */}
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, idx) => {
          const starValue = idx + 1;
          return (
            <svg
              key={idx}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={
                starValue <= (hover || rating) ? "#facc15" : "currentColor"
              }
              className={`w-8 h-8 cursor-pointer ${
                starValue <= (hover || rating)
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(starValue)}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.176 0l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.517-4.674z" />
            </svg>
          );
        })}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={4}
        placeholder="Share your experience... (e.g. cleanliness, comfort, hospitality)"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "text-white bg-gray-700 hover:bg-gray-800 cursor-pointer"
        }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
