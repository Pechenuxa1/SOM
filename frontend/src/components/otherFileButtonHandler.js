import { addDownloadButtonHandler } from "./downloadButtonHandler.js"
import { addEditButtonHandler } from "./editButtonHandler.js"


export async function addSurveyButtonHandler(button, surveyId) {
    let tableButtons = document.getElementById('tableButtons');
    let tableContainer = document.getElementById('tableContainer');
    let extraButtonsContainer = document.getElementById('extraButtonsContainer');

    button.addEventListener('click', async function () {
        extraButtonsContainer.innerHTML = '';
        tableButtons.classList.add('hidden');
        tableContainer.classList.add('hidden');
        const downloadButton = document.getElementById('downloadButton');
        const editButton = document.getElementById('editButton');

        addDownloadButtonHandler(downloadButton, surveyId)
        addEditButtonHandler(editButton, surveyId)
    
        try {
            const response = await fetch(`/api/files/other/${surveyId}/`);
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
}
