// CONFIGURAÇÕES - Cyber Mobb System

// Carregar configurações salvas ao iniciar
document.addEventListener('DOMContentLoaded', function() {
  carregarConfigs();
  aplicarTema();
});

// ========== GERENCIAMENTO DE CORES ==========
function hexParaRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function escurecerCor(hex, fator = 0.3) {
  const rgb = hexParaRgb(hex);
  const r = Math.round(rgb.r * fator);
  const g = Math.round(rgb.g * fator);
  const b = Math.round(rgb.b * fator);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function aplicarVariacoesCor(cor) {
  const rgb = hexParaRgb(cor);
  const root = document.documentElement;
  
  // Define a cor principal
  root.style.setProperty('--cor-principal', cor);
  
  // Define cor escura para gradientes
  root.style.setProperty('--cor-fundo-escuro', escurecerCor(cor, 0.3));
  
  // Define variações com diferentes opacidades
  root.style.setProperty('--cor-principal-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  root.style.setProperty('--cor-005', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
  root.style.setProperty('--cor-01', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
  root.style.setProperty('--cor-02', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
  root.style.setProperty('--cor-03', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
  root.style.setProperty('--cor-04', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
  root.style.setProperty('--cor-05', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
  root.style.setProperty('--cor-06', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
  root.style.setProperty('--cor-07', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`);
  root.style.setProperty('--cor-08', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8)`);
}

function trocarCor(cor) {
  // Salva a cor escolhida
  localStorage.setItem('corTema', cor);
  
  // Aplica imediatamente com todas as variações
  aplicarVariacoesCor(cor);
  
  // Feedback visual
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-color="${cor}"]`).classList.add('active');
  
  // Atualiza a prévia
  atualizarPrevia();
  
  alert(`✅ Tema alterado para ${getNomeCor(cor)}! Recarregue outras páginas para aplicar.`);
}

function getNomeCor(hex) {
  const cores = {
    '#ff0000': 'Vermelho',
    '#00dfff': 'Azul',
    '#ff00ff': 'Magenta',
    '#00ff88': 'Verde',
    '#ffd166': 'Dourado',
    '#8a2be2': 'Roxo'
  };
  return cores[hex] || 'Personalizado';
}

// ========== FUNDO ==========
function trocarFundo(modo) {
  localStorage.setItem('modoFundo', modo);
  aplicarFundo(modo);
  alert('✅ Fundo alterado! Recarregue outras páginas para aplicar.');
}

function aplicarFundo(modo) {
  const body = document.body;
  body.classList.remove('bg-gradient', 'bg-solid', 'bg-animated');
  
  switch(modo) {
    case 'gradient':
      body.classList.add('bg-gradient');
      break;
    case 'solid':
      body.classList.add('bg-solid');
      break;
    case 'animated':
      body.classList.add('bg-animated');
      break;
  }
}

// ========== FONTE ==========
function trocarFonte(tamanho) {
  localStorage.setItem('tamanhoFonte', tamanho);
  document.documentElement.style.setProperty('--font-size-base', tamanho + 'px');
  document.getElementById('fonteValor').textContent = tamanho + 'px';
}

// ========== ASSISTENTE IA ==========
document.getElementById('modoIA')?.addEventListener('change', function() {
  const apiSection = document.getElementById('apiKeySection');
  if (this.value === 'api') {
    apiSection.style.display = 'block';
  } else {
    apiSection.style.display = 'none';
  }
});

function toggleApiKey() {
  const input = document.getElementById('apiKey');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ========== SALVAR/CARREGAR CONFIGURAÇÕES ==========
function salvarConfigs() {
  const configs = {
    modoIA: document.getElementById('modoIA')?.value,
    apiKey: document.getElementById('apiKey')?.value,
    historicoPersistente: document.getElementById('historicoPersistente')?.checked,
    autosave: document.getElementById('autosave')?.checked,
    notificacoes: document.getElementById('notificacoes')?.checked,
    sons: document.getElementById('sons')?.checked,
    enterEnvia: document.getElementById('enterEnvia')?.checked
  };
  
  localStorage.setItem('configsCyberMobb', JSON.stringify(configs));
}

function carregarConfigs() {
  const configs = JSON.parse(localStorage.getItem('configsCyberMobb')) || {};
  
  // Carregar valores
  if (document.getElementById('modoIA')) document.getElementById('modoIA').value = configs.modoIA || 'local';
  if (document.getElementById('apiKey')) document.getElementById('apiKey').value = configs.apiKey || '';
  if (document.getElementById('historicoPersistente')) document.getElementById('historicoPersistente').checked = configs.historicoPersistente || false;
  if (document.getElementById('autosave')) document.getElementById('autosave').checked = configs.autosave !== false;
  if (document.getElementById('notificacoes')) document.getElementById('notificacoes').checked = configs.notificacoes || false;
  if (document.getElementById('sons')) document.getElementById('sons').checked = configs.sons || false;
  if (document.getElementById('enterEnvia')) document.getElementById('enterEnvia').checked = configs.enterEnvia !== false;
  
  // Mostrar seção de API se necessário
  if (configs.modoIA === 'api') {
    const apiSection = document.getElementById('apiKeySection');
    if (apiSection) apiSection.style.display = 'block';
  }
  
  // Carregar fundo
  const modoFundo = localStorage.getItem('modoFundo') || 'gradient';
  if (document.getElementById('modoFundo')) document.getElementById('modoFundo').value = modoFundo;
  aplicarFundo(modoFundo);
  
  // Carregar tamanho de fonte
  const tamanhoFonte = localStorage.getItem('tamanhoFonte') || '14';
  if (document.getElementById('tamanhoFonte')) {
    document.getElementById('tamanhoFonte').value = tamanhoFonte;
    document.getElementById('fonteValor').textContent = tamanhoFonte + 'px';
  }
  trocarFonte(tamanhoFonte);
}

// ========== APLICAR TEMA ==========
function aplicarTema() {
  const corSalva = localStorage.getItem('corTema') || '#ff0000';
  aplicarVariacoesCor(corSalva);
  
  // Marcar cor ativa
  const btnAtivo = document.querySelector(`[data-color="${corSalva}"]`);
  if (btnAtivo) btnAtivo.classList.add('active');
  
  atualizarPrevia();
}

function atualizarPrevia() {
  const cor = localStorage.getItem('corTema') || '#ff0000';
  const preview = document.querySelector('.preview-card');
  if (preview) {
    preview.style.borderColor = cor;
    preview.style.boxShadow = `0 0 20px ${cor}`;
  }
}

// ========== EXPORTAR/IMPORTAR DADOS ==========
function exportarDados() {
  const todosOsDados = {
    configuracoes: JSON.parse(localStorage.getItem('configsCyberMobb') || '{}'),
    tarefas: JSON.parse(localStorage.getItem('tarefasCyberMobb') || '[]'),
    arquivos: JSON.parse(localStorage.getItem('arquivosMobb') || '[]'),
    senha: localStorage.getItem('senhaMobb'),
    tema: {
      cor: localStorage.getItem('corTema'),
      fundo: localStorage.getItem('modoFundo'),
      fonte: localStorage.getItem('tamanhoFonte')
    },
    dataExport: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(todosOsDados, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cyber_mobb_backup_' + new Date().getTime() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  alert('✅ Dados exportados com sucesso!');
}

function importarDados() {
  document.getElementById('importFile').click();
}

function processarImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const dados = JSON.parse(e.target.result);
      
      // Restaurar dados
      if (dados.configuracoes) localStorage.setItem('configsCyberMobb', JSON.stringify(dados.configuracoes));
      if (dados.tarefas) localStorage.setItem('tarefasCyberMobb', JSON.stringify(dados.tarefas));
      if (dados.arquivos) localStorage.setItem('arquivosMobb', JSON.stringify(dados.arquivos));
      if (dados.senha) localStorage.setItem('senhaMobb', dados.senha);
      if (dados.tema) {
        if (dados.tema.cor) localStorage.setItem('corTema', dados.tema.cor);
        if (dados.tema.fundo) localStorage.setItem('modoFundo', dados.tema.fundo);
        if (dados.tema.fonte) localStorage.setItem('tamanhoFonte', dados.tema.fonte);
      }
      
      alert('✅ Dados importados com sucesso! Recarregue a página.');
      location.reload();
    } catch (error) {
      alert('❌ Erro ao importar dados. Arquivo inválido.');
    }
  };
  reader.readAsText(file);
}

function limparTodosDados() {
  const confirmacao = confirm('⚠️ ATENÇÃO: Esta ação irá apagar TODOS os seus dados (tarefas, arquivos, configurações). Deseja continuar?');
  
  if (confirmacao) {
    const segundaConfirmacao = confirm('🚨 Tem certeza ABSOLUTA? Esta ação é IRREVERSÍVEL!');
    
    if (segundaConfirmacao) {
      localStorage.clear();
      alert('✅ Todos os dados foram removidos. Recarregando...');
      location.reload();
    }
  }
}

// ========== OBTER CONFIGURAÇÕES (para usar em outras páginas) ==========
function obterConfigs() {
  return JSON.parse(localStorage.getItem('configsCyberMobb')) || {};
}
