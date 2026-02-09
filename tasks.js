// tasks.js
// Gerenciamento de tarefas cyberpunk

let tarefas = [];
let tarefaEditandoId = null;
let filtroAtivo = 'todas';

// Funções de LocalStorage
function salvarNoLocalStorage() {
  localStorage.setItem('tarefasCyberMobb', JSON.stringify(tarefas));
}

function carregarDoLocalStorage() {
  const tarefasSalvas = localStorage.getItem('tarefasCyberMobb');
  if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas);
    // Converte as datas de string para objeto Date
    tarefas.forEach(tarefa => {
      tarefa.dataCriacao = new Date(tarefa.dataCriacao);
    });
  }
}

function abrirFormularioTarefa(editId = null) {
  document.getElementById('formTarefa').style.display = 'block';
  
  // Define a data mínima como hoje
  const hoje = new Date().toISOString().split('T')[0];
  document.getElementById('prazoTarefa').setAttribute('min', hoje);
  
  tarefaEditandoId = editId;
  if (editId) {
    const tarefa = tarefas.find(t => t.id === editId);
    document.getElementById('tituloTarefa').value = tarefa.titulo;
    document.getElementById('descricaoTarefa').value = tarefa.descricao;
    document.getElementById('prazoTarefa').value = tarefa.prazo || '';
    document.getElementById('categoriaTarefa').value = tarefa.categoria;
    document.getElementById('prioridadeTarefa').value = tarefa.prioridade;
  } else {
    document.getElementById('tituloTarefa').value = '';
    document.getElementById('descricaoTarefa').value = '';
    document.getElementById('prazoTarefa').value = '';
    document.getElementById('categoriaTarefa').value = 'Estudo';
    document.getElementById('prioridadeTarefa').value = 'alta';
  }
}

function fecharFormularioTarefa() {
  document.getElementById('formTarefa').style.display = 'none';
  tarefaEditandoId = null;
}

function salvarTarefa() {
  const titulo = document.getElementById('tituloTarefa').value.trim();
  const descricao = document.getElementById('descricaoTarefa').value.trim();
  const prazo = document.getElementById('prazoTarefa').value;
  const categoria = document.getElementById('categoriaTarefa').value;
  const prioridade = document.getElementById('prioridadeTarefa').value;

  // Validação de título
  if (!titulo) {
    alert('⚠️ ERRO: Título obrigatório!');
    return;
  }

  // Validação de prazo (se preenchido, não pode ser no passado)
  if (prazo) {
    const dataPrazo = new Date(prazo + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    if (dataPrazo < hoje) {
      alert('⚠️ ERRO: O prazo não pode ser uma data passada!');
      return;
    }
  }

  if (tarefaEditandoId) {
    editarTarefa(tarefaEditandoId, { titulo, descricao, prazo, categoria, prioridade });
  } else {
    criarTarefa(titulo, descricao, prazo, categoria, prioridade);
  }
  fecharFormularioTarefa();
  renderizarTarefas();
}

function criarTarefa(titulo, descricao, prazo, categoria, prioridade) {
  const novaTarefa = {
    id: Date.now(),
    titulo,
    descricao,
    dataCriacao: new Date(),
    prazo,
    categoria,
    prioridade,
    status: 'pendente',
  };
  tarefas.push(novaTarefa);
  salvarNoLocalStorage();
}

function editarTarefa(id, novosDados) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    Object.assign(tarefa, novosDados);
    salvarNoLocalStorage();
  }
}

function excluirTarefa(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  salvarNoLocalStorage();
  renderizarTarefas();
}

function concluirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.status = 'concluída';
    salvarNoLocalStorage();
  }
  renderizarTarefas();
}

function reabrirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa && tarefa.status === 'concluída') {
    tarefa.status = 'pendente';
    salvarNoLocalStorage();
  }
  renderizarTarefas();
}

function ordenarTarefas(criterio) {
  if (criterio === 'data') {
    tarefas.sort((a, b) => new Date(a.dataCriacao) - new Date(b.dataCriacao));
  } else if (criterio === 'prioridade') {
    const ordem = { 'alta': 1, 'média': 2, 'baixa': 3 };
    tarefas.sort((a, b) => ordem[a.prioridade] - ordem[b.prioridade]);
  } else if (criterio === 'status') {
    tarefas.sort((a, b) => a.status.localeCompare(b.status));
  }
  salvarNoLocalStorage();
  renderizarTarefas();
}

