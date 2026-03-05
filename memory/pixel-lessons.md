# Pixel - Lições Aprendidas

- Sempre testar botões em AMBOS os temas (light e dark). Botões com cores forçadas via className podem ficar invisíveis quando o tema muda. Atenção especial a botões sobre fundos coloridos (gradients, seções com bg fixo).

## Regras de Negócio
- CNPJ é string livre (não validar formato numérico). O Brasil passará a ter CNPJ alfanumérico. Aceitar qualquer string, sem máscara fixa.
- CPF continua numérico com validação de dígitos verificadores.
