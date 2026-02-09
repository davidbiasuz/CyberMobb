// THEME LOADER - Carrega automaticamente o tema em todas as páginas
(function() {
  // Aplicar cor do tema
  const corSalva = localStorage.getItem('corTema') || '#ff0000';
  document.documentElement.style.setProperty('--cor-principal', corSalva);
  
  // Aplicar fundo
  const modoFundo = localStorage.getItem('modoFundo') || 'gradient';
  document.body.classList.add('bg-' + modoFundo);
  
  // Aplicar tamanho de fonte
  const tamanhoFonte = localStorage.getItem('tamanhoFonte') || '14';
  document.documentElement.style.setProperty('--font-size-base', tamanhoFonte + 'px');
})();
