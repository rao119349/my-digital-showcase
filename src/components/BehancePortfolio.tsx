import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const behanceProjects = [
  {
    title: "Brand Campaign Design",
    thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80",
    behanceUrl: "https://www.behance.net/",
  },
  {
    title: "Product Photography",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    behanceUrl: "https://www.behance.net/",
  },
  {
    title: "Illustration Series",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    behanceUrl: "https://www.behance.net/",
  },
  {
    title: "Web Design Concepts",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    behanceUrl: "https://www.behance.net/",
  },
  {
    title: "Motion Graphics",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    behanceUrl: "https://www.behance.net/",
  },
  {
    title: "UI Kit Design",
    thumbnail: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&q=80",
    behanceUrl: "https://www.behance.net/",
  },
];

const BehancePortfolio = () => {
  return (
    <section id="behance" className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-3">Behance</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Behance <span className="text-gradient">portfolio</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl">
            Explore more of my creative work on Behance — from branding to illustration.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {behanceProjects.map((project, i) => (
            <motion.a
              key={project.title}
              href={project.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 p-4">
                <ExternalLink className="w-6 h-6 text-primary" />
                <p className="font-heading text-sm font-semibold text-center text-foreground">
                  {project.title}
                </p>
                <span className="text-xs text-primary">View on Behance</span>
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href="https://www.behance.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-heading font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            View Full Behance Profile
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BehancePortfolio;
