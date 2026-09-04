// site data types

export type Social = {
  social: string;
  link: string;
  icon: string;
};

export type DocsSiteData = {
  title: string;
  description: string;
  navSocials: Social[] | undefined;
  footerSocials: Social[] | undefined;
  defaultImage: {
    src: string;
    alt: string;
  };
  author: {
    name: string;
    email: string;
    twitter: string; // used for twitter cards when sharing a blog post on twitter
  };
};

// --------------------------------------------------------
// nav data types
export interface navLinkItem {
  text: string;
  link: string;
  newTab?: boolean; // adds target="_blank" rel="noopener noreferrer" to link
}

export type navItem = navLinkItem;

// --------------------------------------------------------
// site settings types
export interface DocsSiteSettingsProps {
  useViewTransitions?: boolean;
  copyLinkButtons?: boolean;
  pagination?: boolean;
  docsRoute?: string;
}
