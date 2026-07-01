"use client";

import React, { useCallback } from "react";

// TypeScript declarations for Google Analytics gtag function on window
declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      eventParams?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Low-level utility to safely send custom events to Google Analytics 4.
 * Handles server-side environments and checks if gtag is loaded.
 */
export function sendGAEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }

  // Get current page location and page title dynamically
  const pageLocation = window.location.href;
  const pageTitle = document.title;

  const eventParams = {
    page_location: pageLocation,
    page_title: pageTitle,
    ...params,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }

  // Debug console logging in development mode
  if (process.env.NODE_ENV === "development") {
    console.log(
      `GA Event:\nEvent: ${eventName}\nParameters:\n${JSON.stringify(eventParams, null, 2)}`
    );
  }
}

/**
 * Expose general track event function
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  sendGAEvent(eventName, params);
}

/**
 * 1. Contact Form Tracking
 * Event: generate_lead
 * Parameters: form_name, page_location, page_title
 */
export function trackGenerateLead(formName: string = "contact") {
  sendGAEvent("generate_lead", {
    form_name: formName,
  });
}

/**
 * 2. Schedule Demo Tracking
 * Event: schedule_demo
 * Parameters: form_name, page_location, page_title
 */
export function trackScheduleDemo(formName: string = "schedule_demo") {
  sendGAEvent("schedule_demo", {
    form_name: formName,
  });
}

/**
 * 3. WhatsApp Tracking
 * Event: whatsapp_click
 * Parameters: button_location, page_location, page_title
 */
export function trackWhatsappClick(buttonLocation: string) {
  sendGAEvent("whatsapp_click", {
    button_location: buttonLocation,
  });
}

// Alias for capitalization compatibility
export const trackWhatsAppClick = trackWhatsappClick;

/**
 * 4. Email Tracking (mailto: links)
 * Event: email_click
 * Parameters: email, page_location, page_title
 */
export function trackEmailClick(email: string) {
  sendGAEvent("email_click", {
    email,
  });
}

/**
 * 5. Phone Tracking (tel: links)
 * Event: phone_click
 * Parameters: phone, page_location, page_title
 */
export function trackPhoneClick(phone: string) {
  sendGAEvent("phone_click", {
    phone,
  });
}

/**
 * 6. Portfolio Tracking (fired once per page load)
 * Event: portfolio_view
 * Parameters: project_name, project_slug, category
 */
export function trackPortfolioView(projectName: string, projectSlug: string, category: string) {
  sendGAEvent("portfolio_view", {
    project_name: projectName,
    project_slug: projectSlug,
    category,
  });
}

/**
 * 7. Repository Tracking
 * Event: repository_click
 * Parameters: project_name, repository_url, page_location
 */
export function trackRepositoryClick(projectName: string, repositoryUrl: string) {
  sendGAEvent("repository_click", {
    project_name: projectName,
    repository_url: repositoryUrl,
  });
}

/**
 * 8. Service Tracking (fired once per section/page load)
 * Event: service_view
 * Parameters: service_name, service_slug
 */
export function trackServiceView(serviceName: string, serviceSlug: string) {
  sendGAEvent("service_view", {
    service_name: serviceName,
    service_slug: serviceSlug,
  });
}

/**
 * 9. External Link Tracking
 * Event: external_link_click
 * Parameters: destination, link_text, page_location
 */
export function trackExternalLink(destination: string, linkText: string) {
  sendGAEvent("external_link_click", {
    destination,
    link_text: linkText,
  });
}

// Alias for standard naming pattern
export const trackExternalLinkClick = trackExternalLink;

/**
 * 10. Download Tracking
 * Event: download_file
 * Parameters: file_name, file_type, page_location
 */
export function trackDownloadFile(fileName: string, fileType: string) {
  sendGAEvent("download_file", {
    file_name: fileName,
    file_type: fileType,
  });
}

/**
 * Parameters for trackSocialClick
 */
export interface SocialClickParams {
  platform: string;
  destination: string;
  location: string;
  linkText: string;
}

/**
 * Track Social Link Click
 * Event: social_click
 * Parameters: platform, destination, location, link_text, page_location, page_title
 */
export function trackSocialClick({
  platform,
  destination,
  location,
  linkText,
}: SocialClickParams) {
  sendGAEvent("social_click", {
    platform,
    destination,
    location,
    link_text: linkText,
  });
}

/**
 * React Hook for component tracking
 */
export function useAnalytics() {
  const track = useCallback((eventName: string, parameters?: Record<string, unknown>) => {
    sendGAEvent(eventName, parameters);
  }, []);

  return {
    track,
    trackEvent,
    trackGenerateLead,
    trackScheduleDemo,
    trackWhatsappClick,
    trackWhatsAppClick,
    trackPhoneClick,
    trackEmailClick,
    trackPortfolioView,
    trackRepositoryClick,
    trackServiceView,
    trackExternalLink,
    trackExternalLinkClick,
    trackDownloadFile,
    trackSocialClick,
  };
}

/**
 * Reusable React Component for tracking clicks on nested elements
 */
interface TrackClickProps {
  eventName: string;
  parameters?: Record<string, unknown>;
  children: React.ReactElement<{ onClick?: (e: React.MouseEvent<HTMLElement>) => void }>;
}

export function TrackClick({ eventName, parameters, children }: TrackClickProps) {
  const child = React.Children.only(children);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    // Fire GA event
    sendGAEvent(eventName, parameters);

    // Call child onClick if it was provided
    if (child.props.onClick) {
      child.props.onClick(e);
    }
  };

  return React.cloneElement(child, {
    onClick: handleClick,
  });
}
