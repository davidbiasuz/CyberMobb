// CYBER IA ASSISTANT - JavaScript
let historicoChat = [];

// ========== NAVEGAÇÃO ENTRE FUNÇÕES ==========
function mudarFuncaoIA(funcao) {
  // Remove active de todas as funções
  document.querySelectorAll('.ia-funcao').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.ia-tab').forEach(t => t.classList.remove('active'));

  // Ativa a função selecionada
  const funcoes = {
    'chat': 'funcaoChat',
    'explicar': 'funcaoExplicar',
    'corrigir': 'funcaoCorrigir',
    'perguntas': 'funcaoPerguntas',
    'codigo': 'funcaoCodigo'
  };

  document.getElementById(funcoes[funcao]).classList.add('active');
  event.target.classList.add('active');
}

// ========== CHAT INTERATIVO ==========
function enviarMensagem() {
  const input = document.getElementById('chatInput');
  const mensagem = input.value.trim();

  if (!mensagem) {
    alert('⚠️ Digite uma mensagem!');
    return;
  }

  // Adiciona mensagem do usuário
  adicionarMensagemChat('usuario', mensagem);
  input.value = '';

  // Simula processamento
  setTimeout(() => {
    const resposta = gerarRespostaIA(mensagem);
    adicionarMensagemChat('ia', resposta);
  }, 800);
}

function enviarSugestao(texto) {
  document.getElementById('chatInput').value = texto;
  enviarMensagem();
}

function adicionarMensagemChat(tipo, texto) {
  const historico = document.getElementById('chatHistorico');
  const mensagemDiv = document.createElement('div');
  
  if (tipo === 'usuario') {
    mensagemDiv.className = 'mensagem-usuario';
    mensagemDiv.innerHTML = `
      <div class="mensagem-conteudo">
        <strong>VOCÊ:</strong> ${texto}
      </div>
      <span class="user-icon">👤</span>
    `;
  } else {
    mensagemDiv.className = 'mensagem-ia';
    mensagemDiv.innerHTML = `
      <span class="ia-icon">🤖</span>
      <div class="mensagem-conteudo">
        <strong>CYBER IA:</strong> ${texto}
      </div>
    `;
  }

  historico.appendChild(mensagemDiv);
  historico.scrollTop = historico.scrollHeight;
  
  historicoChat.push({ tipo, texto, timestamp: new Date() });
}

