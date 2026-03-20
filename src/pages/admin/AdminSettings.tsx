import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Save } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.settings.get().then(({ settings }) => setSettings(settings));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.settings.update(settings);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setSettings(prev => ({ ...prev, [key]: value }));
  const inputClass = "w-full border border-border bg-background px-4 py-2.5 text-sm font-body focus:border-primary focus:outline-none transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-foreground">Settings</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs tracking-wider uppercase font-body font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Store Info */}
        <div className="bg-background border border-border p-6">
          <h2 className="font-display text-sm text-foreground mb-4 uppercase tracking-wider">Store Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Store Name</label>
              <input className={inputClass} value={settings.store_name || ""} onChange={e => update("store_name", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Tagline</label>
              <input className={inputClass} value={settings.store_tagline || ""} onChange={e => update("store_tagline", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Phone</label>
              <input className={inputClass} value={settings.store_phone || ""} onChange={e => update("store_phone", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Email</label>
              <input className={inputClass} value={settings.store_email || ""} onChange={e => update("store_email", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Address</label>
              <textarea className={`${inputClass} resize-none h-20`} value={settings.store_address || ""} onChange={e => update("store_address", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-background border border-border p-6">
          <h2 className="font-display text-sm text-foreground mb-4 uppercase tracking-wider">Business Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">WhatsApp Number</label>
              <input className={inputClass} value={settings.whatsapp_number || ""} onChange={e => update("whatsapp_number", e.target.value)} placeholder="916356647453" />
              <p className="text-[10px] text-muted-foreground font-body mt-1">Country code + number, no + sign</p>
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Free Shipping Min (₹)</label>
              <input type="number" className={inputClass} value={settings.free_shipping_minimum || ""} onChange={e => update("free_shipping_minimum", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">GST Percentage</label>
              <input type="number" step="0.5" className={inputClass} value={settings.gst_percentage || ""} onChange={e => update("gst_percentage", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Metal Rates */}
        <div className="bg-background border border-border p-6">
          <h2 className="font-display text-sm text-foreground mb-4 uppercase tracking-wider">Metal Rates (Price per Gram in ₹)</h2>
          <p className="text-[10px] text-muted-foreground font-body mb-4">Set these manually to ensure price stability for your clients. Changes take effect instantly.</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Gold 24K (Pure)</label>
              <input type="number" className={inputClass} value={settings.gold_rate_24k || ""} onChange={e => update("gold_rate_24k", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Gold 22K (Jewelry)</label>
              <input type="number" className={inputClass} value={settings.gold_rate_22k || ""} onChange={e => update("gold_rate_22k", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Gold 18K</label>
              <input type="number" className={inputClass} value={settings.gold_rate_18k || ""} onChange={e => update("gold_rate_18k", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Silver</label>
              <input type="number" className={inputClass} value={settings.silver_rate || ""} onChange={e => update("silver_rate", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1 block">Platinum</label>
              <input type="number" className={inputClass} value={settings.platinum_rate || ""} onChange={e => update("platinum_rate", e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
