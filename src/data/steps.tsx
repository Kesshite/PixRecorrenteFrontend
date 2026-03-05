import { UserPlus, Settings, Zap } from "lucide-react";

export const steps = [
  {
    number: 1,
    icon: <UserPlus className="text-emerald-600" size={32} />,
    title: "Cadastre seus membros",
    description:
      "Importe sua base via planilha ou cadastre manualmente. Nome, WhatsApp, plano e data de vencimento. Pronto.",
  },
  {
    number: 2,
    icon: <Settings className="text-blue-500" size={32} />,
    title: "Configure a régua",
    description:
      "Defina quando enviar lembretes: 3 dias antes, no dia, 1 dia depois. Escolha a mensagem e o canal. WhatsApp, e-mail ou ambos.",
  },
  {
    number: 3,
    icon: <Zap className="text-amber-500" size={32} />,
    title: "Pronto, cobrança automática",
    description:
      "O PixRecorrente cobra seus membros automaticamente no vencimento. Você recebe o Pix e acompanha tudo no dashboard.",
  },
];
