// ============================================================
// GOOGLE APPS SCRIPT BACKEND
// Cole este código em Ferramentas > Editor de scripts no
// Google Sheets e publique como aplicativo da Web.
// ============================================================

const SHEET_NAME = 'Rooms';

function doGet(e) {
    const action = e.parameter.action;
    const ss     = SpreadsheetApp.getActiveSpreadsheet();
    const sheet  = ss.getSheetByName(SHEET_NAME);

    if (action === 'getRooms') {
        const data  = sheet.getDataRange().getValues();
        const rooms = [];
        for (let i = 1; i < data.length; i++) {
            if (data[i][2] === 'waiting') {
                rooms.push({ id: data[i][0], player1_nickname: data[i][1] });
            }
        }
        return ContentService.createTextOutput(JSON.stringify({ success: true, rooms }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    if (action === 'getState') {
        const roomId = e.parameter.roomId;
        const data   = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length; i++) {
            if (data[i][0] === roomId) {
                const row = data[i];
                return ContentService.createTextOutput(JSON.stringify({
                    success   : true,
                    status    : row[2],
                    player2   : row[3],
                    gameState : JSON.parse(row[4] || '{}')
                })).setMimeType(ContentService.MimeType.JSON);
            }
        }
        // Sala não encontrada: tratada como finalizada pelo cliente
        return ContentService.createTextOutput(JSON.stringify({ success: true, status: 'finished' }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Ação inválida' }))
        .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
    const data  = JSON.parse(e.postData.contents);
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (data.action === 'createRoom') {
        const roomId = 'room_' + new Date().getTime();
        sheet.appendRow([roomId, data.player1, 'waiting', '', JSON.stringify(data.gameState)]);
        return ContentService.createTextOutput(JSON.stringify({ success: true, roomId }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === 'joinRoom') {
        const rows = sheet.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === data.roomId && rows[i][2] === 'waiting') {
                sheet.getRange(i + 1, 3).setValue('playing');
                sheet.getRange(i + 1, 4).setValue(data.player2);
                const gameState = JSON.parse(rows[i][4] || '{}');
                return ContentService.createTextOutput(JSON.stringify({ success: true, gameState }))
                    .setMimeType(ContentService.MimeType.JSON);
            }
        }
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Sala não encontrada ou indisponível' }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === 'updateState') {
        const rows = sheet.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === data.roomId) {
                if (data.status)    sheet.getRange(i + 1, 3).setValue(data.status);
                if (data.gameState) sheet.getRange(i + 1, 5).setValue(JSON.stringify(data.gameState));
                return ContentService.createTextOutput(JSON.stringify({ success: true }))
                    .setMimeType(ContentService.MimeType.JSON);
            }
        }
        return ContentService.createTextOutput(JSON.stringify({ success: false }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === 'deleteRoom') {
        const rows = sheet.getDataRange().getValues();
        for (let i = 1; i < rows.length; i++) {
            if (rows[i][0] === data.roomId) {
                sheet.deleteRow(i + 1);
                return ContentService.createTextOutput(JSON.stringify({ success: true }))
                    .setMimeType(ContentService.MimeType.JSON);
            }
        }
        // Sala já foi removida — não é erro
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Ação inválida' }))
        .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// CARREGAMENTO DO BARALHO (lado do cliente / referência)
// ============================================================

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
