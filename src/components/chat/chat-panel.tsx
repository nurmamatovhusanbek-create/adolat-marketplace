"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Send, Paperclip, X, ArrowLeft, Loader2, CheckCheck, Check, FileText, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Attachment {
  filename: string; originalName: string; size: number; mimeType: string; url: string;
}
interface Message {
  id: string; conversationId: string; senderId: string; receiverId: string;
  content: string; attachments: Attachment[]; isRead: boolean; readAt: string | null; createdAt: string;
}
interface ConversationParticipant {
  id: string; name: string; email: string; role: string; isAdvocate: boolean;
  advocateProfile: { slug: string; titleUz: string; verified: boolean } | null;
}
interface Conversation {
  id: string; participants: ConversationParticipant[]; lastMessageAt: string | null;
}
interface ChatState {
  open: boolean; conversation: Conversation | null; receiverId: string | null;
  receiverName: string | null; messages: Message[]; loading: boolean; sending: boolean; otherTyping: boolean;
}

const initial: ChatState = {
  open: false, conversation: null, receiverId: null, receiverName: null,
  messages: [], loading: false, sending: false, otherTyping: false,
};

let globalChatState: ChatState = { ...initial };
const listeners = new Set<() => void>();

function setChatState(updater: (s: ChatState) => Partial<ChatState>) {
  globalChatState = { ...globalChatState, ...updater(globalChatState) };
  listeners.forEach((l) => l());
}

function useChatState() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const l = () => setTick((t) => t + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  return globalChatState;
}

export function openChatWith(receiverId: string, receiverName: string) {
  setChatState(() => ({
    open: true, receiverId, receiverName, conversation: null, messages: [], loading: true,
  }));
  void initConversation(receiverId);
}

