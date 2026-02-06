let display = document.getElementById("calcDisplay");
let calculadora = document.getElementById("calculadora");

function adicionar(value) {
  display.value += value;
}

function alterarVisibilidade() {
  console.log("Mudando visualização")
  console.log('Display: ', calculadora.checkVisibility())
  if (calculadora.checkVisibility()) {
    // A calculadora estava exibindo, temos que esconde-la
    console.log("Ta mostrando")
    calculadora.style.display = "none"
  } else {
    calculadora.style.display = "block"
    // A calculadora estava escondida, temos que mostra-la
    console.log("Ta escondido")
  }
}

function limparDisplay() {
  display.value = "";
}

function calcular() {
  try {
    display.value = eval(display.value);
  } catch {
    display.value = "ERRO";
  }
}
