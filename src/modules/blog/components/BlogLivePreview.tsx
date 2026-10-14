"use client";

import React, { useState, Component, ErrorInfo, ReactNode } from "react";
import BlogArticleView, { BlogArticleViewData } from "@/components/blog/BlogArticleView";
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  ExternalLink,
  RefreshCw,
  Search,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Moon,
  Sun,
} from "lucide-react";
import { calculateReadingTime } from "@/modules/blog/utils/helpers";

// ─── Preview Error Boundary ──────────────────────────────────────────────────
interface ErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PreviewErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Blog Live Preview Render Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex flex-col items-center text-center gap-4">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
          <div>
            <h3 className="font-bold text-lg">Unable to render preview</h3>
            <p className="text-xs text-rose-600 mt-1 max-w-md">
              {this.state.error?.message || "An unexpected rendering error occurred inside the preview."}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Preview
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── BlogLivePreview Props ──────────────────────────────────────────────────
export interface BlogLivePreviewProps {
  post: BlogArticleViewData & {
    status?: string;
    seoTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    focusKeyword?: string;
  };
  onOpenFullScreen?: () => void;
}

export default function BlogLivePreview({
  post,
  onOpenFullScreen,
}: BlogLivePreviewProps) {
  type ViewportMode = "desktop" | "tablet" | "mobile";
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const readingTime = calculateReadingTime(post.content || "");
  const pageSlug = post.slug || "your-article-slug";
  const previewUrl = `https://hexakode.in/blog/${pageSlug}`;
  const displaySeoTitle = post.seoTitle || post.title || "Article Title";
  const displaySeoDesc =
    post.metaDescription || post.excerpt || "Article preview description will appear here as search result snippet.";
  const displayOgImage = post.ogImage || post.featuredImage || "/images/blog-placeholder.svg";

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-900/5 rounded-2xl border border-outline-variant/20 overflow-hidden">
      {/* ── Preview Toolbar ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface-container-low border-b border-outline-variant/20 select-none">
        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/20 shadow-xs">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewport === "desktop"
                ? "bg-primary text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewport === "tablet"
                ? "bg-primary text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewport === "mobile"
                ? "bg-primary text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Theme & Utility Controls */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkTheme(!isDarkTheme)}
            className="p-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest text-slate-700 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer"
            title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDarkTheme ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Refresh Preview */}
          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest text-slate-700 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Open Full Screen Modal */}
          {onOpenFullScreen && (
            <button
              type="button"
              onClick={onOpenFullScreen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer"
              title="Full Screen Preview"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Full Screen</span>
            </button>
          )}

          {/* Open Published Page Link */}
          {post.status === "PUBLISHED" && post.slug && (
            <a
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
              title="View Published Page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">View Live</span>
            </a>
          )}
        </div>
      </div>

      {/* ── Collapsible SEO & Social Cards Preview Panel ───────────────────── */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/20">
        <button
          type="button"
          onClick={() => setIsSeoOpen(!isSeoOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            SEO & Social Snippet Preview
          </span>
          {isSeoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isSeoOpen && (
          <div className="p-4 border-t border-outline-variant/10 space-y-5 bg-slate-50/50 text-left">
            {/* Google Search Snippet */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                Google Search Result
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs max-w-xl">
                <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                  <span>hexakode.in</span>
                  <span>›</span>
                  <span>blog</span>
                  <span>›</span>
                  <span className="text-slate-700 font-medium">{pageSlug}</span>
                </div>
                <div className="text-base font-medium text-blue-700 hover:underline cursor-pointer truncate mt-0.5">
                  {displaySeoTitle} | Code That Powers Growth
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mt-1">
                  {displaySeoDesc}
                </p>
              </div>
            </div>

            {/* Social Card Preview (OpenGraph / X) */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                Social Card Preview (LinkedIn / Twitter / Facebook)
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden max-w-md">
                <div className="relative w-full aspect-[1.91/1] bg-slate-100 overflow-hidden">
                  <img
                    src={displayOgImage}
                    alt={displaySeoTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/blog-placeholder.svg";
                    }}
                  />
                  {readingTime > 0 && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-medium backdrop-blur-xs">
                      {readingTime} min read
                    </span>
                  )}
                </div>
                <div className="p-3 bg-slate-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    HEXAKODE.IN
                  </div>
                  <div className="text-xs font-bold text-navy-dark truncate mt-0.5">
                    {displaySeoTitle}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {displaySeoDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Live Article Renderer Box ────────────────────────────────────── */}
      <div
        className={`flex-1 overflow-y-auto p-4 md:p-6 transition-colors duration-300 ${
          isDarkTheme ? "dark bg-slate-950 text-slate-100" : "bg-slate-100/70"
        }`}
      >
        <div
          className={`mx-auto transition-all duration-300 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden ${
            viewport === "mobile"
              ? "w-[375px] max-w-full ring-8 ring-slate-800 rounded-3xl my-2"
              : viewport === "tablet"
              ? "w-[768px] max-w-full ring-4 ring-slate-400 rounded-2xl my-2"
              : "w-full max-w-5xl"
          }`}
        >
          <PreviewErrorBoundary key={refreshKey} onReset={() => setRefreshKey((k) => k + 1)}>
            <BlogArticleView post={post} isPreview={true} pageUrl={previewUrl} />
          </PreviewErrorBoundary>
        </div>
      </div>
    </div>
  );
}
