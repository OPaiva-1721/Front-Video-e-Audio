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
    const savePath = `output.${format}`; // Nome fixo, como no backend
    
    // Validar URL
    if (!url || !/youtube\.com\/watch\?v=[\w-]+/.test(url)) {
        showError('Por favor, insira uma URL válida do YouTube (ex.: https://youtube.com/watch?v=abc123).');
        return;
    }
    
    // Mostrar mensagem de processamento
    showSuccess('Processando seu download...');
    
    try {
        const response = await fetch('https://video-e-audio.onrender.com/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: url,
                format: format,
                quality: quality,
                savePath: savePath
            })
        });
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }
        
        const data = await response.json();
        console.log(data.message, data.id);
        showSuccess('Download iniciado com sucesso! ID: ' + data.id);
        
        // Adicionar ao histórico
        addToDownloadHistory(url, format, quality, data.id);
        
        // Recarregar a lista de downloads
        if (window.location.pathname.includes('downloads.html')) {
            loadDownloads();
        }
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

// Adicionar à lista de downloads simulados (opcional, para fallback)
function addToDownloadHistory(url, format, quality, id) {
    let downloads = JSON.parse(localStorage.getItem('downloads') || '[]');
    
    downloads.push({
      id: id,
      url: url,
      format: format,
      quality: quality,
      status: 'Iniciado',
      date: new Date().toISOString()
    });
    
    localStorage.setItem('downloads', JSON.stringify(downloads));
}

// Carregar downloads do backend
async function loadDownloads() {
    const tableBody = document.getElementById('downloadsTable');
    if (!tableBody) return;
    
    try {
        const response = await fetch('https://video-e-audio.onrender.com/api/downloads', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao carregar downloads');
        }
        
        const downloads = await response.json();
        tableBody.innerHTML = '';
        
        if (downloads.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="5" class="p-2 text-center text-sm text-gray-600">Nenhum download encontrado.</td>`;
            tableBody.appendChild(row);
            return;
        }
        
        downloads.forEach(download => {
            const row = document.createElement('tr');
            row.className = 'border-t';
            row.innerHTML = `
                <td class="p-2 text-sm text-gray-600">${download.id || 'N/A'}</td>
                <td class="p-2 text-sm text-gray-600">${download.url || 'N/A'}</td>
                <td class="p-2 text-sm text-gray-600">${download.format || 'N/A'}</td>
                <td class="p-2 text-sm text-gray-600">${download.quality || 'N/A'}</td>
                <td class="p-2 text-sm text-gray-600">${download.status || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao carregar downloads:', error);
        tableBody.innerHTML = `<tr><td colspan="5" class="p-2 text-center text-sm text-red-600">Erro ao carregar downloads.</td></tr>`;
    }
}
