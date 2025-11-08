"use client";

import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  A11y,
} from "swiper/modules";
import Image from "next/image";
import { useState, useCallback, useMemo, useEffect } from "react";

// Types
interface CarouselImage {
  id: number;
  title: string;
  src: string;
  alt: string;
  description: string;
}

interface CarouselSettings {
  modules: any[];
  spaceBetween: number;
  slidesPerView: number;
  navigation: boolean | { enabled: boolean; nextEl: string; prevEl: string };
  pagination: {
    clickable: boolean;
    dynamicBullets: boolean;
    dynamicMainBullets: number;
  };
  autoplay: {
    delay: number;
    disableOnInteraction: boolean;
    pauseOnMouseEnter: boolean;
  };
  loop: boolean;
  speed: number;
  effect: string;
  fadeEffect: {
    crossFade: boolean;
  };
  a11y: {
    prevSlideMessage: string;
    nextSlideMessage: string;
    firstSlideMessage: string;
    lastSlideMessage: string;
  };
  breakpoints: {
    [key: number]: {
      slidesPerView: number;
      spaceBetween: number;
    };
  };
}

interface CarouselSlideProps {
  image: CarouselImage;
  isActive: boolean;
}

interface LoadingSkeletonProps {
  className?: string;
}

const CAROUSEL_IMAGES: CarouselImage[] = [
  {
    id: 1,
    title: "Girls Collection",
    src: "/assets/cosmetics_carousel/image1.jpg",
    alt: "Beautiful cosmetics collection for girls",
    description:
      "Discover our vibrant collection designed for young beauty enthusiasts",
  },
  {
    id: 2,
    title: "Ladies Collection",
    src: "/assets/cosmetics_carousel/image2.jpg",
    alt: "Elegant cosmetics collection for ladies",
    description: "Sophisticated beauty products for the modern woman",
  },
  {
    id: 3,
    title: "Men's Collection",
    src: "/assets/cosmetics_carousel/image3.jpg",
    alt: "Premium grooming products for men",
    description: "Premium grooming essentials crafted for men",
  },
  {
    id: 4,
    title: "Luxury Collection",
    src: "/assets/cosmetics_carousel/image4.jpg",
    alt: "Luxury cosmetics collection",
    description: "Indulge in our premium luxury beauty line",
  },
];

const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};

const useCarouselSettings = (): CarouselSettings => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  return useMemo(
    () => ({
      modules: [Navigation, Pagination, Autoplay, EffectFade, A11y],
      spaceBetween: isMobile ? 10 : 30,
      slidesPerView: 1,
      navigation: isMobile
        ? false
        : {
            enabled: true,
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          },
      pagination: {
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 3,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      loop: true,
      speed: 800,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      a11y: {
        prevSlideMessage: "Previous slide",
        nextSlideMessage: "Next slide",
        firstSlideMessage: "This is the first slide",
        lastSlideMessage: "This is the last slide",
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
      },
    }),
    [isMobile]
  );
};

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = "",
}) => (
  <div className={`bg-gray-200 animate-pulse rounded-2xl ${className}`}>
    <div className="w-full h-72 sm:h-96 md:h-[500px] lg:h-[600px] rounded-2xl bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 bg-size-[200%_100%] animate-[shimmer_2s_infinite]" />
  </div>
);

const CarouselSlide: React.FC<CarouselSlideProps> = ({ image, isActive }) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  return (
    <div className="relative w-full h-72 sm:h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden group">
      <div className="absolute inset-0 bg-linear-to-br from-black/10 via-transparent to-black/30 z-10 pointer-events-none" />

      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={isActive}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1000px"
        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
        quality={85}
      />

      {/* Enhanced overlay with gradient */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-linear-to-t from-black/80 via-black/50 to-transparent text-white z-20 transform transition-transform duration-300 group-hover:translate-y-0">
        <h3
          className={`font-bold mb-2 text-shadow-lg ${
            isMobile ? "text-xl" : "text-3xl"
          }`}>
          {image.title}
        </h3>
        <p
          className={`opacity-90 text-shadow max-w-4xl ${
            isMobile ? "text-sm" : "text-base"
          }`}>
          {image.description}
        </p>
      </div>
    </div>
  );
};

const NavigationButton: React.FC<{
  direction: "prev" | "next";
  className?: string;
}> = ({ direction, className = "" }) => (
  <button
    className={`swiper-button-${direction}-custom absolute top-1/2 z-10 w-12 h-12 bg-white/90 hover:bg-white text-gray-800 border-none rounded-full flex items-center justify-center text-2xl font-bold cursor-pointer opacity-0 group-hover:opacity-100 transform -translate-y-1/2 scale-75 hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl ${
      direction === "prev" ? "left-5" : "right-5"
    } ${className}`}
    aria-label={`${direction === "prev" ? "Previous" : "Next"} slide`}>
    {direction === "prev" ? "‹" : "›"}
  </button>
);

const HomeCarousel: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const carouselSettings = useCarouselSettings();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "mobile";

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveSlide(swiper.realIndex);
  }, []);

  const handleSwiperInit = useCallback((swiper: SwiperType) => {
    setSwiperInstance(swiper);
    setIsLoading(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!swiperInstance) return;

      if (event.key === "ArrowLeft") {
        swiperInstance.slidePrev();
      } else if (event.key === "ArrowRight") {
        swiperInstance.slideNext();
      }
    },
    [swiperInstance]
  );

  return (
    <section
      className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8 relative"
      aria-label="Cosmetics collection carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}>
      {isLoading && <LoadingSkeleton className="w-full" />}

      <div className="group relative">
        <Swiper
          {...carouselSettings}
          onSlideChange={handleSlideChange}
          onSwiper={handleSwiperInit}
          className={`rounded-2xl shadow-2xl transition-opacity duration-500 enhanced-carousel ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}>
          {CAROUSEL_IMAGES.map((image, index) => (
            <SwiperSlide key={image.id}>
              <CarouselSlide image={image} isActive={index === activeSlide} />
            </SwiperSlide>
          ))}

          {!isMobile && (
            <>
              <NavigationButton direction="prev" />
              <NavigationButton direction="next" />
            </>
          )}
        </Swiper>

        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium z-30 backdrop-blur-sm">
          <span className="tabular-nums">
            {activeSlide + 1} / {CAROUSEL_IMAGES.length}
          </span>
        </div>

        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full overflow-hidden z-30 hidden sm:block">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{
              width: `${((activeSlide + 1) / CAROUSEL_IMAGES.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        .enhanced-carousel .swiper-pagination-bullet {
          @apply bg-white/50 opacity-100 transition-all duration-300;
        }

        .enhanced-carousel .swiper-pagination-bullet-active {
          @apply bg-white scale-125;
        }

        .enhanced-carousel .swiper-pagination {
          @apply bottom-5;
        }

        .text-shadow {
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
        }

        .text-shadow-lg {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </section>
  );
};

const CarouselLoading: React.FC = () => (
  <section className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
    <div className="bg-gray-100 rounded-2xl flex items-center justify-center h-72 sm:h-96 md:h-[500px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mb-4"></div>
        <p className="text-gray-600 text-sm">Loading carousel...</p>
      </div>
    </div>
  </section>
);

export default dynamic(() => Promise.resolve(HomeCarousel), {
  ssr: false,
  loading: () => <CarouselLoading />,
});
