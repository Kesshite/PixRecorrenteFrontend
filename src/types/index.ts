export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureData {
  iconName: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface StepData {
  number: number;
  iconName: string;
  iconColor: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export interface SignupFormData {
  nome: string;
  whatsapp: string;
  estabelecimento: string;
  segmento: "" | "academia" | "estudio" | "escola" | "outro";
}
