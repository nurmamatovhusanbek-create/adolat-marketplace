"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Check,
  Checks,
  DownloadSimple,
  FileText,
  PaperPlaneTilt,
  Paperclip,
  Spinner,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Attachment { filename: string; originalName: string; size: number; mimeType: string; url: string; }
interface Message { id: string; conversationId: string; senderId: string; receiverId: string; content: string; attachments: Attachment[]; isRead: boolean; readAt: string | null; createdAt: string; }
interface ChatState { open: boolean; conversation: any; receiverId: string | null; receiverName: string | null; messages: Message[]; loading: boolean; sending: boolean; otherTyping: boolean; }

let globalState: ChatState = { open: false, conversation: null, receiverId: null, receiverName: null, messages: [], loading: false, sending: false, otherTyping: false };
const listeners = new Set<() => void>();
function setState(u: (s: ChatState) => Partial<ChatState>) { globalState = { ...globalState, ...u(globalState) }; listeners.forEach(l => l()); }

export function openChatWith(receiverId: string, receiverName: string) {
  if (!receiverId || receiverId.length < 5) { toast.error("Advokat ID topilmadi"); return; }
  setState(() => ({ open: true, receiverId, receiverName, conversation: null, messages: [], loading: true }));
  (async () => {
    try {
      const res = await fetch("/api/conversations/start", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ receiverId }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setState(() => ({ conversation: data.conversation, loading: false }));
      const msgRes = await fetch(`/api/conversations/${data.conversation.id}/messages?limit=50`, { credentials: "same-origin" });
      if (msgRes.ok) { const msgData = await msgRes.json(); setState(() => ({ messages: msgData.messages })); }
    } catch (err) { toast.error("Chatni ochib bo'lmadi", { description: err instanceof Error ? err.message : undefined }); setState(() => ({ loading: false, open: false })); }
  })();
}

function closeChat() { setState(() => ({ open: false })); setTimeout(() => setState(() => ({ conversation: null, messages: [], receiverId: null, receiverName: null })), 300); }

