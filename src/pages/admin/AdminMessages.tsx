import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ContactMessage } from "@/lib/api";
import { Mail, MailOpen, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = () => api.admin.messages().then(({ messages }) => setMessages(messages));
  useEffect(() => { load(); }, []);

  const markRead = async (msg: ContactMessage) => {
    if (!msg.read) {
      await api.admin.markMessageRead(msg.id);
      load();
    }
    setSelected(msg);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await api.admin.deleteMessage(id);
      toast.success("Message deleted");
      setSelected(null);
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-foreground">
          Messages
          {unread > 0 && <span className="ml-2 text-sm bg-primary text-primary-foreground px-2.5 py-0.5 font-body">{unread} new</span>}
        </h1>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-background border border-border p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg">{selected.subject || "No Subject"}</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3 text-sm font-body">
              <div className="flex gap-6 text-foreground/70">
                <span><strong>From:</strong> {selected.name}</span>
                <span>{selected.email}</span>
                {selected.phone && <span>{selected.phone}</span>}
              </div>
              <div className="border border-border p-4 bg-muted/30 min-h-[100px] whitespace-pre-wrap">
                {selected.message}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(selected.created_at).toLocaleString("en-IN")}
                </span>
                <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-1 text-xs text-destructive hover:underline">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="bg-background border border-border divide-y divide-border">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm font-body">No messages yet</div>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              onClick={() => markRead(msg)}
              className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors ${!msg.read ? "bg-primary/5" : ""}`}
            >
              <div className="mt-0.5">
                {msg.read ? <MailOpen className="w-4 h-4 text-muted-foreground" /> : <Mail className="w-4 h-4 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-body ${!msg.read ? "font-semibold text-foreground" : "text-foreground/70"}`}>
                    {msg.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-body">
                    {new Date(msg.created_at).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <p className={`text-xs font-body ${!msg.read ? "text-foreground" : "text-foreground/60"}`}>
                  {msg.subject || "No Subject"}
                </p>
                <p className="text-xs text-muted-foreground font-body truncate mt-0.5">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
