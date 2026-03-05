"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useSignupModal } from "@/lib/signup-modal-context";
import { CheckCircle } from "lucide-react";
import type { SignupFormData } from "@/types";

function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidWhatsApp(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function SignupModal() {
  const { isOpen, closeModal } = useSignupModal();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    nome: "",
    whatsapp: "",
    estabelecimento: "",
    segmento: "",
  });

  function handleClose() {
    closeModal();
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ nome: "", whatsapp: "", estabelecimento: "", segmento: "" });
    }, 200);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simula envio (sem integração com Supabase por enquanto)
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    setLoading(false);
  }

  const inputClasses =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow";

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {submitted ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Cadastro recebido!
          </h3>
          <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-6">
            Nossa equipe entrará em contato via WhatsApp para liberar seu acesso
            em até 24h.
          </p>
          <Button onClick={handleClose} className="w-full">
            Fechar
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Entre na lista de espera
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Grátis para até 30 membros
            </p>
          </div>

          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label
                htmlFor="signup-nome"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-nome"
                type="text"
                required
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label
                htmlFor="signup-whatsapp"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-whatsapp"
                type="tel"
                required
                placeholder="(11) 99999-9999"
                value={formData.whatsapp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whatsapp: formatWhatsApp(e.target.value),
                  })
                }
                className={inputClasses}
              />
              {formData.whatsapp &&
                !isValidWhatsApp(formData.whatsapp) && (
                  <p className="text-xs text-red-500 mt-1">
                    Informe um número válido com DDD
                  </p>
                )}
            </div>

            {/* Nome do Estabelecimento */}
            <div>
              <label
                htmlFor="signup-estabelecimento"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Nome do estabelecimento{" "}
                <span className="text-gray-400 dark:text-slate-500 font-normal">(opcional)</span>
              </label>
              <input
                id="signup-estabelecimento"
                type="text"
                placeholder="Nome do seu estabelecimento"
                value={formData.estabelecimento}
                onChange={(e) =>
                  setFormData({ ...formData, estabelecimento: e.target.value })
                }
                className={inputClasses}
              />
            </div>

            {/* Segmento */}
            <div>
              <label
                htmlFor="signup-segmento"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Segmento{" "}
                <span className="text-gray-400 dark:text-slate-500 font-normal">(opcional)</span>
              </label>
              <select
                id="signup-segmento"
                value={formData.segmento}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    segmento: e.target.value as SignupFormData["segmento"],
                  })
                }
                className={inputClasses}
              >
                <option value="">Selecione...</option>
                <option value="academia">Academia</option>
                <option value="estudio">Estúdio</option>
                <option value="escola">Escola</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              loading || !formData.nome || !isValidWhatsApp(formData.whatsapp)
            }
            className="w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Enviando..." : "Entrar na Lista"}
          </Button>

          <p className="text-xs text-gray-400 dark:text-slate-500 text-center mt-4">
            Ao se cadastrar, você concorda com nossos{" "}
            <a href="#" className="underline hover:text-gray-600 dark:hover:text-slate-300">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="underline hover:text-gray-600 dark:hover:text-slate-300">
              Política de Privacidade
            </a>
            .
          </p>
        </form>
      )}
    </Modal>
  );
}
