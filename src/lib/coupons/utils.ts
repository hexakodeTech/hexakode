export function calculateCouponStatus(
  enabled: boolean,
  currentEnquiries: number,
  maxLimit: number,
  expiryType: string,
  expiryDate: Date | null,
  startDate: Date
): "Active" | "Expired" | "Exhausted" | "Disabled" | "Scheduled" {
  if (!enabled) {
    return "Disabled";
  }
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  if (today < start) {
    return "Scheduled";
  }
  
  if (expiryType === "custom" && expiryDate) {
    const expiry = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
    if (today > expiry) {
      return "Expired";
    }
  }
  
  if (currentEnquiries >= maxLimit) {
    return "Exhausted";
  }
  
  return "Active";
}
