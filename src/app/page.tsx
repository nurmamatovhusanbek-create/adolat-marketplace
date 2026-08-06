"use client";

import { Suspense, lazy } from "react";
import { useMarketplaceStore } from "@/lib/marketplace/store";
import { Header } from "@/components/marketplace/header";
import { Footer } from "@/components/marketplace/footer";
import { AdvocateListing } from "@/components/marketplace/advocate-listing";
import { DocumentListing } from "@/components/marketplace/document-listing";
import { RequestsPage } from "@/components/marketplace/requests-page";
import { HowItWorksPage } from "@/components/marketplace/how-it-works-page";
import { ForAdvocatesPage } from "@/components/marketplace/for-advocates-page";
import { RecentRequests } from "@/components/marketplace/recent-requests";
import { PopularDocuments } from "@/components/marketplace/popular-documents";

// New home sections — UI Revolution Plan Phase 3
import { HeroSection } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { DocumentCategoriesSection } from "@/components/home/document-categories-section";
import { FeaturedAdvocatesSection } from "@/components/home/featured-advocates-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CTASection } from "@/components/home/cta-section";

// Modals
import { AdvocateDetailModal } from "@/components/marketplace/advocate-detail-modal";
import { DocumentDetailModal } from "@/components/marketplace/document-detail-modal";
import { PostRequestModal } from "@/components/marketplace/post-request-modal";
import { AuthModal } from "@/components/auth/auth-modal";
import { DocumentEditor } from "@/components/editor/document-editor";
import { Dashboard } from "@/components/dashboard/dashboard";

// Phase 6: Dynamic imports for heavy components (code splitting)
const ChatPanel = lazy(() => import("@/components/chat/chat-panel").then(m => ({ default: m.ChatPanel })));
const AdvocateDashboard = lazy(() => import("@/components/advocate/advocate-dashboard").then(m => ({ default: m.AdvocateDashboard })));
const AdminPanel = lazy(() => import("@/components/admin/admin-panel").then(m => ({ default: m.AdminPanel })));

function LoadingSpinner() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export default function Home() {
  const { currentView, isAuthOpen, authMode, setAuthOpen } = useMarketplaceStore();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {currentView === "home" && (
          <>
            <HeroSection />
            <TrustBar stats={{
              advocatesCount: 1284,
              documentsCount: 697,
              requestsResolved: 8472,
              citiesCovered: 14,
            }} />
            <DocumentCategoriesSection limit={6} />
            <FeaturedAdvocatesSection limit={6} />
            <PopularDocuments />
            <HowItWorksSection />
            <RecentRequests />
            <TestimonialsSection limit={4} />
            <CTASection />
          </>
        )}

        {currentView === "advocates" && <AdvocateListing />}
        {currentView === "documents" && <DocumentListing />}
        {currentView === "requests" && <RequestsPage />}
        {currentView === "how-it-works" && <HowItWorksPage />}
        {currentView === "for-advocates" && <ForAdvocatesPage />}
        {currentView === "advocate-dashboard" && (
          <Suspense fallback={<LoadingSpinner />}>
            <AdvocateDashboard />
          </Suspense>
        )}
        {currentView === "admin-panel" && (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminPanel />
          </Suspense>
        )}
      </main>

      <Footer />

      {/* Modals */}
      <AdvocateDetailModal />
      <DocumentDetailModal />
      <PostRequestModal />

      <AuthModal
        open={isAuthOpen}
        onOpenChange={(o) => setAuthOpen(o)}
        defaultMode={authMode}
        onSuccess={() => setAuthOpen(false)}
      />

      <DocumentEditor />
      <Dashboard />

      {/* Phase 6: Lazy-loaded chat panel */}
      <Suspense fallback={null}>
        <ChatPanel />
      </Suspense>
    </div>
  );
}