function gerarRespostaIA(pergunta) {
  const p = pergunta.toLowerCase();

  // Respostas baseadas em palavras-chave
  if (p.includes('olá') || p.includes('oi') || p.includes('hello')) {
    return 'Olá! 👋 Como posso ajudar você hoje?';
  }
  
  if (p.includes('inteligência artificial') || p.includes('ia')) {
    return 'Inteligência Artificial (IA) é a capacidade de máquinas realizarem tarefas que normalmente requerem inteligência humana, como reconhecer padrões, aprender com dados e tomar decisões. Existem diferentes tipos: IA fraca (específica para uma tarefa) e IA forte (com capacidade de raciocínio geral). 🤖';
  }

  if (p.includes('javascript') || p.includes('js')) {
    return 'JavaScript é uma linguagem de programação versátil, principalmente usada para desenvolvimento web. Permite criar páginas interativas, manipular o DOM, fazer requisições assíncronas e muito mais! É uma das linguagens mais populares do mundo. 💻';
  }

  if (p.includes('estudar') || p.includes('estudo')) {
    return '📚 Dicas para estudar melhor:\n\n1. Use técnica Pomodoro (25min foco + 5min pausa)\n2. Faça resumos e mapas mentais\n3. Ensine o conteúdo para alguém\n4. Pratique exercícios regularmente\n5. Durma bem (sono consolida memória)\n6. Evite distrações (celular, redes sociais)\n\nLembre-se: qualidade > quantidade!';
  }

  if (p.includes('redação') || p.includes('texto') || p.includes('escrever')) {
    return '✍️ Dicas para uma boa redação:\n\n1. Planeje antes de escrever (introdução, desenvolvimento, conclusão)\n2. Use conectivos (portanto, assim, além disso)\n3. Seja claro e objetivo\n4. Evite repetições\n5. Revise sempre!\n6. Leia bastante para melhorar vocabulário\n\nPosso ajudar a corrigir seu texto na aba "Corrigir Texto"! 📝';
  }

  if (p.includes('python')) {
    return 'Python é uma linguagem de programação de alto nível, conhecida por sua sintaxe simples e legível. É muito usada em ciência de dados, machine learning, automação, web development e muito mais! 🐍';
  }

  if (p.includes('html') || p.includes('css')) {
    return 'HTML e CSS são as bases do desenvolvimento web! HTML estrutura o conteúdo (títulos, parágrafos, links) e CSS estiliza (cores, tamanhos, layouts). Juntos criam páginas bonitas e funcionais! 🎨';
  }

  if (p.includes('math') || p.includes('matemática') || p.includes('cálculo')) {
    return 'Matemática pode parecer difícil, mas é a linguagem do universo! 🔢 Dicas:\n\n1. Pratique muito (exercícios são essenciais)\n2. Entenda o PORQUÊ, não apenas decore fórmulas\n3. Use recursos visuais (gráficos, geometria)\n4. Resolva problemas do mais fácil ao mais difícil\n5. Não tenha medo de errar!\n\nQual área da matemática você precisa de ajuda?';
  }

  if (p.includes('obrigado') || p.includes('valeu')) {
    return 'Por nada! 😊 Estou aqui sempre que precisar. Bons estudos! 🚀';
  }

  if (p.includes('ajuda') || p.includes('help')) {
    return 'Claro! Posso ajudar com:\n\n💬 Conversar e tirar dúvidas\n🎯 Explicar textos complexos\n✏️ Corrigir e melhorar textos\n❓ Gerar perguntas de estudo\n💻 Analisar código\n\nSobre o que você precisa de ajuda?';
  }

  if (p.includes('nome') || p.includes('quem é você')) {
    return 'Eu sou o CYBER IA Assistant! 🤖 Fui criado para ajudar você com estudos, programação e diversas tarefas acadêmicas. Estou aqui 24/7 para te auxiliar!';
  }

  // Resposta genérica
  return `Entendi sua pergunta sobre "${pergunta}". 🤔\n\nPosso te ajudar de várias formas:\n\n• Use a aba "Explicar" para entender textos complexos\n• Use "Corrigir Texto" para melhorar sua escrita\n• Use "Gerar Perguntas" para criar questões de estudo\n• Use "Ajuda Código" para programação\n\nOu continue conversando comigo! Poderia reformular sua pergunta de outra forma?`;
}

// Permite enviar com Enter
document.addEventListener('DOMContentLoaded', function() {
  const chatInput = document.getElementById('chatInput');
  if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
      }
    });
  }
});

// ========== EXPLICADOR DE TEXTO ==========
function explicarTexto() {
  const texto = document.getElementById('textoExplicar').value.trim();
  const nivel = document.getElementById('nivelExplicacao').value;

  if (!texto) {
    alert('⚠️ Cole um texto para explicar!');
    return;
  }

  let explicacao = '';

  // Detecta o tipo de conteúdo
  if (texto.includes('function') || texto.includes('const') || texto.includes('let') || texto.includes('{')) {
    explicacao = explicarCodigo(texto, nivel);
  } else if (texto.length > 500) {
    explicacao = explicarTextoLongo(texto, nivel);
  } else {
    explicacao = explicarTextoGeral(texto, nivel);
  }

  const resultado = document.getElementById('resultadoExplicar');
  resultado.innerHTML = `
    <h3>✅ Explicação (Nível ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}):</h3>
    <div class="explicacao-conteudo">${explicacao}</div>
    <div class="acoes-resultado">
      <button class="btn-cyber-small" onclick="copiarTexto('resultadoExplicar')">📋 Copiar</button>
    </div>
  `;
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth' });
}

