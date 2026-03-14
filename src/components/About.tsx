import { motion } from "framer-motion";
import { User, Briefcase, MapPin, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const defaultDetails = [
  { icon: User, label: "Name", value: "Your Name" },
  { icon: Briefcase, label: "Role", value: "UI/UX Designer & Developer" },
  { icon: MapPin, label: "Location", value: "Your City, Country" },
  { icon: Mail, label: "Email", value: "hello@youremail.com" },
];

const defaultSkills = [
  "UI/UX Design", "React", "TypeScript", "Figma",
  "Adobe Creative Suite", "Framer", "Tailwind CSS", "Next.js",
];

const About = () => {
  const { data: setting } = useQuery({
    queryKey: ["site-settings", "about"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "about")
        .maybeSingle();
      return data?.value as any | null;
    },
  });

  const aboutDetails = setting
    ? [
        { icon: User, label: "Name", value: setting.name || "Your Name" },
        { icon: Briefcase, label: "Role", value: setting.role || "UI/UX Designer & Developer" },
        { icon: MapPin, label: "Location", value: setting.location || "Your City, Country" },
        { icon: Mail, label: "Email", value: setting.email || "hello@youremail.com" },
      ]
    : defaultDetails;

  const skills = setting?.skills?.length ? setting.skills : defaultSkills;
  const stats = [
    { number: setting?.years_exp || "5+", label: "Years Experience" },
    { number: setting?.projects_done || "50+", label: "Projects Done" },
    { number: setting?.happy_clients || "30+", label: "Happy Clients" },
  ];

  return (
    <section id="about" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-3">About</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-12">
            A bit about <span className="text-gradient">me</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {setting?.bio ||
                "I'm a creative professional with a passion for designing intuitive and visually compelling digital experiences. With expertise spanning design and development, I bridge the gap between aesthetics and functionality."}
            </p>
            <div className="space-y-4">
              {aboutDetails.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">{item.label}</p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-heading text-xl font-semibold mb-6">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border/50 hover:border-primary/50 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-heading text-3xl font-bold text-gradient">{stat.number}</p>
                  <p className="text-muted-foreground text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