// Função auxiliar para formatar data
function formatarData(dataString) {
  if (!dataString) return '---';
  const [ano, mes, dia] = dataString.split('-');
  return `${dia}/${mes}/${ano}`;
}

function renderizarTarefas() {
  const lista = document.getElementById('tarefasLista');
  lista.innerHTML = '';
  
  // Filtra tarefas com base no filtro ativo
  let tarefasFiltradas = tarefas;
  if (filtroAtivo !== 'todas') {
    tarefasFiltradas = tarefas.filter(t => t.prioridade === filtroAtivo);
  }
  
  // Ordena tarefas por prioridade (alta > média > baixa) e depois por status
  const ordem = { 'alta': 1, 'média': 2, 'baixa': 3 };
  const tarefasOrdenadas = [...tarefasFiltradas].sort((a, b) => {
    // Primeiro ordena por prioridade
    const prioridadeDiff = ordem[a.prioridade] - ordem[b.prioridade];
    if (prioridadeDiff !== 0) return prioridadeDiff;
    
    // Se prioridade igual, pendentes vêm primeiro
    if (a.status === 'pendente' && b.status !== 'pendente') return -1;
    if (a.status !== 'pendente' && b.status === 'pendente') return 1;
    
    // Se tudo igual, mais recentes primeiro
    return new Date(b.dataCriacao) - new Date(a.dataCriacao);
  });
  
  // Se não houver tarefas filtradas, exibe mensagem
  if (tarefasOrdenadas.length === 0) {
    lista.innerHTML = '<p style="text-align: center; opacity: 0.5; margin-top: 40px;">Nenhuma tarefa encontrada com este filtro</p>';
    atualizarContador(0);
    return;
  }
  
  tarefasOrdenadas.forEach(tarefa => {
    const atrasada = tarefa.prazo && tarefa.status === 'pendente' && new Date(tarefa.prazo) < new Date();
    const card = document.createElement('div');
    card.className = `tarefa-card prioridade-${tarefa.prioridade} categoria-${tarefa.categoria.toLowerCase()} status-${tarefa.status}`;
    if (atrasada) card.classList.add('status-atrasada');
    
    // Ícones de prioridade
    const iconePrioridade = {
      'alta': '🔴',
      'média': '🟡',
      'baixa': '🟢'
    };
    
    card.innerHTML = `
      <div class="tarefa-topo">
        <span class="categoria">${tarefa.categoria}</span>
        <span class="prioridade">${iconePrioridade[tarefa.prioridade]} ${tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}</span>
      </div>
      <h2>${tarefa.titulo}</h2>
      <p>${tarefa.descricao}</p>
      <div class="tarefa-info">
        <span>Data: ${new Date(tarefa.dataCriacao).toLocaleDateString('pt-BR')}</span>
        <span>Prazo: ${formatarData(tarefa.prazo)}</span>
        <span>Status: <span class="status-${tarefa.status}${atrasada ? ' status-atrasada' : ''}">${atrasada ? 'Atrasada' : tarefa.status.charAt(0).toUpperCase() + tarefa.status.slice(1)}</span></span>
      </div>
      <div class="tarefa-acoes">
        <button class="btn-cyber" onclick="abrirFormularioTarefa(${tarefa.id})">Editar</button>
        <button class="btn-cyber" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
        ${tarefa.status === 'pendente' ? `<button class="btn-cyber" onclick="concluirTarefa(${tarefa.id})">Concluir</button>` : `<button class="btn-cyber" onclick="reabrirTarefa(${tarefa.id})">Reabrir</button>`}
      </div>
    `;
    lista.appendChild(card);
  });
  
  // Atualiza o contador de tarefas
  atualizarContador(tarefasOrdenadas.length);
}

// Função auxiliar para atualizar contador
function atualizarContador(quantidade) {
  const contador = document.getElementById('contadorTarefas');
  if (contador) {
    contador.textContent = `${quantidade} ${quantidade === 1 ? 'tarefa' : 'tarefas'}`;
  }
}