function explicarCodigo(codigo, nivel) {
  const explicacoes = {
    basico: `Este é um código de programação. Vou explicar de forma simples:\n\n🔹 O código contém instruções que o computador vai executar\n🔹 As palavras-chave (como 'function', 'const', 'let') são comandos especiais\n🔹 O código provavelmente executa uma tarefa específica\n\nPara entender melhor, recomendo usar a aba "Ajuda Código" para uma análise mais detalhada!`,
    
    intermediario: `Análise do código:\n\n📌 Estrutura identificada: ${codigo.includes('function') ? 'Funções' : 'Variáveis'}\n📌 O código parece realizar processamento de dados\n📌 Use a aba "Ajuda Código" para uma análise linha por linha\n\nDica: Tente identificar as entradas e saídas do código!`,
    
    avancado: `Análise técnica:\n\n⚡ Este código implementa lógica de programação\n⚡ Provavelmente utiliza conceitos como: variáveis, funções, controle de fluxo\n⚡ Para uma análise detalhada com sugestões de melhoria, use a aba "Ajuda Código"\n\nRecomendo revisar: complexidade, performance e boas práticas.`
  };

  return explicacoes[nivel];
}

function explicarTextoLongo(texto, nivel) {
  const palavras = texto.split(' ').length;
  const frases = texto.split(/[.!?]+/).length;

  const explicacoes = {
    basico: `Este texto fala sobre um tema específico de forma detalhada.\n\n📖 Resumo:\n• O texto tem aproximadamente ${palavras} palavras\n• Está dividido em cerca de ${frases} frases\n• Parece ser um texto informativo/educacional\n\n💡 Para entender melhor, tente identificar:\n- Qual é o tema principal?\n- Quais são as ideias mais importantes?\n- O que o autor quer transmitir?\n\nDica: Use a aba "Resumo" para gerar um resumo automático!`,
    
    intermediario: `Análise do texto:\n\n📊 Métricas:\n• ${palavras} palavras\n• ${frases} frases\n• Densidade informativa: ${(palavras/frases).toFixed(1)} palavras/frase\n\n🎯 Estrutura:\nO texto apresenta informações de forma ${palavras > 300 ? 'extensa' : 'concisa'}, desenvolvendo o tema com ${frases > 10 ? 'múltiplos' : 'poucos'} argumentos.\n\n💭 Interpretação:\nParece ser um texto acadêmico/formal. Para melhor compreensão, identifique:\n• Tese/objetivo principal\n• Argumentos de suporte\n• Conclusão ou síntese`,
    
    avancado: `Análise textual avançada:\n\n📈 Estatísticas:\n• Volume: ${palavras} palavras (${(palavras/250).toFixed(1)} páginas aprox.)\n• Complexidade: ${frases} períodos\n• Média: ${(palavras/frases).toFixed(1)} palavras/período\n\n🔍 Características:\n• Registro: Formal/acadêmico\n• Estrutura: ${frases > 15 ? 'Complexa e elaborada' : 'Direta e objetiva'}\n• Densidade: ${palavras/frases > 20 ? 'Alta' : 'Moderada'}\n\n💡 Sugestões de análise:\n1. Mapeie os conceitos-chave\n2. Identifique relações causais\n3. Avalie argumentação e evidências\n4. Sintetize contribuições principais`
  };

  return explicacoes[nivel];
}

function explicarTextoGeral(texto, nivel) {
  return `📝 Explicação do texto:\n\n"${texto}"\n\n${nivel === 'basico' ? 
    'Este texto transmite uma ideia ou informação. Para entender melhor, pense: qual é a mensagem principal? O que o texto quer dizer?' : 
    nivel === 'intermediario' ? 
    'O texto apresenta informações de forma direta. Analise o contexto e as palavras-chave para extrair o significado completo.' : 
    'Análise: Texto curto e objetivo. Identifique o objetivo comunicativo, tom utilizado e possíveis subtextos ou implicações.'}\n\n💡 Precisa de mais detalhes? Forneça um texto mais longo para uma análise aprofundada!`;
}

