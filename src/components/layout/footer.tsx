import { Mail, Phone, MapPin } from "lucide-react";
import { footerLinkGroups } from "@/data/footer-links";

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 text-gray-300 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PR</span>
              </div>
              <span className="text-xl font-bold text-white">
                Pix<span className="text-emerald-400">Recorrente</span>
              </span>
            </a>
            <p className="text-sm text-gray-400 dark:text-slate-500 mb-6 max-w-xs">
              Plataforma de cobrança recorrente via Pix para qualquer negócio
              com mensalistas. Reduza a inadimplência hoje.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-400 dark:text-slate-500">
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>contato@pixrecorrente.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 dark:text-slate-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-slate-600">
            &copy; {new Date().getFullYear()} PixRecorrente. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-slate-600">
              Feito com dedicação para negócios brasileiros
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
