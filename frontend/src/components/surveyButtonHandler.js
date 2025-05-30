import { handleCheckboxChangeForFile } from "./fileButtonHandler.js";
import { handleCheckboxChangeForHunt } from "./huntButtonHandler.js";
import { handleCheckboxChangeForQuestions } from "./questionButtonHandler.js";
import { addDownloadButtonHandler } from "./downloadButtonHandler.js"
import { addEditButtonHandler } from "./editButtonHandler.js"


async function updateTable(data) {
    const sessions = data.sessions;
                
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    if (sessions.length > 0) {
        const columns = [
            '№', 
            'subject', 
            'hunt', 
            'question',
            'csv_file', 
            'ecg_file', 
            'hr_file', 
            'iqdat_file', 
            'mp4_file', 
            'rr_file', 
            'sm_file', 
            'tmk_file', 
            'txt_file'
        ];

        const boolColumns = [
            'hunt',
            'question',
            'csv_file', 
            'ecg_file', 
            'hr_file', 
            'iqdat_file', 
            'mp4_file', 
            'rr_file', 
            'sm_file', 
            'tmk_file', 
            'txt_file'
        ];

        columns.forEach((col, index) => {
            const th = document.createElement('th');
            th.textContent = col;
            if (col !== '№') {
                th.dataset.column = col;
                th.style.cursor = 'pointer';
            }
            tableHeader.appendChild(th);
        });
        
        sessions.forEach((session, index) => {
            const row = document.createElement('tr');
            
            columns.forEach(col => {
                const td = document.createElement('td');
                
                if (col === '№') {
                    td.textContent = index + 1;
                    td.style.textAlign = 'center';
                }
                else if (boolColumns.includes(col)) {
                    const icon = document.createElement('span');

                    if (session[col] === null) {
                        icon.textContent = 'Нет данных';
                    } 
                    else if (session[col]) {
                        icon.innerHTML = '✓';
                        icon.style.color = 'green';
                        icon.style.fontWeight = 'bold';
                        icon.style.fontSize = '1.2em';
                    } 
                    else {
                        icon.innerHTML = '✗';
                        icon.style.color = 'red';
                        icon.style.fontWeight = 'bold';
                        icon.style.fontSize = '1.2em';
                    }
                    
                    td.appendChild(icon);
                    td.style.textAlign = 'center';
                }
                else {
                    td.textContent = session[col] || '—';
                }
                
                row.appendChild(td);
            });
            
            tableBody.appendChild(row);
        });
        
        tableContainer.classList.remove('hidden');
        tableButtons.classList.remove('hidden');
    } else {
        errorMessage.textContent = 'Нет данных для отображения';
        errorMessage.classList.remove('hidden');
    }
}


export async function handleCheckboxChange(e, surveyId) {
    const isChecked = e.target.checked;

    try {
        loadingIndicator.classList.remove('hidden');
        
        const response = await fetch(`/api/sessions/${surveyId}?sort=${isChecked}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        updateTable(data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
        errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
        errorMessage.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}


export async function addSurveyButtonHandler(button, surveyId) {
    let checkbox = document.getElementById('filter-checkbox');
    button.addEventListener('click', async function() {
        checkbox.onchange = (e) => handleCheckboxChange(e, surveyId)
        try {
            loadingIndicator.classList.remove('hidden');
            tableContainer.classList.add('hidden');
            errorMessage.classList.add('hidden');
            extraButtonsContainer.innerHTML = '';
            tableButtons.classList.add('hidden');
            const downloadButton = document.getElementById('downloadButton');
            const editButton = document.getElementById('editButton');

            addDownloadButtonHandler(downloadButton, surveyId)
            addEditButtonHandler(editButton, surveyId)
            
            const API_URL = `/api/sessions/${surveyId}`;
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            updateTable(data);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
            errorMessage.classList.remove('hidden');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    });
}


