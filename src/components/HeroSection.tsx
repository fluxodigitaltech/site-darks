"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import ImageSlider from "@/components/ImageSlider"; // Importa o componente ImageSlider

const HeroSection = () => {
  const heroImages = [
    "https://raw.githubusercontent.com/fluxodigitaltech/img-darks/main/DSC01359.jpg",
    "https://raw.githubusercontent.com/fluxodigitaltech/img-darks/main/DSC01366.jpg",
    "https://raw.githubusercontent.com/fluxodigitaltech/img-darks/main/DSC01391.jpg",
    "https://raw.githubusercontent.com/fluxodigitaltech/img-darks/main/DSC01437.jpg",
  ];

  const scrollToUnits = () => {
    document.getElementById('unidades')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-black overflow-hidden">
      {/* Background Orbs & Technical Grid (mantido do Index.tsx) */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)]" />
      </div>

      <div className="container px-4 md:px-6 relative z-10 pt-24 sm:pt-32 md:pt-40 pb-16 md:pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Lado Esquerdo: Conteúdo de Texto */}
          <div className="text-center md:text-left space-y-6 md:space-y-8">
            <div className="inline-flex items-center justify-center md:justify-start space-x-3 md:space-x-4 w-full md:w-auto">
              <div className="h-[1px] w-8 md:w-12 bg-white/20"></div>
              <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-white/40 uppercase">
                O Novo Padrão de Performance
              </span>
              <div className="h-[1px] w-8 md:w-12 bg-white/20 hidden md:block"></div>
            </div>

            <h1 className="relative">
              <span className="block text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] uppercase italic tracking-tighter">
                DOMINE <br />
                SEU CORPO. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/40 to-white/10">SEU LEGADO.</span>
              </span>
            </h1>

            <p className="text-base md:text-xl text-white/40 md:text-white/30 max-w-2xl md:max-w-none mx-auto md:mx-0 font-medium leading-relaxed">
              Não é apenas uma academia. É um bunker de elite para quem exige o máximo de si mesmo. 24h por dia, sem desculpas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-8 w-full pt-2 md:pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 rounded-none font-black text-base md:text-lg bg-white text-black hover:bg-white/90 transition-all duration-500 group uppercase tracking-widest"
                onClick={scrollToUnits}
              >
                FAZER PARTE
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
              </Button>
            </div>
          </div>

          {/* Lado Direito: Image Slider */}
          <div className="relative h-[280px] sm:h-[360px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-primary/10">
            <ImageSlider images={heroImages} alt="DARK'SGYM Training" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;