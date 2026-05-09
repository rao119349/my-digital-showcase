import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectCarousel from "./ProjectCarousel";

type LiveProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  link: string;
};

const LiveProjects = () => {
  const [projects, setProjects] = useState<LiveProject[]>([]);
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, category, description, image_url, link")
        .eq("section", "live")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Failed to load live projects:", error);
        setLoading(false);
        return;
      }

      const list = (data ?? []) as LiveProject[];
      setProjects(list);
      setLoading(false);

      // For any project missing an image, fetch the OG image from its URL
      const missing = list.filter(
        (p) => !p.image_url && p.link && p.link !== "#",
      );
      await Promise.all(
        missing.map(async (p) => {
          try {
            const { data: og, error: ogErr } = await supabase.functions.invoke(
              "fetch-og-image",
              { body: { url: p.link } },
            );
            if (!ogErr && og?.image) {
              setImages((prev) => ({ ...prev, [p.id]: og.image as string }));
            }
          } catch (e) {
            console.error("OG fetch failed for", p.link, e);
          }
        }),
      );
    };

    load();
  }, []);

  if (loading) return null;
  if (!projects.length) return null;

  const renderProjectItem = (project: LiveProject, index: number) => {
    const hero = project.image_url || images[project.id];
    return (
      <motion.a
        key={project.id}
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        className="group rounded-2xl overflow-hidden border border-border/50 bg-secondary/30 hover:border-primary/50 transition-colors flex flex-col"
      >
        <div className="aspect-video bg-secondary relative overflow-hidden">
          {hero ? (
            <img
              src={hero}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Globe className="w-10 h-10" />
            </div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
          </div>
          {project.category && (
            <p className="text-xs uppercase tracking-wider text-primary/80 mb-2">
              {project.category}
            </p>
          )}
          {project.description && (
            <p className="text-muted-foreground text-sm line-clamp-3">
              {project.description}
            </p>
          )}
        </div>
      </motion.a>
    );
  };

  return (
    <section id="live" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-3">
            Live
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12">
            Projects I've <span className="text-gradient">developed</span>
          </h2>
        </motion.div>

        <ProjectCarousel
          projects={projects}
          itemsPerView={3}
          aspectRatio="video"
          animationType="slide"
          renderItem={renderProjectItem}
        />
      </div>
    </section>
  );
};

export default LiveProjects;
