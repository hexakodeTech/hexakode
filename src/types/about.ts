import { LucideIcon } from "lucide-react";

export interface CoreValue {
  id: string;
  icon: LucideIcon; // We will use lucide-react icons
  title: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageAlt: string;
  imageUrl: string;
  socialUrl: string;
}

export interface TrustMetric {
  id: string;
  value: string;
  label: string;
}

export interface TrustPoint {
  id: string;
  number: string;
  title: string;
  description: string;
}