// Inicialização
carregarDoLocalStorage();
renderizarTarefas();

// Função para filtrar tarefas por prioridade
function filtrarPorPrioridade(prioridade) {
  filtroAtivo = prioridade;
  
  // Atualiza o estado visual dos botões
  const botoes = document.querySelectorAll('.btn-filtro');
  botoes.forEach(btn => {
    btn.classList.remove('active');
    // Verifica qual botão deve estar ativo
    const btnTexto = btn.textContent.toLowerCase();
    if ((prioridade === 'todas' && btnTexto.includes('todas')) ||
        (prioridade !== 'todas' && btnTexto.includes(prioridade))) {
      btn.classList.add('active');
    }
  });
  
  // Re-renderiza as tarefas com o filtro aplicado
  renderizarTarefas();
}

// Adiciona validação em tempo real no campo de prazo
document.addEventListener('DOMContentLoaded', function() {
  const prazoInput = document.getElementById('prazoTarefa');
  
  if (prazoInput) {
    prazoInput.addEventListener('change', function() {
      const dataSelecionada = new Date(this.value + 'T00:00:00');
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (dataSelecionada < hoje) {
        alert('⚠️ Atenção: A data selecionada está no passado!');
        this.value = '';
      }
    });
  }

  // Define a data de hoje como padrão no gerador de trabalho
  const trabalhoDataInput = document.getElementById('trabalhoData');
  if (trabalhoDataInput) {
    const hoje = new Date().toISOString().split('T')[0];
    trabalhoDataInput.value = hoje;
  }
});

