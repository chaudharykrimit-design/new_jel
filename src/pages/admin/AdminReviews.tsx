import { useEffect, useState } from "react";
import { api, type Review } from "@/lib/api";
import { toast } from "sonner";
import { Check, X, Trash2, Star } from "lucide-react";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    api.admin.reviews()
      .then(res => setReviews(res.reviews))
      .catch(err => toast.error(err.message || "Failed to load reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.admin.updateReview(id, status);
      toast.success(`Review ${status}`);
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Failed to update review status");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.admin.deleteReview(id);
      toast.success("Review deleted");
      fetchReviews();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete review");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Customer Reviews</h2>
      </div>

      <div className="bg-background border border-border shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground font-body">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground font-body">No reviews found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Rating</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Review</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-5 py-4 font-semibold align-top">{review.userName}</td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                           <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-primary text-primary" : "text-border"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-xs align-top">
                      <p className="line-clamp-3 text-muted-foreground" title={review.text}>{review.text}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-sm
                        ${review.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {review.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center gap-2">
                        {review.status !== 'approved' && (
                          <button onClick={() => handleUpdateStatus(review.id, 'approved')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve">
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button onClick={() => handleUpdateStatus(review.id, 'rejected')} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded" title="Reject">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleDelete(review.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
