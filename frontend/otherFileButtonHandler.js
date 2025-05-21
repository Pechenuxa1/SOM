document.addEventListener('DOMContentLoaded', async function() {
    const loadBtn = document.getElementById('loadDataBtn4');
    const tableContainer = document.getElementById('tableContainer');
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const extraButtonsContainer = document.getElementById('extraButtonsContainer');
    const tableButtons = document.getElementById('tableButtons');

    const API_URL = `/api/surveys/total-number`;

    const response = await fetch(API_URL);
            
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    const session_total_number = data.number;

    const menu = document.querySelector(`#loadDataBtn4`).nextElementSibling;
    
    for (const survey of data.surveys) {
        const button = document.createElement('button');
        button.className = 'dropdown-button';
        button.textContent = `Обследование ${survey.number}`;

        button.addEventListener('click', async function () {
            extraButtonsContainer.innerHTML = '';
            tableButtons.classList.add('hidden');
            tableContainer.classList.add('hidden');
        
            try {
                const response = await fetch(`/api/files/other/${survey.id}/`);
                const data = await response.json();
        
                for (const file of data.files) {
                    try {
                        const response = await fetch(`/api/files/other/file/${file.id}/`);
                        const blob = await response.blob();
        
                        const downloadUrl = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = file.name;
                        link.textContent = file.name;
                        link.style.display = 'block'; 
        
                        link.addEventListener('click', (e) => {});
        
                        extraButtonsContainer.appendChild(link);
                    } catch (err) {
                        console.error('Ошибка скачивания файла:', err);
                    }
                }
        
                extraButtonsContainer.classList.remove('hidden');
            } catch (error) {
                console.error('Ошибка загрузки списка файлов:', error);
            }
        });
        
        menu.appendChild(button);
    }
});