// ========== GERENCIAMENTO DE ABAS ==========
function mudarAba(nomeAba) {
  // Remove active de todas as abas
  document.querySelectorAll('.aba-content').forEach(aba => {
    aba.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Ativa a aba selecionada
  if (nomeAba === 'tarefas') {
    document.getElementById('abaTarefas').classList.add('active');
    document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
  } else if (nomeAba === 'gerador') {
    document.getElementById('abaGerador').classList.add('active');
    document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
  } else if (nomeAba === 'resumo') {
    document.getElementById('abaResumo').classList.add('active');
    document.querySelector('.tab-btn:nth-child(3)').classList.add('active');
  }
}

// ========== GERADOR DE ESTRUTURA DE TRABALHO ==========
function gerarTrabalho() {
  const titulo = document.getElementById('trabalhoTitulo').value.trim();
  const nome = document.getElementById('trabalhoNome').value.trim();
  const curso = document.getElementById('trabalhoCurso').value.trim();
  const disciplina = document.getElementById('trabalhoDisciplina').value.trim();
  const professor = document.getElementById('trabalhoProfessor').value.trim();
  const instituicao = document.getElementById('trabalhoInstituicao').value.trim();
  const data = document.getElementById('trabalhoData').value;
  const numCapitulos = parseInt(document.getElementById('trabalhoCapitulos').value) || 3;

  // Validações
  if (!titulo || !nome || !curso || !disciplina || !instituicao) {
    alert('⚠️ ERRO: Preencha todos os campos obrigatórios (*)');
    return;
  }

  // Formata a data
  const dataFormatada = data ? new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', { 
    year: 'numeric', 
    month: 'long' 
  }) : new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' });

  // Gera o conteúdo do trabalho
  let conteudo = `
═══════════════════════════════════════════════════════
                    CAPA DO TRABALHO
═══════════════════════════════════════════════════════

${instituicao.toUpperCase()}
${curso}

${nome}




${titulo.toUpperCase()}




${professor ? 'Professor(a): ' + professor : ''}
${disciplina}
${dataFormatada}

═══════════════════════════════════════════════════════
                        SUMÁRIO
═══════════════════════════════════════════════════════

1. INTRODUÇÃO .......................................... 3
2. DESENVOLVIMENTO ..................................... 5`;

  // Adiciona capítulos do desenvolvimento
  for (let i = 1; i <= numCapitulos; i++) {
    conteudo += `\n   2.${i}. Capítulo ${i} ................................. ${5 + i}`;
  }

  conteudo += `
3. CONCLUSÃO .......................................... ${7 + numCapitulos}
4. REFERÊNCIAS BIBLIOGRÁFICAS ......................... ${8 + numCapitulos}

═══════════════════════════════════════════════════════
                      INTRODUÇÃO
═══════════════════════════════════════════════════════

[ESCREVA AQUI A INTRODUÇÃO DO SEU TRABALHO]

Este trabalho tem como objetivo apresentar e desenvolver o tema 
"${titulo}". Através de uma análise detalhada, busca-se 
compreender os aspectos fundamentais relacionados ao assunto 
proposto.

A escolha do tema se justifica pela relevância e atualidade do 
assunto no contexto de ${disciplina}, sendo fundamental para 
a formação acadêmica e profissional na área de ${curso}.

O presente trabalho está estruturado da seguinte forma: na 
primeira seção, apresenta-se a introdução ao tema; na segunda 
seção, desenvolve-se o conteúdo principal dividido em ${numCapitulos} 
capítulos; e, por fim, na terceira seção, apresentam-se as 
considerações finais sobre o trabalho realizado.

═══════════════════════════════════════════════════════
                    DESENVOLVIMENTO
═══════════════════════════════════════════════════════
`;

  // Adiciona estrutura dos capítulos
  for (let i = 1; i <= numCapitulos; i++) {
    conteudo += `

2.${i}. CAPÍTULO ${i}

[DESENVOLVA AQUI O CONTEÚDO DO CAPÍTULO ${i}]

Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna 
aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
ullamco laboris.

Duis aute irure dolor in reprehenderit in voluptate velit 
esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
occaecat cupidatat non proident, sunt in culpa qui officia 
deserunt mollit anim id est laborum.
`;
  }

  conteudo += `

═══════════════════════════════════════════════════════
                      CONCLUSÃO
═══════════════════════════════════════════════════════

[ESCREVA AQUI A CONCLUSÃO DO SEU TRABALHO]

Ao longo deste trabalho, foi possível compreender os principais 
aspectos relacionados ao tema "${titulo}". 
Os objetivos propostos foram alcançados através da análise 
detalhada apresentada nos capítulos anteriores.

Conclui-se que o tema abordado possui grande relevância no campo 
de ${disciplina}, sendo fundamental para o desenvolvimento 
de conhecimentos na área de ${curso}.

Espera-se que este trabalho possa contribuir para futuras 
pesquisas e estudos relacionados ao tema, servindo como base 
para aprofundamento e discussão do assunto.

═══════════════════════════════════════════════════════
                REFERÊNCIAS BIBLIOGRÁFICAS
═══════════════════════════════════════════════════════

[ADICIONE SUAS REFERÊNCIAS EM FORMATO ABNT]

EXEMPLO, A. B. Título do livro em negrito. Cidade: Editora, 
ano.

AUTOR, C. D. Título do artigo. Nome da Revista, v. X, n. Y, 
p. Z-W, mês ano.

SITE, Nome do. Título da página. Disponível em: <URL>. 
Acesso em: DD mês AAAA.

═══════════════════════════════════════════════════════
              TRABALHO GERADO POR CYBER MOBB
═══════════════════════════════════════════════════════
`;

  // Exibe o resultado
  document.getElementById('trabalhoConteudo').textContent = conteudo;
  document.getElementById('trabalhoGerado').style.display = 'block';
  
  // Scroll suave até o resultado
  document.getElementById('trabalhoGerado').scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  alert('✅ Estrutura do trabalho gerada com sucesso!');
}

function copiarTrabalho() {
  const conteudo = document.getElementById('trabalhoConteudo').textContent;
  navigator.clipboard.writeText(conteudo).then(() => {
    alert('✅ Trabalho copiado para a área de transferência!');
  }).catch(() => {
    alert('❌ Erro ao copiar. Selecione manualmente o texto.');
  });
}

function baixarTrabalho() {
  const conteudo = document.getElementById('trabalhoConteudo').textContent;
  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'trabalho_academico_' + new Date().getTime() + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  alert('✅ Trabalho baixado com sucesso!');
}

