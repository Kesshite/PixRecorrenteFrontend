import {
  QrCode,
  MessageCircle,
  GitBranch,
  BarChart3,
  UserCircle,
  Upload,
} from "lucide-react";
import type { Feature } from "@/types";

export const features: Feature[] = [
  {
    icon: <QrCode className="text-emerald-500" size={28} />,
    title: "Pix Automático",
    description:
      "Gere cobranças Pix automaticamente na data de vencimento de cada membro. Sem atraso, sem esquecimento. O Pix cai direto na conta.",
  },
  {
    icon: <MessageCircle className="text-emerald-600" size={28} />,
    title: "WhatsApp Integrado",
    description:
      "Envie cobranças, lembretes e confirmações de pagamento direto no WhatsApp do membro. Comunicação onde ele já está.",
  },
  {
    icon: <GitBranch className="text-blue-500" size={28} />,
    title: "Régua de Cobrança",
    description:
      "Configure lembretes antes, no dia e após o vencimento. A régua cobra automaticamente para que você não precise fazer isso manualmente.",
  },
  {
    icon: <BarChart3 className="text-blue-600" size={28} />,
    title: "Dashboard Financeiro",
    description:
      "Acompanhe em tempo real: recebimentos, inadimplência, previsão de caixa e histórico de pagamentos de cada membro.",
  },
  {
    icon: <UserCircle className="text-amber-500" size={28} />,
    title: "Portal do Membro",
    description:
      "Seus membros acessam boletos, histórico de pagamentos e atualizam dados. Menos ligações, menos trabalho pra você.",
  },
  {
    icon: <Upload className="text-purple-500" size={28} />,
    title: "Import de Membros",
    description:
      "Importe sua base de membros via planilha em segundos. Sem cadastrar um por um. Migre do seu sistema atual sem dor de cabeça.",
  },
];
