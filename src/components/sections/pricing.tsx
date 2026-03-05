"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSignupModal } from "@/lib/signup-modal-context";
import { plans } from "@/data/pricing";

export function Pricing() {
  const { openModal } = useSignupModal();

  return (
    <section id="pricing" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Planos
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Planos que cabem no{" "}
            <span className="text-emerald-600 dark:text-emerald-400">seu orçamento</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300">
            Comece grátis com até 30 membros. Sem cartão de crédito. Faça
            upgrade quando quiser.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "p-8 relative",
                plan.highlighted &&
                  "border-2 border-emerald-600 dark:border-emerald-500 shadow-xl lg:scale-105 z-10"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Mais Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                {plan.price !== "R$ 0" && (
                  <span className="text-gray-500 dark:text-slate-400 ml-1">/mês</span>
                )}
              </div>

              <Button
                variant={plan.highlighted ? "primary" : "outline"}
                className="w-full mb-8"
                onClick={openModal}
              >
                {plan.cta}
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={cn(
                        "shrink-0 mt-0.5",
                        plan.highlighted ? "text-emerald-600 dark:text-emerald-400" : "text-emerald-500 dark:text-emerald-400"
                      )}
                      size={18}
                    />
                    <span className="text-sm text-gray-600 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
