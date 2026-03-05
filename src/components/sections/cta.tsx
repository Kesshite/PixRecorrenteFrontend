"use client";

import { Button } from "@/components/ui/button";
import { useSignupModal } from "@/lib/signup-modal-context";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  const { openModal } = useSignupModal();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 dark:from-emerald-900 dark:via-emerald-950 dark:to-slate-950" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/90 font-medium mb-8">
          <Sparkles size={16} />
          Grátis para até 30 membros, sem cartão de crédito
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Pronto para acabar com a inadimplência do seu estabelecimento?
        </h2>

        <p className="text-lg sm:text-xl text-emerald-100 dark:text-emerald-200/80 mb-10 max-w-2xl mx-auto">
          Comece hoje mesmo a automatizar suas cobranças via Pix e reduza a
          inadimplência com o PixRecorrente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="!bg-white !text-emerald-700 hover:!bg-emerald-50 shadow-lg dark:!bg-white dark:!text-emerald-700 dark:hover:!bg-emerald-50"
            onClick={openModal}
          >
            Começar Grátis Agora
            <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10"
          >
            Agendar Demonstração
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>Setup em 5 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>Suporte em português</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckIcon />
            <span>Cancele quando quiser</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-amber-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
