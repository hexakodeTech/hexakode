import { Variants } from "framer-motion";

/**
 * Standard Fade Up animation variant
 * Y: 20px -> 0px, Opacity: 0 -> 1
 * Duration: 600ms, Curve: easeOut
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Reusable slide in animation variant
 * X: -20px -> 0px, Opacity: 0 -> 1
 * Duration: 600ms, Curve: easeOut
 */
export const slideIn: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

/**
 * Container variant to stagger child reveals by 100ms delay increments
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
