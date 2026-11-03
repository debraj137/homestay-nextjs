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
    <form onSubmit={handleSubmit} className="surface-card rounded-[1.4rem] p-6 sm:p-8">
      <p className="eyebrow">Share your stay</p>
      <h3 className="font-display mt-2 text-3xl font-semibold text-[#30231d]">Write a review</h3>

      <fieldset className="mt-6">
        <legend className="text-sm font-bold text-[#4a3a30]">How would you rate this stay?</legend>
        <div className="mt-3 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {Array.from({ length: 5 }).map((_, index) => {
            const starValue = index + 1;
            const active = starValue <= (hover || rating);
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
                aria-pressed={rating === starValue}
                className={`grid h-10 w-10 place-items-center rounded-full transition ${active ? 'text-[#d49232]' : 'text-[#ddcfc0] hover:text-[#d49232]'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-7 w-7" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.176 0l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.517-4.674z" />
                </svg>
              </button>
            );
          })}
          <span className="ml-2 text-sm font-semibold text-[#796b62]">{rating ? `${rating} of 5` : 'Select a rating'}</span>
        </div>
      </fieldset>

      <label htmlFor="review-comment" className="mt-6 block text-sm font-bold text-[#4a3a30]">Tell future guests about your experience</label>
      <textarea
        id="review-comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        rows={4}
        placeholder="What did you enjoy about the comfort, location or hospitality?"
        className="mt-3 w-full resize-y rounded-2xl border border-[#ddcbbb] bg-[#fffdfa] p-4 text-sm leading-6 text-[#30231d] placeholder:text-[#a38f81]"
      />

      <button type="submit" disabled={loading} className="awadh-button mt-5 w-full px-5 py-3 text-sm">
        {loading ? 'Submitting your review…' : 'Submit review'}
      </button>
    </form>
  );
}
