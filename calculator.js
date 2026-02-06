let display = document.getElementById("calcDisplay");
let calculadora = document.getElementById("calculadora");

function adicionar(value) {
  display.value += value;
}

function isCalculadoraVisivel() {
  return window.getComputedStyle(calculadora).display !== "none";
}

function alterarVisibilidade() {
  if (isCalculadoraVisivel()) {
    calculadora.style.display = "none";
  } else {
    calculadora.style.display = "block";
  }
}

function limparDisplay() {
  display.value = "";
}

function calcular() {
  try {
    // Validação: apenas números e operadores permitidos
    if (/^[\d+\-*/().\s]+$/.test(display.value)) {
      display.value = Function('"use strict";return (' + display.value + ")")();
    } else {
      throw new Error("Expressão inválida");
    }
  } catch {
    display.value = "ERRO";
    setTimeout(() => {
      display.value = "";
    }, 1500);
  }
}
