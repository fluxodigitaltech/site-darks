"use client";

import React from "react";
import { Activity, Users, Clock, Flame, type LucideIcon } from "lucide-react";

interface StatItemProps {
  icon: LucideIcon;
  value: string;
  label: string;
  sublabel: string;
}

const StatItem = ({ icon: Icon, value, label, sublabel }: StatItemProps) => (
  <div className="relative p-5 md:p-8 border border-white/5 bg-zinc-950/50 group overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-1 bg-white/5 overflow-hidden">
      <div className="h-full bg-white/40 w-1/3 group-hover:w-full transition-all duration-1000" />
    </div>

    <div className="flex items-start justify-between mb-5 md:mb-8 gap-2">
      <div className="p-2 bg-white/5 text-white/20 group-hover:text-white transition-colors flex-shrink-0">
        <Icon size={20} />
      </div>
      <span className="text-[9px] md:text-[10px] font-mono text-white/20 uppercase tracking-[0.15em] md:tracking-[0.2em] text-right">{sublabel}</span>
    </div>

    <div className="space-y-1">
      <h3 className="text-4xl md:text-5xl font-black italic text-white tracking-tighter leading-none">
        {value}
      </h3>
      <p className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.25em] md:tracking-[0.3em] italic">
        {label}
      </p>
    </div>
  </div>
);

const StatsSection = () => {
  return (
    <section className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatItem 
          icon={Clock} 
          value="24H" 
          label="Operação" 
          sublabel="Status: Ativo" 
        />
        <StatItem 
          icon={Users} 
          value="15k+" 
          label="Membros" 
          sublabel="Sync: Online" 
        />
        <StatItem 
          icon={Flame} 
          value="+10" 
          label="Unidades" 
          sublabel="Até o Fim do Ano" 
        />
        <StatItem 
          icon={Activity} 
          value="100%" 
          label="Foco" 
          sublabel="Protocolo: Elite" 
        />
      </div>
    </section>
  );
};

export default StatsSection;