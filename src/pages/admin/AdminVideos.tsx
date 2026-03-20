import { useEffect, useState, useRef } from "react";
import { api, type FeedbackVideo } from "@/lib/api";
import { toast } from "sonner";
import { Trash2, Plus, Upload, Loader2, Play } from "lucide-react";

export default function AdminVideos() {
  const [videos, setVideos] = useState<FeedbackVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // New Video Form
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const fetchVideos = () => {
    setLoading(true);
    api.testimonials.get()
      .then(res => setVideos(res.videos))
      .catch(err => toast.error(err.message || "Failed to load videos"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a video file");

    setIsUploading(true);
    try {
      // 1. Upload video
      const videoRes = await api.upload(file);
      const videoUrl = videoRes.url;
      
      // 2. Upload thumbnail if exists
      let thumbnailUrl = "";
      if (thumbnailFile) {
        const thumbRes = await api.upload(thumbnailFile);
        thumbnailUrl = thumbRes.url;
      }

      // 3. Create db record
      await api.admin.createVideo({
        videoUrl,
        thumbnailUrl,
        caption,
        displayOrder: parseInt(displayOrder) || 0
      });
      
      toast.success("Video testimonial added");
      setFile(null);
      setThumbnailFile(null);
      setCaption("");
      setDisplayOrder("0");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
      fetchVideos();
    } catch (err: any) {
      toast.error(err.message || "Failed to add video");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.admin.deleteVideo(id);
      toast.success("Video deleted");
      fetchVideos();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete video");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Video Testimonials</h2>
      </div>

      {/* Add New Video Form */}
      <div className="bg-background border border-border p-6 shadow-sm">
        <h3 className="font-display text-lg mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Add New Video
        </h3>
        <form onSubmit={handleCreate} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-muted-foreground">Video File (MP4) *</label>
              <input 
                type="file" 
                accept="video/*" 
                required 
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm font-body file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-muted-foreground">Thumbnail Image (Optional)</label>
              <input 
                type="file" 
                accept="image/*" 
                ref={thumbnailInputRef}
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full text-sm font-body file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-muted-foreground">Caption</label>
              <input 
                type="text" 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="e.g. CRAFTED FOR MOMENTS"
                className="w-full border border-border px-4 py-2 text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider mb-2 block text-muted-foreground">Display Order</label>
              <input 
                type="number" 
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full border border-border px-4 py-2 text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
            <button 
              type="submit" 
              disabled={isUploading}
              className="mt-2 w-full bg-primary text-primary-foreground py-2 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50"
            >
              {isUploading ? <><Loader2 className="w-4 h-4 animate-spin"/> Uploading...</> : <><Upload className="w-4 h-4"/> Save Video</>}
            </button>
          </div>
        </form>
      </div>

      {/* Video List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-muted-foreground font-body">Loading videos...</div>
        ) : videos.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground font-body bg-background border border-border">No video testimonials found.</div>
        ) : (
          videos.map(video => (
            <div key={video.id} className="bg-background border border-border overflow-hidden relative group rounded-md shadow-sm">
              <div className="aspect-[9/16] bg-black relative">
                 {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-80" />
                  ) : (
                    <video src={video.videoUrl} className="w-full h-full object-cover opacity-80" muted />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
              </div>
              <div className="p-3 bg-[#4a2b16] text-white text-center">
                <p className="text-[10px] uppercase tracking-wider font-semibold truncate">{video.caption || "No Caption"}</p>
                <p className="text-[10px] text-white/60 mt-1">Order: {video.displayOrder}</p>
              </div>
              
              <button 
                onClick={() => handleDelete(video.id)}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                title="Delete Video"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
