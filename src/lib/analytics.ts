"use client";

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

  // Get current page location dynamically
  const pageLocation = window.location.href;

  const eventParams = {
    page_location: pageLocation,
    ...params,
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[GA4 Track Event (gtag missing/Dev)] Event: "${eventName}"`, eventParams);
  }
}

/**
 * 2. Track Contact Form Submission
 * Event Name: generate_lead
 * Parameters: form_name: "contact", page_location
 */
export function trackGenerateLead(formName: string = "contact") {
  sendGAEvent("generate_lead", {
    form_name: formName,
  });
}

/**
 * 3. Track Schedule Demo Submission
 * Event Name: schedule_demo
 * Parameters: form_name: "schedule_demo", page_location
 */
export function trackScheduleDemo(formName: string = "schedule_demo") {
  sendGAEvent("schedule_demo", {
    form_name: formName,
  });
}

/**
 * 4. Track WhatsApp Button/Link Clicks
 * Event Name: whatsapp_click
 * Parameters: button_location, page_location
 */
export function trackWhatsAppClick(buttonLocation: string) {
  sendGAEvent("whatsapp_click", {
    button_location: buttonLocation,
  });
}

/**
 * 5. Track Email Click (mailto: links)
 * Event Name: email_click
 * Parameters: email, page_location
 */
export function trackEmailClick(email: string) {
  sendGAEvent("email_click", {
    email: email,
  });
}

/**
 * 6. Track Phone Number Clicks (tel: links)
 * Event Name: phone_click
 * Parameters: phone, page_location
 */
export function trackPhoneClick(phone: string) {
  sendGAEvent("phone_click", {
    phone: phone,
  });
}

/**
 * 7. Track Portfolio Views (fired once per page load)
 * Event Name: portfolio_view
 * Parameters: project_name, project_slug, page_location
 */
export function trackPortfolioView(projectName: string, projectSlug: string) {
  sendGAEvent("portfolio_view", {
    project_name: projectName,
    project_slug: projectSlug,
  });
}

/**
 * 8. Track Repository Link Clicks (GitHub links)
 * Event Name: repository_click
 * Parameters: repository_url, project_name, page_location
 */
export function trackRepositoryClick(repositoryUrl: string, projectName: string) {
  sendGAEvent("repository_click", {
    repository_url: repositoryUrl,
    project_name: projectName,
  });
}

/**
 * 9. Track External Link Clicks (when leaving the site)
 * Event Name: external_link_click
 * Parameters: destination, link_text, page_location
 */
export function trackExternalLinkClick(destination: string, linkText: string) {
  sendGAEvent("external_link_click", {
    destination: destination,
    link_text: linkText,
  });
}

/**
 * 10. Track Service Page/Section Views (fired once per section load)
 * Event Name: service_view
 * Parameters: service_name, page_location
 */
export function trackServiceView(serviceName: string) {
  sendGAEvent("service_view", {
    service_name: serviceName,
  });
}
