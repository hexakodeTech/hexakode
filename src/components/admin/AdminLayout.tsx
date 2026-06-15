"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface LayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-surface">
      {/* Sidebar Navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Administrative Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Panel Scroll Area */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto w-full max-w-container-max"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
