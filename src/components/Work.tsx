import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultProjects = [
  {
    id: "1",
    title: "E-Commerce Redesign",
    category: "UI/UX Design",
    description: "Complete redesign of an e-commerce platform focusing on conversion optimization and user experience.",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    link: "#",
  },
  {
    id: "2",
    title: "Mobile Banking App",
    category: "App Design",
    description: "Modern banking application with intuitive navigation and seamless transaction flows.",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    link: "#",
  },
  {
    id: "3",
    title: "Brand Identity System",
    category: "Branding",
    description: "Comprehensive brand identity including logo, typography, color system, and guidelines.",
    image_url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    link: "#",
  },
  {
    id: "4",
    title: "Dashboard Analytics",
    category: "Web Development",
    description: "Real-time analytics dashboard with interactive charts and data visualization.",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    link: "#",
  },
];

const Work = () => {
  const { data: dbProjects } = useQuery({
    queryKey: ["projects", "work"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("section", "work")
        .order("sort_order");
      return data;
    },
  });

  const projects = dbProjects?.length ? dbProjects : defaultProjects;

  return (
    <section id="work" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-3">Portfolio</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12">
            Selected <span className="text-gradient">work</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass-card overflow-hidden cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary text-xs font-medium tracking-wider uppercase">
                    {project.category}
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-heading text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm">{project.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
