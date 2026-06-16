import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "../schemaTypes";
import { createElement } from "react";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "hexakode-project";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// HexaKode Custom Branding Logo Component using React.createElement
// to avoid JSX in .ts files and resolve parsing errors.
function HexaKodeLogo() {
  return createElement(
    "div",
    { style: { display: "flex", alignItems: "center", gap: "10px", padding: "4px 8px" } },
    createElement("img", {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5_VqrmGo0Yyz2eCzbJ2FcbcrPZN_jWkAN6euuVQzxrMkBQ2CfDpOjYWVe3aq_AIEswpv2MS4XO9VgfvgOFIYMSC9rIm3SjEQNwjrtmhhJmp1ft5nzoPat2z9QwmJwgn0zJZJsMIPoV_gQAD4p0NGbbo0TUaWEuuKEfg6nSP7dh7vq5hNBrqxnYyEYRa9qzr-Tg45hOyEIhgvax0BWxfDDB6uswBvAKj-sJbsOilWcd1wIOkM4PBdSVCjBDaXsnpVcMmsk_TKfO8Xk",
      alt: "HexaKode Logo",
      style: { height: "24px", width: "auto" },
    }),
    createElement(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      createElement(
        "span",
        { style: { fontWeight: "bold", fontSize: "14px", lineHeight: "1.1", color: "#ffffff" } },
        "HexaKode CMS"
      ),
      createElement(
        "span",
        { style: { fontSize: "9px", color: "rgba(255, 255, 255, 0.6)", letterSpacing: "0.5px" } },
        "Code that powers growth"
      )
    )
  );
}

export default defineConfig({
  name: "hexakode-cms",
  title: "HexaKode CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
  studio: {
    components: {
      logo: HexaKodeLogo,
    },
  },
});
