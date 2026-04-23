// URL do ficheiro CSV no GitHub
const CSV_URL = 'https://raw.githubusercontent.com/SEU_USUARIO/SEU_REPOSITORIO/main/cartas.csv';

let MASTER_DECK = [];

async function loadDeck() {
    try {
        const response = await fetch(CSV_URL);
        const textData = await response.text();
        
        // Divide o texto em linhas
        const rows = textData.split('\n');
        MASTER_DECK = [];
        
        // Começa no índice 1 para ignorar o cabeçalho
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].trim();
            if (row === '') continue;
            
            // Separação por ponto e vírgula (padrão do Excel em português)
            const cols = row.split(';');
            
            // Mapeamento baseado na estrutura do professor:
            // 0:ID, 1:Titulo_PT, 2:Vida_Util, 3:Custo, 4:Impacto_Diario, 
            // 5:Resistencia, 6:Temp_Max, 7:Fonte, 8:Titulo_EN, 
            // 9:Nome_Imagem, 10:Descricao_PT, 11:Descricao_EN
            
            MASTER_DECK.push({
                id: parseInt(cols[0]),
                icon: cols[9] || 'box', // Nome do ícone da Lucide
                color: 'bg-blue-600',   // Cor padrão (pode ser alterada)
                stats: {
                    lifetime: parseInt(cols[2]),
                    cost: parseInt(cols[3]),
                    impact: parseInt(cols[4]),
                    resistance: parseInt(cols[5]),
                    maxTemp: parseInt(cols[6])
                },
                title: { 
                    pt: cols[1], 
                    en: cols[8] 
                },
                type: { 
                    pt: "Material", // Como não há coluna de tipo, usamos um genérico
                    en: "Material" 
                },
                desc: { 
                    pt: cols[10], 
                    en: cols[11] 
                }
            });
        }
        console.log("Cartas carregadas:", MASTER_DECK.length);
    } catch (error) {
        console.error("Erro ao carregar o baralho:", error);
    }
}
