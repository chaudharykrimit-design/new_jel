import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { api } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Name and message are required");
      return;
    }
    setLoading(true);
    try {
      await api.contact.send(form);
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-border bg-background px-4 py-3 text-sm font-body focus:border-primary focus:outline-none transition-colors";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-cream py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">Home</a>
            <span>/</span>
            <span className="text-foreground">Contact</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-12">
          <span className="text-primary text-xs tracking-[0.3em] uppercase font-body font-medium">Get in Touch</span>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mt-2">Contact Us</h1>
          <div className="w-16 h-px bg-primary mx-auto mt-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-display text-xl text-foreground mb-6">Visit Our Store</h2>
            <div className="space-y-6 mb-8">
              {[
                { icon: MapPin, label: "Address", value: "123 Heritage Lane, Zaveri Bazaar,\nMumbai, Maharashtra 400002" },
                { icon: Phone, label: "Phone", value: "+91 63566 47453" },
                { icon: Mail, label: "Email", value: "info@aurumjewels.com" },
                { icon: Clock, label: "Hours", value: "Mon - Sat: 10AM - 8PM\nSun: 11AM - 6PM" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1">{item.label}</h4>
                    <p className="text-sm font-body text-foreground whitespace-pre-line">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="border border-border p-6 md:p-8">
              <h2 className="font-display text-xl text-foreground mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Name *</label>
                    <input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Email</label>
                    <input type="email" className={inputClass} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Phone</label>
                    <input className={inputClass} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Subject</label>
                    <input className={inputClass} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-body uppercase tracking-wider text-foreground/70 mb-1.5 block">Message *</label>
                  <textarea className={`${inputClass} resize-none h-32`} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 text-xs tracking-[0.2em] uppercase font-body font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
