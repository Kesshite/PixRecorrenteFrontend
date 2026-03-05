import type { StepData } from "@/types";

export const steps: StepData[] = [
  {
    number: 1,
    iconName: "UserPlus",
    iconColor: "text-emerald-600",
    title: "Cadastre seus membros",
    description:
      "Importe sua base via planilha ou cadastre manualmente. Nome, WhatsApp, plano e data de vencimento. Pronto.",
  },
  {
    number: 2,
    iconName: "Settings",
    iconColor: "text-blue-500",
    title: "Configure a régua",
    description:
      "Defina quando enviar lembretes: 3 dias antes, no dia, 1 dia depois. Escolha a mensagem e o canal. WhatsApp, e-mail ou ambos.",
  },
  {
    number: 3,
    iconName: "Zap",
    iconColor: "text-amber-500",
    title: "Pronto, cobrança automática",
    description:
      "O PixRecorrente cobra seus membros automaticamente no vencimento. Você recebe o Pix e acompanha tudo no dashboard.",
  },
];
