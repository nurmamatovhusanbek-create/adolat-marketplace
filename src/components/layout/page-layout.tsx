"use client";

import * as React from "react";
import { Header } from "@/components/marketplace/header";
import { Footer } from "@/components/marketplace/footer";
import { AdvocateDetailModal } from "@/components/marketplace/advocate-detail-modal";
import { DocumentDetailModal } from "@/components/marketplace/document-detail-modal";
import { PostRequestModal } from "@/components/marketplace/post-request-modal";
import { AuthModal } from "@/components/auth/auth-modal";
import { DocumentEditor } from "@/components/editor/document-editor";
import { Dashboard } from "@/components/dashboard/dashboard";
import { ChatPanel } from "@/components/chat/chat-panel";
import { useMarketplaceStore } from "@/lib/marketplace/store";

/**
 * HomePageShell — UI Revolution Plan §3.1
 * Wraps the homepage with Header + Footer + all modals.
 * Modals are rendered once here (not per-section) to avoid duplication.
 */
export function HomePageShell({ children }: { children: React.ReactNode }) {
  const { isAuthOpen, authMode, setAuthOpen } = useMarketplaceStore();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Modals — rendered once at shell level */}
      <AdvocateDetailModal />
      <DocumentDetailModal />
      <PostRequestModal />
      <AuthModal
        open={isAuthOpen}
        onOpenChange={(o) => setAuthOpen(o)}
        defaultMode={authMode}
        onSuccess={() => setAuthOpen(false)}
      />

      {/* Full-screen overlays */}
      <DocumentEditor />
      <Dashboard />
      <ChatPanel />
    </div>
  );
}
