import type { DocsSiteData } from "./types/configDataTypes";
const siteData: DocsSiteData = {
  title: "MootMoat",
  description: "A DIY method for making engineering experience specific, sourced, and reviewable.",
  navSocials: [],
  footerSocials: [{ social: "MootMoat repository", link: "https://github.com/mechanistic-org/mootmoat", icon: "tabler/brand-github" }],
  // Image replacement belongs to #10; preserve the deployed R2 route.
  defaultImage: { src: "/assets/mootmoat_v17.png", alt: "MootMoat" },
  author: { name: "Erik Norris", email: "erik@mechanistic.com", twitter: "eriknorris" },
};
export default siteData;