async function initConversation(receiverId: string) {
  try {
    const res = await fetch("/api/conversations/start", {
      method: "POST", headers: { "Content-Type": "application/json" },
      credentials: "same-origin", body: JSON.stringify({ receiverId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Suhbatni boshlab bo'lmadi");
    }
    const data = await res.json();
    setChatState(() => ({ conversation: data.conversation, loading: false }));
    void loadMessages(data.conversation.id);
  } catch (err) {
    toast.error("Suhbatni boshlab bo'lmadi", {
      description: err instanceof Error ? err.message : undefined,
    });
    setChatState(() => ({ loading: false, open: false }));
  }
}

async function loadMessages(conversationId: string) {
  try {
    const res = await fetch(`/api/conversations/${conversationId}/messages?limit=50`, {
      credentials: "same-origin",
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    setChatState(() => ({ messages: data.messages }));
  } catch {
    toast.error("Xabarlarni yuklab bo'lmadi");
  }
}

async function sendMessageREST(conversationId: string, receiverId: string, content: string, attachments: Attachment[]) {
  const res = await fetch("/api/conversations/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ conversationId, receiverId, content, attachments }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Xabar yuborilmadi");
  }
  return await res.json();
}

function closeChat() {
  setChatState(() => ({ open: false }));
  setTimeout(() => {
    setChatState(() => ({ conversation: null, messages: [], receiverId: null, receiverName: null }));
  }, 300);
}

export function ChatPanel() {
  const state = useChatState();
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const currentUserId = session?.user?.id;
  const otherUser = state.conversation?.participants.find((p) => p.id !== currentUserId);

  // === Poll for new messages every 3 seconds when chat is open ===
  useEffect(() => {
    if (!state.open || !state.conversation) return;

    // Initial load already done by initConversation
    // Set up polling for new messages
    pollIntervalRef.current = setInterval(async () => {
      if (!state.conversation) return;
      try {
        const res = await fetch(`/api/conversations/${state.conversation.id}/messages?limit=50`, {
          credentials: "same-origin",
        });
        if (!res.ok) return;
        const data = await res.json();
        const msgs = data.messages as Message[];
        // Only update if there are new messages
        if (msgs.length > 0) {
          const lastId = msgs[msgs.length - 1].id;
          if (lastId !== lastMessageIdRef.current) {
            lastMessageIdRef.current = lastId;
            setChatState(() => ({ messages: msgs }));
            // Mark messages as read if I'm the receiver
            const hasUnread = msgs.some((m) => m.receiverId === currentUserId && !m.isRead);
            if (hasUnread) {
              fetch(`/api/conversations/${state.conversation!.id}/read`, {
                method: "POST",
                credentials: "same-origin",
              }).catch(() => {});
            }
          }
        }
      } catch {
        // silent
      }
    }, 3000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [state.open, state.conversation?.id, currentUserId]);

  // === Scroll to bottom on new messages ===
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  // === Send message via REST (no WebSocket needed) ===
  const handleSend = useCallback(async () => {
    if (!input.trim() && pendingAttachments.length === 0) return;
    if (!state.conversation || !currentUserId || !otherUser) return;
    const content = input.trim();
    const attachments = [...pendingAttachments];
    setInput("");
    setPendingAttachments([]);
    setChatState(() => ({ sending: true }));

    try {
      const data = await sendMessageREST(state.conversation.id, otherUser.id, content, attachments);
      if (data.message) {
        setChatState((s) => ({ messages: [...s.messages, data.message], sending: false }));
        lastMessageIdRef.current = data.message.id;
      }
    } catch (err) {
      toast.error("Xabar yuborilmadi", {
        description: err instanceof Error ? err.message : undefined,
      });
      setInput(content);
      setPendingAttachments(attachments);
      setChatState(() => ({ sending: false }));
    }
  }, [input, pendingAttachments, state.conversation, currentUserId, otherUser]);

  // === File upload via Next.js API ===
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fayl juda katta", { description: "Maksimal hajm: 10 MB" });
      return;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/chat/upload", {
        method: "POST", credentials: "same-origin", body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Yuklash amalga oshmadi");
      }
      const data = await res.json();
      setPendingAttachments((prev) => [...prev, data.file]);
      toast.success("Fayl yuklandi");
    } catch (err) {
      toast.error("Fayl yuklanmadi", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <Sheet open={state.open} onOpenChange={(o) => !o && closeChat()}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-lg lg:max-w-xl">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={closeChat} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {otherUser && (
              <>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://i.pravatar.cc/64?u=${otherUser.id}`} />
                  <AvatarFallback className="bg-foreground/10 text-xs font-bold text-foreground">
                    {otherUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-serif text-sm font-bold">{otherUser.name}</span>
                    {otherUser.advocateProfile?.verified && (
                      <Badge className="bg-accent/15 text-accent text-[9px] hover:bg-accent/15">Tasdiqlangan</Badge>
                    )}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {otherUser.advocateProfile?.titleUz ?? otherUser.email}
                  </div>
                </div>
              </>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-[calc(100vh-9rem)] flex-col">
          <ScrollArea className="flex-1 bg-secondary/20 p-4">
            {state.loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : state.messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Send className="h-6 w-6 text-accent" />
                </div>
                <p className="font-serif text-sm font-bold">Suhbatni boshlang</p>
                <p className="max-w-xs text-xs text-muted-foreground">
                  Birinchi xabaringizni yuboring. Barcha xabarlar saqlanadi va istalgan vaqtda davom ettirishingiz mumkin.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {state.messages.map((msg) => {
                  const isMine = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[80%] rounded-lg p-3",
                        isMine ? "bg-foreground text-background" : "bg-card border border-border"
                      )}>
                        {msg.content && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        )}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            {msg.attachments.map((att) => (
                              <AttachmentChip key={att.filename} att={att} dark={isMine} />
                            ))}
                          </div>
                        )}
                        <div className={cn(
                          "mt-1 flex items-center justify-end gap-1 text-[10px]",
                          isMine ? "text-background/60" : "text-muted-foreground"
                        )}>
                          {new Date(msg.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                          {isMine && (msg.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {pendingAttachments.length > 0 && (
            <div className="border-t border-border bg-card p-2">
              <div className="flex flex-wrap gap-2">
                {pendingAttachments.map((att, i) => (
                  <div key={att.filename} className="relative flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-2 py-1">
                    <FileText className="h-3 w-3 text-accent" />
                    <span className="max-w-32 truncate text-[11px]">{att.originalName}</span>
                    <button onClick={() => setPendingAttachments((p) => p.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border bg-card p-3">
            <div className="flex items-end gap-2">
              <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.doc,.docx,.txt" />
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile || state.sending} className="h-9 w-9 shrink-0" aria-label="Fayl biriktirish">
                {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
              </Button>
              <Input value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void handleSend(); } }}
                placeholder="Xabar yozing..."
                disabled={state.sending || state.loading || !state.conversation}
                className="h-9 flex-1 resize-none" />
              <Button onClick={handleSend}
                disabled={state.sending || (!input.trim() && pendingAttachments.length === 0) || !state.conversation}
                size="icon" className="h-9 w-9 shrink-0 bg-foreground text-background hover:bg-foreground/90">
                {state.sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-1.5 px-1 text-[10px] text-muted-foreground">
              Enter — yuborish · Shift+Enter — yangi qator · Maks 10 MB fayllar
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AttachmentChip({ att, dark }: { att: Attachment; dark: boolean }) {
  const isImage = att.mimeType.startsWith("image/");
  const fileUrl = att.url.startsWith("/api/") ? att.url : `/api/chat/files/${att.url.split("/").pop()}`;

  if (isImage) {
    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="block">
        <img src={fileUrl} alt={att.originalName} className="max-h-32 rounded border border-border/50" />
      </a>
    );
  }
  return (
    <a href={fileUrl} download={att.originalName}
      className={cn("flex items-center gap-2 rounded border px-2 py-1.5 text-xs",
        dark ? "border-background/30 bg-background/10 text-background hover:bg-background/20"
             : "border-border bg-secondary/50 hover:bg-secondary")}>
      <FileText className="h-3.5 w-3.5 shrink-0" />
      <span className="max-w-32 truncate">{att.originalName}</span>
      <span className="text-[10px] opacity-60">({Math.round(att.size / 1024)}KB)</span>
      <Download className="h-3 w-3 shrink-0" />
    </a>
  );
}
