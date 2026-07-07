"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HomePage } from "@/components/pages/home-page";
import { AuthPage } from "@/components/pages/auth-page";
import { MarketplacePage } from "@/components/pages/marketplace-page";
import { DashboardPage } from "@/components/pages/dashboard-page";
import { EnterprisePage } from "@/components/pages/enterprise-page";
import { AdminPage } from "@/components/pages/admin-page";
import { AdminGateModal } from "@/components/admin-gate-modal";
import { useKritamStore } from "@/lib/store";

export default function Home() {
  const page = useKritamStore((s) => s.page);
  const adminUnlocked = useKritamStore((s) => s.adminUnlocked);

  // rehydrate persisted store AFTER mount so the first client render
  // matches SSR HTML (avoids hydration mismatch warnings).
  useEffect(() => {
    useKritamStore.persist.rehydrate();
  }, []);

  // Admin is strictly gated: only render the AdminPage when the session
  // has been explicitly unlocked. If somehow page === 'admin' without an
  // unlock (e.g. edge state), fall back to home so no admin sub-elements
  // ever leak onto the client.
  const showAdmin = page === "admin" && adminUnlocked;
  const renderPage = showAdmin ? "admin" : page === "admin" ? "home" : page;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] max-w-[120vw] -translate-x-1/2 rounded-full bg-[#00F2FE]/[0.04] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[700px] max-w-[120vw] rounded-full bg-[#7F00FF]/[0.05] blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={renderPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-1 flex-col"
          >
            {renderPage === "home" && <HomePage />}
            {renderPage === "auth" && <AuthPage />}
            {renderPage === "marketplace" && <MarketplacePage />}
            {renderPage === "dashboard" && <DashboardPage />}
            {renderPage === "enterprise" && <EnterprisePage />}
            {renderPage === "admin" && <AdminPage />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global admin security gate — rendered last so it overlays everything */}
      <AdminGateModal />
    </div>
  );
}
