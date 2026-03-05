import { UserPlus, Settings, Zap, type LucideIcon } from "lucide-react";
import { steps } from "@/data/how-it-works";

const iconMap: Record<string, LucideIcon> = {
  UserPlus,
  Settings,
  Zap,
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Como Funciona
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Comece em <span className="text-emerald-600 dark:text-emerald-400">3 passos simples</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300">
            Configure em minutos e comece a receber via Pix automaticamente
            hoje mesmo.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-amber-200 dark:from-emerald-800 dark:via-blue-800 dark:to-amber-800" />

          {steps.map((step) => {
            const Icon = iconMap[step.iconName];
            return (
              <div key={step.number} className="relative text-center">
                {/* Step number circle */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center">
                  {Icon && <Icon className={step.iconColor} size={32} />}
                </div>

                {/* Step number badge */}
                <div className="absolute top-0 right-1/2 translate-x-12 -translate-y-2 w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold z-20">
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
