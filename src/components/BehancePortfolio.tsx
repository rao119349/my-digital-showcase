import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProjectCarousel from "@/components/ProjectCarousel";

const defaultProjects = [
  {
    id: "1",
    title: "Brand Campaign Design",
    image_url:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80",
    link: "https://www.behance.net/rao1193",
  },
  {
    id: "2",
    title: "Product Photography",
    image_url:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    link: "https://www.behance.net/rao1193",
  },
  {
    id: "3",
    title: "Illustration Series",
    image_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    link: "https://www.behance.net/rao1193",
  },
  {
    id: "4",
    title: "Web Design Concepts",
    image_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    link: "https://www.behance.net/rao1193",
  },
  {
    id: "5",
    title: "Motion Graphics",
    image_url:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    link: "https://www.behance.net/rao1193",
  },
  {
    id: "6",
    title: "UI Kit Design",
    image_url:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&q=80",
    link: "https://www.behance.net/rao1193",
  },
];

const BehancePortfolio = () => {
  const { data: dbProjects } = useQuery({
    queryKey: ["projects", "behance"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("section", "behance")
        .order("sort_order");
      return data;
    },
  });

  const projects = dbProjects?.length ? dbProjects : defaultProjects;

  return (
    <section id="behance" className="section-padding bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-3">
            Behance
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Behance <span className="text-gradient">portfolio</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl">
            Explore more of my creative work on Behance — from branding to
            illustration.
          </p>
        </motion.div>

        <ProjectCarousel
          projects={projects}
          itemsPerView={3}
          aspectRatio="square"
          animationType="scale"
          renderItem={(project, index) => (
            <motion.a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group relative aspect-square rounded-xl overflow-hidden block"
            >
              <img
                src={project.image_url}
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
          )}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href="https://www.behance.net/rao1193"
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
