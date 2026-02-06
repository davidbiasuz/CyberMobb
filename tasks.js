// tasks.js
// Gerenciamento de tarefas cyberpunk

let tarefas = [];
let tarefaEditandoId = null;

function abrirFormularioTarefa(editId = null) {
  document.getElementById('formTarefa').style.display = 'block';
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
  const titulo = document.getElementById('tituloTarefa').value;
  const descricao = document.getElementById('descricaoTarefa').value;
  const prazo = document.getElementById('prazoTarefa').value;
  const categoria = document.getElementById('categoriaTarefa').value;
  const prioridade = document.getElementById('prioridadeTarefa').value;

  if (!titulo) return alert('Título obrigatório!');

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
}

function editarTarefa(id, novosDados) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) Object.assign(tarefa, novosDados);
}

function excluirTarefa(id) {
  tarefas = tarefas.filter(t => t.id !== id);
  renderizarTarefas();
}

function concluirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) tarefa.status = 'concluída';
  renderizarTarefas();
}

function reabrirTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa && tarefa.status === 'concluída') tarefa.status = 'pendente';
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
  renderizarTarefas();
}

function renderizarTarefas() {
  const lista = document.getElementById('tarefasLista');
  lista.innerHTML = '';
  tarefas.forEach(tarefa => {
    const atrasada = tarefa.prazo && tarefa.status === 'pendente' && new Date(tarefa.prazo) < new Date();
    const card = document.createElement('div');
    card.className = `tarefa-card prioridade-${tarefa.prioridade} categoria-${tarefa.categoria.toLowerCase()} status-${tarefa.status}`;
    if (atrasada) card.classList.add('status-atrasada');
    card.innerHTML = `
      <div class="tarefa-topo">
        <span class="categoria">${tarefa.categoria}</span>
        <span class="prioridade">${tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}</span>
      </div>
      <h2>${tarefa.titulo}</h2>
      <p>${tarefa.descricao}</p>
      <div class="tarefa-info">
        <span>Data: ${new Date(tarefa.dataCriacao).toLocaleDateString()}</span>
        <span>Prazo: ${tarefa.prazo ? tarefa.prazo : '---'}</span>
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
}

// Inicialização
renderizarTarefas();