function limparTrabalho() {
  if (confirm('🗑️ Tem certeza que deseja limpar o trabalho gerado?')) {
    document.getElementById('trabalhoGerado').style.display = 'none';
    document.getElementById('trabalhoTitulo').value = '';
    document.getElementById('trabalhoNome').value = '';
    document.getElementById('trabalhoCurso').value = '';
    document.getElementById('trabalhoDisciplina').value = '';
    document.getElementById('trabalhoProfessor').value = '';
    document.getElementById('trabalhoInstituicao').value = '';
    document.getElementById('trabalhoCapitulos').value = '3';
  }
}

// ========== GERADOR DE RESUMO AUTOMÁTICO ==========
function gerarResumo() {
  const textoOriginal = document.getElementById('textoOriginal').value.trim();
  const tamanho = document.getElementById('tamanhoResumo').value;

  if (!textoOriginal) {
    alert('⚠️ ERRO: Cole um texto para gerar o resumo!');
    return;
  }

  if (textoOriginal.length < 100) {
    alert('⚠️ AVISO: O texto é muito curto! Para melhores resultados, use textos com pelo menos 100 caracteres.');
  }

  // Define a porcentagem baseada no tamanho escolhido
  let porcentagem;
  switch(tamanho) {
    case 'curto': porcentagem = 0.10; break;
    case 'medio': porcentagem = 0.25; break;
    case 'longo': porcentagem = 0.40; break;
    default: porcentagem = 0.25;
  }

  // Divide o texto em frases
  const frases = textoOriginal.match(/[^.!?]+[.!?]+/g) || [textoOriginal];
  
  // Calcula quantas frases manter
  const numFrasesManter = Math.max(1, Math.ceil(frases.length * porcentagem));

  // Pontuação das frases (algoritmo simplificado)
  const frasesComPontuacao = frases.map((frase, index) => {
    let pontos = 0;
    
    // Prioriza frases do início e fim
    if (index === 0) pontos += 5;
    if (index === frases.length - 1) pontos += 5;
    
    // Pontos por palavras-chave comuns em textos acadêmicos
    const palavrasChave = ['portanto', 'assim', 'conclui', 'importante', 'fundamental', 
                        'objetivo', 'resultado', 'análise', 'pesquisa', 'estudo'];
    palavrasChave.forEach(palavra => {
      if (frase.toLowerCase().includes(palavra)) pontos += 3;
    });
    
    // Penaliza frases muito curtas ou muito longas
    const palavras = frase.split(' ').length;
    if (palavras >= 10 && palavras <= 30) pontos += 2;
    
    return { frase, pontos, index };
  });

  // Ordena por pontuação e pega as melhores
  const melhoresFrases = frasesComPontuacao
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, numFrasesManter)
    .sort((a, b) => a.index - b.index)
    .map(item => item.frase);

  const resumo = melhoresFrases.join(' ');

  // Calcula estatísticas
  const palavrasOriginal = textoOriginal.split(/\s+/).length;
  const palavrasResumo = resumo.split(/\s+/).length;
  const reducao = Math.round((1 - palavrasResumo / palavrasOriginal) * 100);

  // Exibe o resultado
  document.getElementById('resumoConteudo').textContent = resumo;
  document.getElementById('infoOriginal').textContent = `📝 Original: ${palavrasOriginal} palavras`;
  document.getElementById('infoResumo').textContent = `📄 Resumo: ${palavrasResumo} palavras (${reducao}% reduzido)`;
  document.getElementById('resumoGerado').style.display = 'block';
  
  // Scroll suave até o resultado
  document.getElementById('resumoGerado').scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  alert('✅ Resumo gerado com sucesso!');
}

function copiarResumo() {
  const conteudo = document.getElementById('resumoConteudo').textContent;
  navigator.clipboard.writeText(conteudo).then(() => {
    alert('✅ Resumo copiado para a área de transferência!');
  }).catch(() => {
    alert('❌ Erro ao copiar. Selecione manualmente o texto.');
  });
}

function baixarResumo() {
  const conteudo = document.getElementById('resumoConteudo').textContent;
  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resumo_' + new Date().getTime() + '.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  alert('✅ Resumo baixado com sucesso!');
}

function limparResumo() {
  if (confirm('🗑️ Tem certeza que deseja limpar o resumo?')) {
    document.getElementById('resumoGerado').style.display = 'none';
    document.getElementById('textoOriginal').value = '';
  }
}

