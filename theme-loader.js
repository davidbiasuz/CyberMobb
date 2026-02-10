// THEME LOADER - Carrega automaticamente o tema em todas as páginas
(function() {
  // Função para converter HEX para RGB
  function hexParaRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
  
  // Função para escurecer a cor (para o fundo do gradiente)
  function escurecerCor(hex, fator = 0.3) {
    const rgb = hexParaRgb(hex);
    const r = Math.round(rgb.r * fator);
    const g = Math.round(rgb.g * fator);
    const b = Math.round(rgb.b * fator);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  // Aplicar cor do tema com todas as variações
  const corSalva = localStorage.getItem('corTema') || '#ff0000';
  const rgb = hexParaRgb(corSalva);
  const root = document.documentElement;
  
  // Define a cor principal
  root.style.setProperty('--cor-principal', corSalva);
  
  // Define cor escura para gradientes
  root.style.setProperty('--cor-fundo-escuro', escurecerCor(corSalva, 0.3));
  
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
  
  // Aplicar fundo
  const modoFundo = localStorage.getItem('modoFundo') || 'gradient';
  document.body.classList.add('bg-' + modoFundo);
  
  // Aplicar tamanho de fonte
  const tamanhoFonte = localStorage.getItem('tamanhoFonte') || '14';
  root.style.setProperty('--font-size-base', tamanhoFonte + 'px');
})();
