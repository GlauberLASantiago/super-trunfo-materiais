# 🚀 Super Trunfo: Engenharia de Materiais

Este é um jogo interativo no estilo **Super Trumps (Super Trunfo)** desenvolvido para estudantes e entusiastas de Engenharia de Materiais. O objetivo do simulador é construir de forma lúdica a intuição rápida sobre as propriedades térmicas, econômicas, ambientais e de durabilidade de diversas classes de materiais cerâmicos.

O projeto foi curado pedagogicamente pelo **Departamento de Engenharia de Materiais (DEMa) da UFSCar**.

---

<img width="1268" height="795" alt="image" src="https://github.com/user-attachments/assets/8abf41bc-eab9-4555-a291-64b514ef6079" />



## 🌟 Funcionalidades

- **🃏 Baralho Dinâmico**: As cartas do jogo são carregadas dinamicamente a partir de um arquivo CSV, permitindo fácil atualização do baralho diretamente de um repositório no GitHub ou localmente.
- **🌐 Modo Multijogador Online**: Permite a realização de partidas 1v1 online contra outros jogadores em tempo real por meio de um sistema inovador e leve de comunicação usando **Google Sheets + Google Apps Script** como banco de dados NoSQL temporário.
- **🤖 Modo Singleplayer (CPU)**: Treine suas habilidades contra uma inteligência artificial que calcula dinamicamente a melhor propriedade para desafiar você com base nas estatísticas das cartas dela.
- **📚 Guia de Estudos Dinâmico**: Permite a visualização e exportação de uma tabela completa de consulta técnica com todos os materiais do baralho, incluindo suas descrições e propriedades estruturais, pronta para impressão ou exportação para PDF.
- **🏆 Emissão de Certificados**: Emissão de certificados de conclusão de simulação (em PDF), detalhando as métricas de tempo de jogo, taxa de acerto, interações e materiais estudados.
- **🔊 Painel de Áudio Premium**: Efeitos sonoros interativos de virada de cartas, vitória, derrota e empates, além de uma trilha sonora selecionável para criar um clima imersivo de jogabilidade.
- **🇺🇸/🇧🇷 Totalmente Bilíngue**: Suporte completo a traduções em tempo real entre Português e Inglês para todas as interfaces, cartas, guia de estudos e certificados emitidos.
- **📱 QR Code Integrado**: QR Code de acesso na tela inicial para facilitar a rápida conexão e teste em dispositivos móveis.
- **📱 PWA (Progressive Web App)**: O jogo pode ser instalado diretamente no celular ou computador como um aplicativo nativo e funciona offline graças ao cacheamento dinâmico via Service Workers.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: HTML5 semântico, JavaScript moderno (ES6+), Web Manifest e Service Workers (para suporte offline).
- **Estilização**: Tailwind CSS (via CDN) para layout responsivo e design moderno de vidro (glassmorphic).
- **Biblioteca de Ícones**: Lucide Icons para elementos visuais consistentes.
- **Impressão e PDF**: Motor nativo do navegador para geração fluida de certificados em PDF vetorial.
- **Banco de Dados (Multiplayer)**: Google Sheets API via script customizado em Google Apps Script para evitar custos de servidor tradicional e contornar restrições CORS.

---

## 📝 Estrutura das Cartas (CSV)

O baralho é carregado a partir do arquivo `cartas_ceramica_dados.csv`. O script lê e mapeia dinamicamente os cabeçalhos para atribuir as seguintes informações:

1. **ID**: Identificador numérico da carta.
2. **Titulo_PT / Titulo_EN**: Nome do material em Português e Inglês.
3. **Vida_Util (Lifetime)**: Durabilidade e persistência do material na sua aplicação (medido em anos).
4. **Custo (Cost)**: Fator de custo relativo (menor custo vence a rodada!).
5. **Impacto_Diario (Daily Impact)**: Impacto de pegada ecológica ou energética diária.
6. **Resistencia (Resistance)**: Resistência mecânica, química ou à degradação.
7. **Temp_Max (Max Temp)**: Temperatura máxima de trabalho contínuo suportada (em °C).
8. **Nome_Imagem**: O nome da imagem ou representação visual.
9. **Descricao_PT / Descricao_EN**: Texto explicativo/curiosidade contextualizando a aplicação física do material na engenharia.

---

## 🚀 Como Executar Localmente

Como o projeto é feito puramente em HTML e JavaScript sem dependências pesadas de backend, você pode rodá-lo instantaneamente:

1. Clone este repositório para o seu computador:
   ```bash
   git clone https://github.com/GlauberLASantiago/super-trunfo-materiais.git
   ```
2. Abra a pasta do projeto.
3. Clique duas vezes no arquivo `index.html` ou use uma extensão de servidor local no VS Code (como o *Live Server*) para iniciar.

---

## 🔗 Integração do Multiplayer (Google Sheets)

O modo online do jogo utiliza um script em nuvem executando no Google Drive. Para criar a sua própria instância multiplayer:

1. Crie uma nova planilha no seu Google Sheets.
2. Acesse **Extensões** > **Apps Script**.
3. Copie as definições do arquivo `codigo-sheets.js` da sua planilha/código para o editor de código do Apps Script.
4. Clique em **Implantar** > **Nova Implantação**. Selecione **Aplicativo da Web**, configure para rodar como seu usuário e conceda permissão para "Qualquer pessoa" acessar.
5. Copie a URL gerada e cole-a na constante `APPS_SCRIPT_URL` no topo do arquivo `index.html`:
   ```javascript
   const APPS_SCRIPT_URL = 'SUA_NOVA_URL_AQUI';
   ```

---

## 👥 Créditos e Curadoria

- **Desenvolvimento e Programação**: Glauber Santiago
- **Curadoria dos Dados e Concepção Didática**: Prof. Dr. Marcelo Cilla
- **Parceria Institucional**: [Departamento de Engenharia de Materiais (DEMa) - UFSCar](https://www.dema.ufscar.br)

---

Desenvolvido para fins puramente educacionais e acadêmicos. Sinta-se livre para abrir *Pull Requests* para enriquecer o baralho ou adicionar novas mecânicas de aprendizado! 🚀
