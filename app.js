/* Script principal para o YouTube Downloader */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initializeFormHandlers();
    
    // Verificar se estamos na página de downloads
    if (window.location.pathname.includes('downloads.html')) {
      loadDownloads();
    }
  });
  
  
  // Inicializar manipuladores de formulário
  function initializeFormHandlers() {
    const downloadForm = document.getElementById('downloadForm');
    if (downloadForm) {
      downloadForm.addEventListener('submit', handleDownloadSubmit);
      
      // Inicializar estado do formulário
      const formatSelect = document.getElementById('format');
      if (formatSelect) {
        formatSelect.addEventListener('change', toggleQualityField);
        toggleQualityField(); // Configuração inicial
      }
    }
  }
  
  // Alternar visibilidade do campo de qualidade
  function toggleQualityField() {
    const formatSelect = document.getElementById('format');
    const qualityContainer = document.getElementById('qualityContainer');
    const qualitySelect = document.getElementById('quality');
    
    if (!formatSelect || !qualityContainer || !qualitySelect) return;
    
    if (formatSelect.value === 'mp3') {
      qualityContainer.classList.add('hidden');
      qualitySelect.value = 'best';
    } else {
      qualityContainer.classList.remove('hidden');
    }
  }
  
  // Manipular envio do formulário de download
  async function handleDownloadSubmit(e) {
    e.preventDefault();
    
    const url = document.getElementById('url').value;
    const format = document.getElementById('format').value;
    const quality = document.getElementById('quality').value;
    const savePath = `output.${format}`; // Nome fixo, pois o backend gerencia o caminho
    
    // Validar URL
    if (!url || !url.includes('youtube.com/watch?v=')) {
      showError('Por favor, insira uma URL válida do YouTube.');
      return;
    }
    
    // Mostrar mensagem de processamento
    showSuccess('Processando seu download...');
    
    try {
      const response = await fetch('https://seu-backend.onrender.com/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format, quality, savePath })
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `output.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      showSuccess('Download iniciado com sucesso!');
      
      // Adicionar ao histórico
      addToDownloadHistory(url, format, quality);
    } catch (error) {
      showError('Erro ao processar o download: ' + error.message);
    }
    
    // Limpar formulário
    document.getElementById('downloadForm').reset();
    toggleQualityField();
  }
  
  // Mostrar mensagem de erro
  function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (errorDiv && errorText) {
      errorText.textContent = message;
      errorDiv.classList.remove('hidden');
      document.getElementById('successMessage')?.classList.add('hidden');
    }
  }
  
  // Mostrar mensagem de sucesso
  function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    
    if (successDiv && successText) {
      successText.textContent = message;
      successDiv.classList.remove('hidden');
      document.getElementById('errorMessage')?.classList.add('hidden');
    }
  }
  
  // Adicionar à lista de downloads simulados (armazenamento local)
  function addToDownloadHistory(url, format, quality) {
    let downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
    
    downloads.push({
      id: downloads.length + 1,
      url: url,
      format: format,
      quality: quality,
      status: 'Concluído',
      date: new Date().toISOString()
    });
    
    localStorage.setItem('downloads', JSON.stringify(downloads));
  }
  
  // Carregar downloads do armazenamento local
  function loadDownloads() {
    const tableBody = document.getElementById('downloadsTable');
    if (!tableBody) return;
    
    let downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
    
    // Se não houver downloads salvos, usar exemplos
    if (downloads.length === 0) {
      downloads = [
        { id: 1, url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', format: 'mp4', quality: '1080p', status: 'Concluído' },
        { id: 2, url: 'https://www.youtube.com/watch?v=9bZkp7q19f0', format: 'mp3', quality: 'best', status: 'Concluído' },
        { id: 3, url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', format: 'mp4', quality: '720p', status: 'Concluído' }
      ];
    }
    
    // Limpar tabela
    tableBody.innerHTML = '';
    
    if (downloads.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="5" class="p-2 text-center text-sm text-gray-600">Nenhum download encontrado.</td>`;
      tableBody.appendChild(row);
      return;
    }
    
    // Preencher tabela
    downloads.forEach(download => {
      const row = document.createElement('tr');
      row.className = 'border-t';
      row.innerHTML = `
        <td class="p-2 text-sm text-gray-600">${download.id}</td>
        <td class="p-2 text-sm text-gray-600">${download.url}</td>
        <td class="p-2 text-sm text-gray-600">${download.format}</td>
        <td class="p-2 text-sm text-gray-600">${download.quality}</td>
        <td class="p-2 text-sm text-gray-600">${download.status}</td>
      `;
      tableBody.appendChild(row);
    });
  }
