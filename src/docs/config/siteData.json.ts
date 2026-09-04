import type { DocsSiteData } from "./types/configDataTypes";
const siteData: DocsSiteData = {
  title: "MootMoat",
  description: "A DIY method for making engineering experience specific, sourced, and reviewable.",
  navSocials: [],
  footerSocials: [{ social: "MootMoat repository", link: "https://github.com/mechanistic-org/mootmoat", icon: "tabler/brand-github" }],
  // Release asset is staged in docs/release-assets; #11 uploads it before deployment.
  defaultImage: { src: "/assets/mootmoat_v18.png", alt: "MootMoat - Make the work reviewable." },
  author: { name: "Erik Norris", email: "erik@mechanistic.com", twitter: "eriknorris" },
};
export default siteData;