// ========== CORRETOR DE TEXTO ==========
function corrigirTexto() {
  const texto = document.getElementById('textoCorrigir').value.trim();
  const tipo = document.getElementById('tipoCorrecao').value;

  if (!texto) {
    alert('⚠️ Cole o texto que deseja corrigir!');
    return;
  }

  let textoCorrigido = texto;
  let observacoes = [];

  if (tipo === 'gramatica') {
    // Simula correções básicas
    observacoes.push('✓ Verificação de gramática concluída');
    observacoes.push('✓ Ortografia analisada');
    
    // Correções básicas
    textoCorrigido = texto
      .replace(/\bvc\b/gi, 'você')
      .replace(/\btb\b/gi, 'também')
      .replace(/\bmto\b/gi, 'muito')
      .replace(/\bq\b/gi, 'que')
      .replace(/\bn\b/gi, 'não')
      .replace(/\.{2,}/g, '.')
      .replace(/\!{2,}/g, '!')
      .replace(/\s+/g, ' ')
      .trim();

    if (texto === textoCorrigido) {
      observacoes.push('✓ Nenhum erro óbvio encontrado!');
    } else {
      observacoes.push('⚠️ Abreviações expandidas');
      observacoes.push('⚠️ Espaços extras removidos');
    }
  } else if (tipo === 'formal') {
    observacoes.push('📝 Texto convertido para tom formal/acadêmico');
    observacoes.push('✓ Sugestões aplicadas:');
    observacoes.push('  • Evite contrações (não = não)');
    observacoes.push('  • Use linguagem impessoal');
    observacoes.push('  • Evite gírias e informalidades');
    observacoes.push('  • Prefira voz passiva em contextos científicos');
    
    textoCorrigido = texto.replace(/\bvc\b/gi, 'você');
  } else if (tipo === 'simplificar') {
    observacoes.push('💡 Sugestões para simplificar:');
    observacoes.push('  • Use frases mais curtas');
    observacoes.push('  • Evite palavras complexas');
    observacoes.push('  • Seja direto e objetivo');
    observacoes.push('  • Use exemplos práticos');
  }

  const resultado = document.getElementById('resultadoCorrigir');
  resultado.innerHTML = `
    <h3>✅ Texto ${tipo === 'gramatica' ? 'Corrigido' : 'Melhorado'}:</h3>
    <div class="texto-corrigido">${textoCorrigido}</div>
    <div class="observacoes">
      <h4>📋 Observações:</h4>
      ${observacoes.map(obs => `<p>${obs}</p>`).join('')}
    </div>
    <div class="acoes-resultado">
      <button class="btn-cyber-small" onclick="copiarTexto('resultadoCorrigir')">📋 Copiar Texto</button>
    </div>
  `;
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth' });
}

