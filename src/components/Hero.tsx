import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeDialog from "@/components/ResumeDialog";
import { PERSONAL_INFO } from "@/constants";

const Hero = () => {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <section className="min-h-screen flex items-center section-padding relative overflow-hidden md:pt-32">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
        <div className="flex-1 min-w-0">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-muted-foreground font-body text-sm tracking-[0.3em] uppercase mb-6"
          >
            Frontend Developer | UI/UX Design Expert
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] mb-8"
          >
            Hi, I'm <span className="text-gradient">{PERSONAL_INFO.name}</span>
            <br />
            <span className="text-muted-foreground/60">I build digital</span>
            <br />
            experiences.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground font-body text-lg md:text-xl max-w-xl mb-10"
          >
            Passionate about crafting seamless digital experiences through clean
            code and intuitive design, with expertise in React, JavaScript, and
            UI/UX design.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold text-base px-8 py-6 gap-2"
              onClick={() => setResumeOpen(true)}
            >
              <Download className="w-5 h-5" />
              Download Resume
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary hover:text-foreground font-heading font-semibold text-base px-8 py-6 gap-2"
              onClick={() =>
                document
                  .getElementById("work")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              View Work
              <ArrowDown className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex-1 flex justify-center lg:justify-end"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden border border-border bg-secondary/50">
            <img
              src="/hero.png"
              alt="Saurav Yadav"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        </motion.div>
      </div>

      <ResumeDialog open={resumeOpen} onOpenChange={setResumeOpen} />
    </section>
  );
};

export default Hero;
