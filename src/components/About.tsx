import { motion } from "framer-motion";
import { User, Briefcase, MapPin, Mail } from "lucide-react";

const aboutDetails = [
  { icon: User, label: "Name", value: "Saurav Yadav" },
  { icon: Briefcase, label: "Role", value: "Frontend Developer | UI/UX Design Expert" },
  { icon: MapPin, label: "Location", value: "Faridabad, Haryana, India" },
  { icon: Mail, label: "Email", value: "sauravyadav1193@gmail.com" },
];

const skills = [
  "React", "JavaScript", "TypeScript", "HTML5", "CSS3", "Bootstrap",
  "Redux", "Figma", "Adobe Creative Suite", "Webpack", "Vite",
  "GitHub", "Tailwind CSS", "Flutter", "Responsive Design", "UI/UX Design",
];

const stats = [
  { number: "8+", label: "Years Experience" },
  { number: "10+", label: "Projects Done" },
  { number: "5+", label: "Happy Clients" },
];

const About = () => {
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
              I'm a frontend developer and UI/UX design expert with 8+ years of experience crafting seamless digital experiences. Currently an Associate → Sr. Software Engineer at Cognizant Technology Solutions, I specialize in building responsive, mobile-first interfaces using React, JavaScript, and modern frontend technologies. I blend design precision with clean code to deliver scalable, user-centered solutions.
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
              {skills.map((skill) => (
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
