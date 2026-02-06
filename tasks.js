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
});
