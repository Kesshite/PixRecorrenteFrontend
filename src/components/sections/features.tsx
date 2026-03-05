import { Card } from "@/components/ui/card";
import {
  QrCode,
  MessageCircle,
  GitBranch,
  BarChart3,
  UserCircle,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { features } from "@/data/features";

const iconMap: Record<string, LucideIcon> = {
  QrCode,
  MessageCircle,
  GitBranch,
  BarChart3,
  UserCircle,
  Upload,
};

export function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Funcionalidades
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Tudo que seu estabelecimento precisa para{" "}
            <span className="text-emerald-600 dark:text-emerald-400">cobrar melhor</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300">
            Do cadastro do membro ao recebimento do Pix, o PixRecorrente
            automatiza toda a jornada de cobrança.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = iconMap[feature.iconName];
            return (
              <Card key={feature.title} className="p-8">
                <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-5">
                  {Icon && <Icon className={feature.iconColor} size={28} />}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
