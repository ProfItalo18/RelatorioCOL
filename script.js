const CHECKLIST_DB = {
    pedagogica: {
        "1. Funções Cognitivas": [
            { label: "Atenção Instável / Dispersa", texto: "Demonstra dificuldade significativa em manter o foco em atividades dirigidas.", indicacao: "Atividades de curta duração com reforço positivo imediato." },
            { label: "Boa Capacidade de Atenção", texto: "Mantém atenção adequada nas atividades propostas.", indicacao: "" },
            { label: "Memória de Curto Prazo Comprometida", texto: "Dificuldade em reter instruções recentes e sequências simples.", indicacao: "Jogos da memória e repetição sistemática de comandos." },
            { label: "Raciocínio Lógico Concreto", texto: "Depende de apoio concreto para resolução de problemas.", indicacao: "Uso intensivo de material dourado, ábaco e blocos lógicos." }
        ],
        "2. Leitura e Escrita": [
            { label: "Nível Pré-Silábico", texto: "Encontra-se em hipótese de escrita pré-silábica (não relaciona sons a letras).", indicacao: "Estimulação da consciência fonológica e diferenciação desenho/escrita." },
            { label: "Nível Silábico", texto: "Escreve uma letra para cada sílaba sonora.", indicacao: "Atividades de completação de palavras e análise sonora." },
            { label: "Não Alfabetizado", texto: "Não domina o código alfabético.", indicacao: "Atividades lúdicas de letramento e reconhecimento do nome próprio." }
        ],
        "3. Raciocínio Matemático": [
            { label: "Não Identifica Numerais", texto: "Não identifica numerais básicos (0 a 10).", indicacao: "Jogos de bingo, amarelinha e músicas numéricas." },
            { label: "Não Relaciona Número/Quantidade", texto: "Conta mecanicamente mas não associa à quantidade.", indicacao: "Atividades concretas de contagem e pareamento." }
        ]
    },
    clinica: {
        "1. Saúde Geral": [
            { label: "Atraso DNPM", texto: "Histórico de atraso significativo no Desenvolvimento Neuropsicomotor.", encam: "Avaliação com Neuropediatra." },
            { label: "Convulsões/Epilepsia", texto: "Relato de crises convulsivas (em tratamento).", encam: "Acompanhamento Neurológico regular." }
        ],
        "2. Linguagem": [
            { label: "Ausência de Fala", texto: "Não utiliza linguagem oral para comunicação.", encam: "Avaliação Fonoaudiológica (Comunicação Alternativa)." },
            { label: "Ecolalia", texto: "Apresenta ecolalia (repetição de falas) imediata ou tardia.", encam: "" }
        ],
        "3. Sensorial": [
            { label: "Hipersensibilidade Auditiva", texto: "Demonstra incômodo com barulhos altos.", encam: "Terapia Ocupacional (Integração Sensorial)." }
        ]
    },
    social: {
        "1. Contexto Familiar": [
            { label: "Vulnerabilidade Social", texto: "Família encontra-se em situação de vulnerabilidade socioeconômica.", encam: "Acompanhamento sistemático pelo CRAS." },
            { label: "Família Participativa", texto: "Família demonstra interesse e participa ativamente da vida escolar.", encam: "" }
        ],
        "2. Benefícios": [
            { label: "Beneficiário BPC", texto: "Família já é beneficiária do BPC.", encam: "" },
            { label: "Demanda BPC/LOAS", texto: "Perfil para benefício, mas ainda não acessou.", encam: "Orientações para requerimento do BPC/LOAS." }
        ]
    }
};

const dadosRelatorio = { pedagogica: { texto: '', extra: '' }, clinica: { texto: '', extra: '' }, social: { texto: '', extra: '' } };
let modalAtual = '';

document.addEventListener('DOMContentLoaded', () => {
    const hoje = new Date();
    document.getElementById('dataAtual').innerText = hoje.toLocaleDateString('pt-BR', {day:'numeric', month:'long', year:'numeric'});

    document.querySelectorAll('textarea').forEach(tx => {
        const mirror = document.createElement('div');
        mirror.className = 'print-mirror';
        tx.parentNode.insertBefore(mirror, tx.nextSibling);
        
        const sync = () => {
            mirror.innerText = tx.value;
            tx.style.height = 'auto';
            tx.style.height = (tx.scrollHeight + 5) + 'px';
        };
        tx.addEventListener('input', sync);
        tx.mirrorDiv = mirror;
        sync();
    });
});

