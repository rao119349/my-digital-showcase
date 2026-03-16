import { PERSONAL_INFO, SOCIAL_LINKS } from "@/constants";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-8 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
        </p>
        <div className="flex gap-6">
          {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
            <a
              key={key}
              href={href}
              className="text-muted-foreground hover:text-primary text-sm transition-colors capitalize"
            >
              {key}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
