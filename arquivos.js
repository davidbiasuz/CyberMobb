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
    alert("Senha incorreta");
  }
}

function salvar() {
  const titulo = document.getElementById("titulo").value;
  const texto = document.getElementById("texto").value;

  if (!titulo || !texto) {
    alert("Preenche tudo");
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
    alert("Nenhum arquivo selecionado");
    return;
  }

  const arquivo = arquivos.find(a => a.id === arquivoAtualId);
  arquivo.titulo = document.getElementById("titulo").value;
  arquivo.texto = document.getElementById("texto").value;

  salvarLocal();
  renderizarLista();
  alert("Arquivo editado ✏️");
}

function excluir() {
  if (!arquivoAtualId) {
    alert("Nenhum arquivo selecionado");
    return;
  }

  arquivos = arquivos.filter(a => a.id !== arquivoAtualId);
  arquivoAtualId = null;

  salvarLocal();
  limparCampos();
  renderizarLista();
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

  arquivos.forEach(arquivo => {
    const item = document.createElement("div");
    item.className = "arquivo";
    item.innerText = `꛴ ${arquivo.titulo}`;
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