function atualizarAssinaturas() {
    const sNome = document.getElementById('nomeSoc').value; const sReg = document.getElementById('regSoc').value;
    document.getElementById('assSoc').innerText = sNome ? `${sNome} ${sReg ? '- CRESS ' + sReg : ''}` : '';
}

function abrirModal(tipo) {
    modalAtual = tipo;
    const container = document.getElementById('container-checklist');
    const labelExtra = document.getElementById('labelExtra');
    
    labelExtra.innerText = tipo === 'pedagogica' ? "Indicações (Automático):" : "Encaminhamentos (Automático):";
    document.getElementById('modalTexto').value = dadosRelatorio[tipo].texto;
    document.getElementById('modalExtra').value = dadosRelatorio[tipo].extra;
    
    container.innerHTML = "";
    const dados = CHECKLIST_DB[tipo];
    if(dados) {
        for(const [cat, itens] of Object.entries(dados)) {
            let html = `<div class="grupo-checklist"><h5>${cat}</h5>`;
            itens.forEach((it) => {
                html += `<div class="item-check"><input type="checkbox" onchange="procCheck(this, '${it.texto}', '${it.indicacao||it.encam||''}')"><label>${it.label}</label></div>`;
            });
            container.innerHTML += html + "</div>";
        }
    }
    document.getElementById('modalOverlay').style.display = 'flex';
}

function procCheck(chk, txt, ext) {
    const t = document.getElementById('modalTexto'); const e = document.getElementById('modalExtra');
    if(chk.checked) {
        if(!t.value.includes(txt)) t.value += (t.value?"\n":"")+txt;
        if(ext && !e.value.includes(ext)) e.value += (e.value?"\n- ":"- ")+ext;
    }
}

function salvarModal() {
    dadosRelatorio[modalAtual].texto = document.getElementById('modalTexto').value;
    dadosRelatorio[modalAtual].extra = document.getElementById('modalExtra').value;
    
    const pag = document.getElementById(`texto-${modalAtual}`);
    pag.value = dadosRelatorio[modalAtual].texto;
    if(pag.mirrorDiv) pag.mirrorDiv.innerText = pag.value;
    
    const st = document.getElementById(`status-${modalAtual}`);
    if(pag.value) { st.innerHTML = `<i class="fas fa-check-circle"></i> OK`; st.className = "status salvo"; }
    
    atualizarFinais();
    fecharModal();
}

function atualizarFinais() {
    const ind = document.getElementById('final-indicacoes');
    if(dadosRelatorio.pedagogica.extra && !ind.value.includes(dadosRelatorio.pedagogica.extra)) {
        ind.value = dadosRelatorio.pedagogica.extra; 
    }
    if(ind.mirrorDiv) ind.mirrorDiv.innerText = ind.value;

    let enc = "";
    if(dadosRelatorio.clinica.extra) enc += "SAÚDE:\n" + dadosRelatorio.clinica.extra + "\n";
    if(dadosRelatorio.social.extra) enc += "SOCIAL:\n" + dadosRelatorio.social.extra;
    
    const finEnc = document.getElementById('final-encaminhamentos');
    if(enc && !finEnc.value.includes(enc.trim())) {
        finEnc.value = enc;
    }
    if(finEnc.mirrorDiv) finEnc.mirrorDiv.innerText = finEnc.value;
}

function fecharModal() { document.getElementById('modalOverlay').style.display = 'none'; }

function gerarConclusaoAutomatica() {
    const nome = document.getElementById('nomeEstudante').value || "O estudante";
    const p = dadosRelatorio.pedagogica.texto;
    const conc = document.getElementById('final-conclusao');
    conc.value = `CONCLUSÃO DIAGNÓSTICA:\n\nConsiderando o processo avaliativo, conclui-se que ${nome} apresenta necessidades educacionais específicas.\n\nNo aspecto Pedagógico: ${p.replace(/\n/g, ". ")}.`;
    if(conc.mirrorDiv) conc.mirrorDiv.innerText = conc.value;
}

function calcularIdade() {
    const nasc = document.getElementById('dataNascimento').value;
    if(nasc) {
        const hoje = new Date(); const n = new Date(nasc);
        let idade = hoje.getFullYear() - n.getFullYear();
        if(hoje < new Date(hoje.getFullYear(), n.getMonth(), n.getDate())) idade--;
        document.getElementById('idade').value = idade + " anos";
    }
}