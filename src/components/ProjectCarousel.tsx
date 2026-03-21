import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

/**
 * Reusable carousel component for displaying project cards
 *
 * Usage examples:
 * - 2 cards: itemsPerView={2}
 * - 3 cards: itemsPerView={3}
 * - 4 cards: itemsPerView={4}
 * - 5 cards: itemsPerView={5}
 *
 * Responsive behavior:
 * - Mobile (< 768px): 1 card
 * - Desktop (≥ 768px): specified number of cards
 */

interface Project {
  id: string;
  title: string;
  image_url: string;
  link: string;
  category?: string;
  description?: string;
}

interface ProjectCarouselProps {
  projects: Project[];
  /** Number of cards to show per view (e.g., 2, 3, 4, 5, etc.) */
  itemsPerView: number;
  aspectRatio: "video" | "square";
  animationType: "slide" | "scale";
  renderItem: (project: Project, index: number) => ReactNode;
}

const ProjectCarousel = ({
  projects,
  itemsPerView,
  aspectRatio,
  animationType,
  renderItem,
}: ProjectCarouselProps) => {
  // Responsive behavior:
  // - Mobile: 1 card (basis-full)
  // - Desktop (md+): specified number of cards (dynamically calculated)
  const getBasisClass = () => {
    let desktopBasis = "";
    if (itemsPerView === 2) desktopBasis = "md:basis-1/2";
    else if (itemsPerView === 3) desktopBasis = "md:basis-1/3";
    else if (itemsPerView === 4) desktopBasis = "md:basis-1/4";
    else if (itemsPerView === 5) desktopBasis = "md:basis-1/5";
    else if (itemsPerView === 6) desktopBasis = "md:basis-1/6";
    else desktopBasis = `md:basis-[${100 / itemsPerView}%]`;

    return `basis-full ${desktopBasis}`;
  };

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {projects.map((project, i) => (
          <CarouselItem
            key={project.id}
            className={`pl-2 md:pl-4 ${getBasisClass()}`}
          >
            {renderItem(project, i)}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex" />
      <CarouselNext className="hidden md:flex" />
    </Carousel>
  );
};

export default ProjectCarousel;
