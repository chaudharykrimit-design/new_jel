import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Truck, RefreshCw, Play, Edit3 } from "lucide-react";
import { api } from "@/lib/api";
import type { Review, FeedbackVideo } from "@/lib/api";
import ReviewModal from "./ReviewModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const trustBadges = [
  { icon: Shield, label: "BIS Hallmarked", desc: "Certified 22K Gold" },
  { icon: Truck, label: "Free Shipping", desc: "On orders above ₹25,000" },
  { icon: RefreshCw, label: "Easy Returns", desc: "15-day return policy" },
  { icon: Star, label: "Lifetime Exchange", desc: "100% exchange value" },
];

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [videos, setVideos] = useState<FeedbackVideo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    api.testimonials.get().then(res => {
      setReviews(res.reviews);
      setVideos(res.videos);
    }).catch(console.error);
  }, []);

  return (
    <>
      {/* Trust Badges */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <badge.icon className="w-8 h-8 text-primary mb-3" strokeWidth={1} />
                <h4 className="font-body text-sm font-semibold text-secondary-foreground tracking-wide">
                  {badge.label}
                </h4>
                <p className="text-muted-foreground text-xs font-body mt-1">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-cream overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-12 relative">
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-2">
              Hear from Our Happy Customers
            </h2>
            <p className="text-muted-foreground text-sm font-body mt-3 max-w-2xl mx-auto">
              Every Jewel Has a Story. Hear What Our Customers Have to Say.
            </p>
            <div className="w-16 h-px bg-primary mx-auto mt-6" />
            <div className="absolute top-0 right-4 lg:right-8">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="hidden md:inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors px-6 py-2.5 text-xs font-semibold tracking-widest uppercase font-body shadow-sm rounded-sm"
              >
                <Edit3 className="w-4 h-4" />
                Write a Review
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-start">
            {/* Left: Text Reviews */}
            <div className="flex flex-col gap-8 max-h-[700px] overflow-y-auto pr-2 pb-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
              {reviews.length === 0 ? (
                <div className="text-center p-8 bg-background border border-border/50 text-muted-foreground font-body text-sm rounded-xl shadow-sm">
                  No written reviews yet. Be the first to share your experience!
                </div>
              ) : reviews.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-background p-6 md:p-8 border border-border/50 relative shadow-md ml-8 mt-2 rounded-[20px]"
                >
                  <div className="absolute -left-10 top-8 w-20 h-20 rounded-full bg-[#f8f5ee] border-[6px] border-[#faf9f6] flex items-center justify-center overflow-hidden shadow-sm z-10">
                    <span className="font-display text-primary text-3xl font-bold">{r.userName.charAt(0)}</span>
                  </div>
                  <div className="pl-6 md:pl-10">
                    <h4 className="font-display text-lg text-foreground font-medium mb-2 opacity-90">{r.userName}</h4>
                    <p className="text-muted-foreground font-body text-[13px] leading-relaxed mb-4">
                      "{r.text}"
                    </p>
                    <div className="flex gap-1.5 justify-end">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-[14px] h-[14px] ${j < r.rating ? "fill-[#f59e0b] text-[#f59e0b]" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              <div className="mt-4 text-center md:hidden">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-3 text-xs font-semibold tracking-widest uppercase font-body rounded-sm w-full justify-center"
                >
                  <Edit3 className="w-4 h-4" />
                  Write a Review
                </button>
              </div>
            </div>

            {/* Right: Video Reels */}
            <div className="flex gap-5 overflow-x-auto pb-8 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
              {videos.length === 0 ? (
                <div className="text-center p-8 w-full bg-primary/5 border border-primary/20 text-foreground font-body text-sm rounded-[20px]">
                  Video testimonials coming soon
                </div>
              ) : videos.map((v, i) => (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="snap-center shrink-0 w-[260px] md:w-[300px] bg-[#4a2b16] rounded-sm overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col relative"
                >
                  {/* Brand Header inside Video Card */}
                  <div className="p-5 text-center flex flex-col items-center justify-center border-b-[1.5px] border-white/10">
                    <div className="text-white opacity-90 flex items-center justify-center gap-2 mb-1">
                      {/* Logo Icon Mock */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white stroke-current stroke-2">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                        <path d="M2 17L12 22L22 17" />
                        <path d="M2 12L12 17L22 12" />
                      </svg>
                    </div>
                    <h3 className="font-display tracking-[0.2em] text-white text-[11px] font-bold">AURUM JEWELS</h3>
                  </div>
                  
                  {/* Video Thumbnail / Container */}
                  <div className="relative aspect-[9/16] bg-black cursor-pointer group p-3 pb-0" onClick={() => setPlayingVideo(v.videoUrl)}>
                    <div className="relative w-full h-full rounded-tr-xl rounded-tl-xl overflow-hidden bg-[#2a1a0f]">
                      {v.thumbnailUrl ? (
                        <img src={v.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                         <video src={v.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" muted playsInline />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 text-white ml-1 fill-white opacity-90" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Caption */}
                  <div className="px-5 py-6 bg-[#4a2b16] grow flex flex-col items-center justify-start text-center">
                    <p className="text-white font-display text-xs tracking-widest uppercase font-semibold opacity-90">{v.caption || "CRAFTED FOR MOMENTS THAT LAST FOREVER"}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Dialog open={!!playingVideo} onOpenChange={() => setPlayingVideo(null)}>
        <DialogContent className="max-w-max p-1 bg-transparent border-none shadow-none outline-none flex items-center justify-center [&>button]:hidden">
           <DialogTitle className="sr-only">Video Testimonial</DialogTitle>
           {playingVideo && (
             <video src={playingVideo} className="w-auto h-[85vh] rounded-md shadow-2xl bg-black" controls autoPlay playsInline />
           )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Testimonials;
