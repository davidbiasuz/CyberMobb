const senhaPadrao = "mobb123";

if (!localStorage.getItem("senhaMobb")) {
  localStorage.setItem("senhaMobb", senhaPadrao);
}

let arquivos = JSON.parse(localStorage.getItem("arquivosMobb")) || [];
let arquivoAtualId = null;

function entrar() {
  const digitada = document.getElementById("senha").value;
  const correta = localStorage.getItem("senhaMobb");

  if (digitada === correta) {
    document.getElementById("login").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    renderizarLista();
  } else {
    alert("❌ ACESSO NEGADO: Senha incorreta");
    document.getElementById("senha").value = "";
  }
}

function salvar() {
  const titulo = document.getElementById("titulo").value;
  const texto = document.getElementById("texto").value;

  if (!titulo || !texto) {
    alert("⚠️ ERRO: Preencha todos os campos");
    return;
  }

  arquivos.push({
    id: Date.now(),
    titulo,
    texto,
    data: new Date().toLocaleString()
  });

  salvarLocal();
  limparCampos();
  renderizarLista();
  alert("✅ Arquivo salvo com sucesso!");
}

function abrirArquivo(id) {
  const arquivo = arquivos.find(a => a.id === id);
  if (!arquivo) return;

  arquivoAtualId = id;
  document.getElementById("titulo").value = arquivo.titulo;
  document.getElementById("texto").value = arquivo.texto;
}

function editar() {
  if (!arquivoAtualId) {
    alert("⚠️ ERRO: Nenhum arquivo selecionado");
    return;
  }

  const titulo = document.getElementById("titulo").value;
  const texto = document.getElementById("texto").value;

  if (!titulo || !texto) {
    alert("⚠️ ERRO: Preencha todos os campos");
    return;
  }

  const arquivo = arquivos.find(a => a.id === arquivoAtualId);
  arquivo.titulo = titulo;
  arquivo.texto = texto;
  arquivo.data = new Date().toLocaleString();

  salvarLocal();
  renderizarLista();
  alert("✅ Arquivo editado com sucesso!");
  limparCampos();
  arquivoAtualId = null;
}

function excluir() {
  if (!arquivoAtualId) {
    alert("⚠️ ERRO: Nenhum arquivo selecionado");
    return;
  }

  if (!confirm("🗑️ Tem certeza que deseja excluir este arquivo?")) {
    return;
  }

  arquivos = arquivos.filter(a => a.id !== arquivoAtualId);
  arquivoAtualId = null;

  salvarLocal();
  limparCampos();
  renderizarLista();
  alert("✅ Arquivo excluído com sucesso!");
}

function sair() {
  limparCampos();
  arquivoAtualId = null;
  document.getElementById("app").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

function renderizarLista() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  if (arquivos.length === 0) {
    lista.innerHTML = '<p style="text-align: center; opacity: 0.5; margin-top: 20px;">Nenhum arquivo salvo</p>';
    return;
  }

  arquivos.forEach(arquivo => {
    const item = document.createElement("div");
    item.className = "arquivo";
    item.innerHTML = `
      <span style="font-weight: bold;">📄 ${arquivo.titulo}</span>
      <span style="font-size: 11px; opacity: 0.6; margin-left: 10px;">${arquivo.data}</span>
    `;
    item.onclick = () => abrirArquivo(arquivo.id);
    lista.appendChild(item);
  });
}

function salvarLocal() {
  localStorage.setItem("arquivosMobb", JSON.stringify(arquivos));
}

function limparCampos() {
  document.getElementById("titulo").value = "";
  document.getElementById("texto").value = "";
}
