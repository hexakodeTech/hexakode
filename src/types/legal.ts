export type PolicyItemType = "bullet" | "paragraph" | "email" | "link";

export interface PolicyItem {
  type: PolicyItemType;
  text: string;
  href?: string;
}

export interface PolicySubSection {
  heading: string;
  items: PolicyItem[];
}

export interface PolicySection {
  id: string;
  number: number;
  title: string;
  /** Top-level intro paragraph before any subsections */
  intro?: string;
  subsections?: PolicySubSection[];
  /** Flat list of items when no subsections are needed */
  items?: PolicyItem[];
}

export interface PolicyMeta {
  title: string;
  lastUpdated: string;
  company: string;
  website: string;
  email: string;
}
