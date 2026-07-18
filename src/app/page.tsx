"use client";

import { useMarketplaceStore } from "@/lib/marketplace/store";
import { Header } from "@/components/marketplace/header";
import { Hero } from "@/components/marketplace/hero";
import { CategoryGrid } from "@/components/marketplace/category-grid";
import { FeaturedAdvocates } from "@/components/marketplace/featured-advocates";
import { PopularDocuments } from "@/components/marketplace/popular-documents";
import { HowItWorks } from "@/components/marketplace/how-it-works";
import { RecentRequests } from "@/components/marketplace/recent-requests";
import { Testimonials } from "@/components/marketplace/testimonials";
import { AdvocateCTA } from "@/components/marketplace/advocate-cta";
import { Footer } from "@/components/marketplace/footer";
import { AdvocateListing } from "@/components/marketplace/advocate-listing";
import { DocumentListing } from "@/components/marketplace/document-listing";
import { RequestsPage } from "@/components/marketplace/requests-page";
import { HowItWorksPage } from "@/components/marketplace/how-it-works-page";
import { ForAdvocatesPage } from "@/components/marketplace/for-advocates-page";
import { AdvocateDetailModal } from "@/components/marketplace/advocate-detail-modal";
import { DocumentDetailModal } from "@/components/marketplace/document-detail-modal";
import { PostRequestModal } from "@/components/marketplace/post-request-modal";
import { AuthModal } from "@/components/auth/auth-modal";
import { DocumentEditor } from "@/components/editor/document-editor";
import { Dashboard } from "@/components/dashboard/dashboard";
import { ChatPanel } from "@/components/chat/chat-panel";
import { AdvocateDashboard } from "@/components/advocate/advocate-dashboard";
import { AdminPanel } from "@/components/admin/admin-panel";

export default function Home() {
  const { currentView, isAuthOpen, authMode, setAuthOpen } = useMarketplaceStore();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {currentView === "home" && (
          <>
            <Hero />
            <CategoryGrid />
            <FeaturedAdvocates />
            <PopularDocuments />
            <HowItWorks />
            <RecentRequests />
            <Testimonials />
            <AdvocateCTA />
          </>
        )}

        {currentView === "advocates" && <AdvocateListing />}
        {currentView === "documents" && <DocumentListing />}
        {currentView === "requests" && <RequestsPage />}
        {currentView === "how-it-works" && <HowItWorksPage />}
        {currentView === "for-advocates" && <ForAdvocatesPage />}
        {currentView === "advocate-dashboard" && <AdvocateDashboard />}
        {currentView === "admin-panel" && <AdminPanel />}
      </main>

      <Footer />

      {/* Modals */}
      <AdvocateDetailModal />
      <DocumentDetailModal />
      <PostRequestModal />

      {/* Auth modal */}
      <AuthModal
        open={isAuthOpen}
        onOpenChange={(o) => setAuthOpen(o)}
        defaultMode={authMode}
        onSuccess={() => setAuthOpen(false)}
      />

      {/* Full-screen document editor */}
      <DocumentEditor />

      {/* User dashboard */}
      <Dashboard />

      {/* Real-time chat */}
      <ChatPanel />
    </div>
  );
}