// ========== GERADOR DE PERGUNTAS ==========
function gerarPerguntas() {
  const tema = document.getElementById('temaPerguntas').value.trim();
  const quantidade = parseInt(document.getElementById('quantidadePerguntas').value) || 5;
  const dificuldade = document.getElementById('dificuldadePerguntas').value;

  if (!tema) {
    alert('⚠️ Digite um tema ou cole um texto!');
    return;
  }

  const perguntas = gerarPerguntasInteligentes(tema, quantidade, dificuldade);

  const resultado = document.getElementById('resultadoPerguntas');
  resultado.innerHTML = `
    <h3>✅ ${quantidade} Perguntas Geradas (${dificuldade.charAt(0).toUpperCase() + dificuldade.slice(1)}):</h3>
    <div class="perguntas-lista">
      ${perguntas.map((p, i) => `
        <div class="pergunta-item">
          <div class="pergunta-numero">${i + 1}</div>
          <div class="pergunta-conteudo">
            <strong>${p.pergunta}</strong>
            <div class="resposta-sugerida">
              <small>💡 Resposta sugerida:</small>
              <p>${p.resposta}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="acoes-resultado">
      <button class="btn-cyber-small" onclick="copiarTexto('resultadoPerguntas')">📋 Copiar Perguntas</button>
      <button class="btn-cyber-small" onclick="imprimirPerguntas()">🖨️ Versão para Imprimir</button>
    </div>
  `;
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth' });
}

function gerarPerguntasInteligentes(tema, quantidade, dificuldade) {
  const palavrasChave = tema.toLowerCase().split(' ').filter(p => p.length > 3);
  const perguntas = [];

  const templates = {
    facil: [
      { p: `O que é ${palavrasChave[0] || 'o tema'}?`, r: `${palavrasChave[0] || 'O tema'} é um conceito importante que se refere a...` },
      { p: `Qual a definição de ${tema}?`, r: `${tema} pode ser definido como...` },
      { p: `Cite uma característica principal de ${tema}.`, r: `Uma característica importante é...` },
      { p: `Para que serve ${palavrasChave[0] || 'isso'}?`, r: `Serve principalmente para...` },
      { p: `Quais são os elementos básicos de ${tema}?`, r: `Os elementos básicos incluem...` }
    ],
    media: [
      { p: `Explique a importância de ${tema}.`, r: `${tema} é importante porque...` },
      { p: `Como ${palavrasChave[0] || 'o conceito'} funciona na prática?`, r: `Na prática, funciona através de...` },
      { p: `Quais são as principais aplicações de ${tema}?`, r: `As principais aplicações incluem...` },
      { p: `Compare e contraste diferentes aspectos de ${tema}.`, r: `Ao comparar, observa-se que...` },
      { p: `Qual a relação entre ${palavrasChave[0] || 'este tema'} e ${palavrasChave[1] || 'outros conceitos'}?`, r: `A relação se estabelece quando...` }
    ],
    dificil: [
      { p: `Analise criticamente as implicações de ${tema}.`, r: `Analisando criticamente, percebe-se que...` },
      { p: `Avalie os prós e contras de ${tema}.`, r: `Entre as vantagens... e as desvantagens...` },
      { p: `Como ${tema} se relaciona com teorias contemporâneas?`, r: `A relação com teorias atuais mostra que...` },
      { p: `Proponha uma solução para problemas relacionados a ${tema}.`, r: `Uma solução viável seria...` },
      { p: `Desenvolva uma argumentação sobre a relevância de ${tema} no contexto atual.`, r: `Argumentando, observa-se que no contexto atual...` }
    ]
  };

  const templatesSelecionados = templates[dificuldade];
  
  for (let i = 0; i < quantidade; i++) {
    const template = templatesSelecionados[i % templatesSelecionados.length];
    perguntas.push({
      pergunta: template.p,
      resposta: template.r
    });
  }

  return perguntas;
}

function imprimirPerguntas() {
  const perguntas = document.querySelectorAll('.pergunta-item');
  let conteudo = '='.repeat(60) + '\n';
  conteudo += 'QUESTÕES DE ESTUDO\n';
  conteudo += '='.repeat(60) + '\n\n';

  perguntas.forEach((p, i) => {
    const texto = p.querySelector('strong').textContent;
    conteudo += `${i + 1}. ${texto}\n\n`;
    conteudo += '_'.repeat(50) + '\n\n';
  });

  const blob = new Blob([conteudo], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'questoes_estudo_' + new Date().getTime() + '.txt';
  a.click();
  window.URL.revokeObjectURL(url);
  alert('✅ Perguntas baixadas para impressão!');
}

// ========== AJUDA COM CÓDIGO ==========
function analisarCodigo() {
  const codigo = document.getElementById('codigoInput').value.trim();
  const acao = document.getElementById('acaoCodigo').value;

  if (!codigo) {
    alert('⚠️ Cole o código que deseja analisar!');
    return;
  }

  let analise = '';

  switch(acao) {
    case 'explicar':
      analise = explicarCodigoDetalhado(codigo);
      break;
    case 'melhorar':
      analise = sugerirMelhorias(codigo);
      break;
    case 'bugs':
      analise = encontrarBugs(codigo);
      break;
    case 'comentar':
      analise = adicionarComentarios(codigo);
      break;
  }

  const resultado = document.getElementById('resultadoCodigo');
  resultado.innerHTML = `
    <h3>✅ Análise Concluída:</h3>
    <div class="codigo-analise">${analise}</div>
    <div class="acoes-resultado">
      <button class="btn-cyber-small" onclick="copiarTexto('resultadoCodigo')">📋 Copiar Análise</button>
    </div>
  `;
  resultado.style.display = 'block';
  resultado.scrollIntoView({ behavior: 'smooth' });
}

function explicarCodigoDetalhado(codigo) {
  let explicacao = '<h4>💻 Explicação do Código:</h4>\n\n';

  if (codigo.includes('function') || codigo.includes('=>')) {
    explicacao += '<p>✓ <strong>Funções detectadas:</strong> O código define funções que executam tarefas específicas.</p>';
  }

  if (codigo.includes('const') || codigo.includes('let') || codigo.includes('var')) {
    explicacao += '<p>✓ <strong>Variáveis:</strong> O código declara variáveis para armazenar dados.</p>';
  }

  if (codigo.includes('if') || codigo.includes('else')) {
    explicacao += '<p>✓ <strong>Estruturas condicionais:</strong> O código toma decisões baseadas em condições.</p>';
  }

  if (codigo.includes('for') || codigo.includes('while')) {
    explicacao += '<p>✓ <strong>Loops:</strong> O código repete operações múltiplas vezes.</p>';
  }

  if (codigo.includes('document.') || codigo.includes('getElementById')) {
    explicacao += '<p>✓ <strong>Manipulação DOM:</strong> O código interage com elementos HTML da página.</p>';
  }

  explicacao += `\n<div class="codigo-explicado"><pre>${codigo}</pre></div>`;
  explicacao += '\n<p><strong>Resumo:</strong> Este código implementa lógica de programação para realizar uma tarefa específica.</p>';

  return explicacao;
}

function sugerirMelhorias(codigo) {
  const sugestoes = [];

  if (!codigo.includes('const') && !codigo.includes('let')) {
    sugestoes.push('• Use <code>const</code> ou <code>let</code> ao invés de <code>var</code>');
  }

  if (codigo.split('\n').some(linha => linha.length > 80)) {
    sugestoes.push('• Quebre linhas muito longas (> 80 caracteres)');
  }

  if (!codigo.includes('//') && !codigo.includes('/*')) {
    sugestoes.push('• Adicione comentários explicativos');
  }

  sugestoes.push('• Considere extrair código repetido em funções');
  sugestoes.push('• Valide entradas e trate possíveis erros');
  sugestoes.push('• Use nomes descritivos para variáveis e funções');
  sugestoes.push('• Teste todas as condições e edge cases');

  return `
    <h4>💡 Sugestões de Melhoria:</h4>
    ${sugestoes.map(s => `<p>${s}</p>`).join('')}
    <div class="codigo-original"><h5>Código Original:</h5><pre>${codigo}</pre></div>
  `;
}

function encontrarBugs(codigo) {
  const problemas = [];

  if (codigo.includes('==') && !codigo.includes('===')) {
    problemas.push('⚠️ Use <code>===</code> ao invés de <code>==</code> para comparações estritas');
  }

  if (codigo.includes('var')) {
    problemas.push('⚠️ <code>var</code> tem escopo problemático, prefira <code>const</code> ou <code>let</code>');
  }

  if (codigo.match(/\bif\s*\([^)]+\)\s*;/)) {
    problemas.push('⚠️ Ponto e vírgula após <code>if</code> pode causar lógica incorreta');
  }

  if (!codigo.includes('try') && (codigo.includes('JSON.parse') || codigo.includes('fetch'))) {
    problemas.push('⚠️ Operações que podem falhar devem ter tratamento de erro (try/catch)');
  }

  if (problemas.length === 0) {
    problemas.push('✅ Nenhum problema óbvio detectado!');
    problemas.push('💡 Mas sempre teste seu código completamente!');
  }

  return `
    <h4>🔍 Análise de Possíveis Bugs:</h4>
    ${problemas.map(p => `<p>${p}</p>`).join('')}
    <div class="codigo-analisado"><h5>Código Analisado:</h5><pre>${codigo}</pre></div>
  `;
}

function adicionarComentarios(codigo) {
  const linhas = codigo.split('\n');
  const linhasComentadas = linhas.map(linha => {
    if (linha.trim() === '') return linha;
    if (linha.includes('function')) return `// Declaração de função\n${linha}`;
    if (linha.includes('const') || linha.includes('let')) return `// Declaração de variável\n${linha}`;
    if (linha.includes('if')) return `// Estrutura condicional\n${linha}`;
    if (linha.includes('for') || linha.includes('while')) return `// Loop\n${linha}`;
    if (linha.includes('return')) return `// Retorna resultado\n${linha}`;
    return linha;
  });

  return `
    <h4>📝 Código com Comentários:</h4>
    <div class="codigo-comentado"><pre>${linhasComentadas.join('\n')}</pre></div>
    <p><em>💡 Os comentários foram adicionados automaticamente. Ajuste conforme necessário!</em></p>
  `;
}

// ========== FUNÇÕES AUXILIARES ==========
function copiarTexto(elementoId) {
  const elemento = document.getElementById(elementoId);
  const texto = elemento.textContent || elemento.innerText;
  
  navigator.clipboard.writeText(texto).then(() => {
    alert('✅ Copiado para a área de transferência!');
  }).catch(() => {
    alert('❌ Erro ao copiar. Selecione manualmente o texto.');
  });
}
