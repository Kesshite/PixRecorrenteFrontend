"use client";

import { Button } from "@/components/ui/button";
import { useSignupModal } from "@/lib/signup-modal-context";
import { ArrowRight, Play, DollarSign, TrendingDown, Users } from "lucide-react";

export function Hero() {
  const { openModal } = useSignupModal();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full px-4 py-1.5 text-sm text-emerald-700 dark:text-emerald-300 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Cobrança via Pix 100% automática
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Automatize cobranças e elimine a{" "}
              <span className="text-emerald-600 dark:text-emerald-400">inadimplência</span> do seu negócio
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 max-w-lg">
              Automatize a cobrança recorrente via Pix com régua de cobrança
              inteligente e WhatsApp integrado. Seus membros pagam em dia, você
              foca no que importa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" onClick={openModal}>
                Começar Grátis
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button variant="outline" size="lg">
                <Play className="mr-2" size={20} />
                Ver Demonstração
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="text-sm text-gray-600 dark:text-slate-400">
                <span className="font-semibold text-gray-900 dark:text-white">Teste grátis</span>{" "}
                — até 30 membros, sem cartão de crédito
              </div>
            </div>
          </div>

          {/* Right illustration - Dashboard mockup */}
          <div className="relative lg:pl-8">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-6 transform lg:rotate-1">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Dashboard</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Cobranças do mês</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/50 rounded-xl p-3 text-center">
                  <DollarSign className="mx-auto text-emerald-600 dark:text-emerald-400 mb-1" size={20} />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">R$ 42k</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Recebido</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-xl p-3 text-center">
                  <Users className="mx-auto text-blue-600 dark:text-blue-400 mb-1" size={20} />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">248</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Membros</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/50 rounded-xl p-3 text-center">
                  <TrendingDown className="mx-auto text-amber-600 dark:text-amber-400 mb-1" size={20} />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">12%</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Inadimplência</p>
                </div>
              </div>

              {/* Cobranças list */}
              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <span className="text-emerald-700 dark:text-emerald-300 text-xs font-bold">MR</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Maria R.</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Mensal - R$ 129,90</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-full">Pago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <span className="text-blue-700 dark:text-blue-300 text-xs font-bold">JS</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">João S.</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Mensal - R$ 99,90</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-full">Pendente</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <span className="text-purple-700 dark:text-purple-300 text-xs font-bold">AL</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Ana L.</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">Mensal - R$ 149,90</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-full">Pago</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 text-lg">✓</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Pix confirmado</p>
                <p className="text-xs text-gray-500 dark:text-slate-400">R$ 129,90 recebido agora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