export function ChatPanel() {
  const [, setTick] = useState(0);
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { const l = () => setTick(t => t + 1); listeners.add(l); return () => { listeners.delete(l); }; }, []);
  const state = globalState;
  const currentUserId = session?.user?.id;
  const otherUser = state.conversation?.participants?.find((p: any) => p.id !== currentUserId);

  useEffect(() => {
    if (!state.open || !state.conversation) return;
    pollRef.current = setInterval(async () => {
      if (!state.conversation) return;
      try {
        const res = await fetch(`/api/conversations/${state.conversation.id}/messages?limit=50`, { credentials: "same-origin" });
        if (!res.ok) return;
        const data = await res.json();
        setState(() => ({ messages: data.messages }));
        const hasUnread = data.messages.some((m: Message) => m.receiverId === currentUserId && !m.isRead);
        if (hasUnread) { fetch(`/api/conversations/${state.conversation.id}/read`, { method: "POST", credentials: "same-origin" }).catch(() => {}); }
      } catch {}
    }, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [state.open, state.conversation?.id, currentUserId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [state.messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() && pendingAttachments.length === 0) return;
    if (!state.conversation || !currentUserId || !otherUser) return;
    const content = input.trim();
    const attachments = [...pendingAttachments];
    setInput(""); setPendingAttachments([]); setState(() => ({ sending: true }));
    try {
      const res = await fetch("/api/conversations/send", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ conversationId: state.conversation.id, receiverId: otherUser.id, content, attachments }) });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Failed"); }
      const data = await res.json();
      if (data.message) setState(s => ({ messages: [...s.messages, data.message], sending: false }));
    } catch (err) { toast.error("Xabar yuborilmadi", { description: err instanceof Error ? err.message : undefined }); setInput(content); setPendingAttachments(attachments); setState(() => ({ sending: false })); }
  }, [input, pendingAttachments, state.conversation, currentUserId, otherUser]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; e.target.value = "";
    if (file.size > 10 * 1024 * 1024) { toast.error("Fayl juda katta", { description: "Max 10 MB" }); return; }
    setUploadingFile(true);
    try {
      const formData = new FormData(); formData.append("file", file);
      const res = await fetch("/api/chat/upload", { method: "POST", credentials: "same-origin", body: formData });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Upload failed"); }
      const data = await res.json(); setPendingAttachments(prev => [...prev, data.file]); toast.success("Fayl yuklandi");
    } catch (err) { toast.error("Fayl yuklanmadi", { description: err instanceof Error ? err.message : undefined }); }
    finally { setUploadingFile(false); }
  };

  return (
    <Sheet open={state.open} onOpenChange={(o) => !o && closeChat()}>
      <SheetContent side="right" className="w-full sm:w-[480px] lg:w-[560px] h-screen p-0 flex flex-col" style={{ maxWidth: "100vw", maxHeight: "100vh" }}>
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8"><ArrowLeft weight="regular" className="h-4 w-4" /></Button>
            {otherUser && (<>
              <Avatar className="h-9 w-9"><AvatarImage src={`https://i.pravatar.cc/64?u=${otherUser.id}`} /><AvatarFallback className="bg-foreground/10 text-xs font-bold text-foreground">{otherUser.name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><span className="truncate font-serif text-sm font-bold">{otherUser.name}</span>{otherUser.advocateProfile?.verified && <Badge className="bg-accent/15 text-accent text-[9px] hover:bg-accent/15">Tasdiqlangan</Badge>}</div><div className="text-[10px] text-muted-foreground">{otherUser.advocateProfile?.titleUz ?? otherUser.email}</div></div>
            </>)}
          </SheetTitle>
        </SheetHeader>
        <div className="flex h-[calc(100vh-9rem)] flex-col">
          <ScrollArea className="flex-1 bg-secondary/20 p-4">
            {state.loading ? (<div className="flex h-full items-center justify-center"><Spinner weight="regular" className="h-6 w-6 animate-spin text-muted-foreground" /></div>)
            : state.messages.length === 0 ? (
              /* Empty state — rise entrance for celebratory feel */
              <div className="rise rise-1 flex h-full flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <PaperPlaneTilt weight="regular" className="h-6 w-6 text-accent" />
                </div>
                <p className="font-serif text-sm font-bold">Suhbatni boshlang</p>
                <p className="max-w-xs text-xs text-muted-foreground">Birinchi xabaringizni yuboring.</p>
              </div>
            )
            : (<div className="space-y-3">{state.messages.map((msg) => { const isMine = msg.senderId === currentUserId; return (
              /* Message bubble — slide-in entrance via CSS animation.
                 Use transform + opacity only (GPU-composited, no layout thrashing). */
              <div key={msg.id} className={cn("flex animate-[riseIn_0.3s_cubic-bezier(0.2,0,0,1)_forwards]", isMine ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-3 shadow-beautiful-sm",
                  isMine
                    ? "bg-foreground text-background rounded-br-md"
                    : "bg-card border border-border rounded-bl-md"
                )}>
                  {msg.content && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>}
                  {msg.attachments?.length > 0 && <div className="mt-2 space-y-1.5">{msg.attachments.map((att) => <AttachmentChip key={att.filename} att={att} dark={isMine} />)}</div>}
                  <div className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", isMine ? "text-background/60" : "text-muted-foreground")}>
                    {new Date(msg.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                    {isMine && (msg.isRead ? <Checks weight="regular" className="h-3 w-3" /> : <Check weight="bold" className="h-3 w-3" />)}
                  </div>
                </div>
              </div>); })}
              {/* Typing indicator — shown when other user is typing.
                   Three dots bounce in sequence via .typing-dot CSS in globals.css. */}
              {state.otherTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 shadow-beautiful-sm">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>)}
          </ScrollArea>
          {pendingAttachments.length > 0 && (<div className="border-t border-border bg-card p-2"><div className="flex flex-wrap gap-2">{pendingAttachments.map((att, i) => (<div key={att.filename} className="flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-2 py-1"><FileText weight="regular" className="h-3 w-3 text-accent" /><span className="max-w-32 truncate text-[11px]">{att.originalName}</span><button onClick={() => setPendingAttachments(p => p.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive"><X weight="regular" className="h-3 w-3" /></button></div>))}</div></div>)}
          <div className="border-t border-border bg-card p-3">
            <div className="flex items-end gap-2">
              <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.doc,.docx,.txt" />
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={uploadingFile || state.sending} className="h-9 w-9 shrink-0" aria-label="Fayl biriktirish">{uploadingFile ? <Spinner weight="regular" className="h-4 w-4 animate-spin" /> : <Paperclip weight="regular" className="h-4 w-4" />}</Button>
              <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); } }} placeholder="Xabar yozing..." disabled={state.sending || state.loading || !state.conversation} className="h-9 flex-1 resize-none" aria-label="Xabar matni" />
              <Button onClick={handleSend} disabled={state.sending || (!input.trim() && pendingAttachments.length === 0) || !state.conversation} size="icon" className="h-9 w-9 shrink-0 bg-foreground text-background hover:bg-foreground/90" aria-label="Xabar yuborish">{state.sending ? <Spinner weight="regular" className="h-4 w-4 animate-spin" /> : <PaperPlaneTilt weight="regular" className="h-4 w-4" />}</Button>
            </div>
            <p className="mt-1.5 px-1 text-[10px] text-muted-foreground">Enter — yuborish · Shift+Enter — yangi qator · Maks 10 MB</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AttachmentChip({ att, dark }: { att: Attachment; dark: boolean }) {
  const isImage = att.mimeType.startsWith("image/");
  const fileUrl = att.url.startsWith("/api/") ? att.url : `/api/chat/files/${att.url.split("/").pop()}`;
  if (isImage) return <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block"><img src={fileUrl} alt={att.originalName} className="max-h-32 rounded border border-border/50" /></a>;
  return <a href={fileUrl} download={att.originalName} className={cn("flex items-center gap-2 rounded border px-2 py-1.5 text-xs", dark ? "border-background/30 bg-background/10 text-background hover:bg-background/20" : "border-border bg-secondary/50 hover:bg-secondary")}><FileText weight="regular" className="h-3.5 w-3.5 shrink-0" /><span className="max-w-32 truncate">{att.originalName}</span><span className="text-[10px] opacity-60">({Math.round(att.size / 1024)}KB)</span><DownloadSimple weight="regular" className="h-3 w-3 shrink-0" /></a>;
}
