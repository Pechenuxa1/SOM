import { handleCheckboxChangeForFile } from "./fileButtonHandler.js";
import { handleCheckboxChange } from "./surveyButtonHandler.js";
import { handleCheckboxChangeForHunt } from "./huntButtonHandler.js";
import { addDownloadButtonHandler } from "./downloadButtonHandler.js"
import { addEditButtonHandler } from "./editButtonHandler.js"


async function updateQuestionsTable(data) {
    const questions = data.questions;
                
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    if (questions.length > 0) {
        const boolColumns = [
            'sp_before',
            'sp_after',
            'st',
            'scs',
            'sfa',
            'gld',
            'bdi'
        ];

        const columns = ['№', ...Object.keys(questions[0])];
        
        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col === '№' ? col : col.charAt(0).toUpperCase() + col.slice(1);
            tableHeader.appendChild(th);
        });
        
        questions.forEach((question, index) => {
            const row = document.createElement('tr');
            
            columns.forEach(col => {
                const td = document.createElement('td');
                
                if (col === '№') {
                    td.textContent = index + 1;
                    td.style.textAlign = 'center';
                }
                else if (boolColumns.includes(col)) {
                    const icon = document.createElement('span');

                    if (question[col] === null) {
                        icon.textContent = 'Нет данных';
                    } 
                    else if (question[col]) {
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
                    td.textContent = question[col] || '—';
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


export async function handleCheckboxChangeForQuestions(e, surveyId) {
    const isChecked = e.target.checked;

    try {
        loadingIndicator.classList.remove('hidden');
        
        const response = await fetch(`/api/questions/${surveyId}?sort=${isChecked}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        updateQuestionsTable(data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
        errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
        errorMessage.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}


export async function addSurveyButtonHandler(button, surveyId) {
    let tableContainer = document.getElementById('tableContainer');
    let tableButtons = document.getElementById('tableButtons');
    let loadingIndicator = document.getElementById('loadingIndicator');
    let errorMessage = document.getElementById('errorMessage');
    let extraButtonsContainer = document.getElementById('extraButtonsContainer');
    let checkbox = document.getElementById('filter-checkbox');

    button.addEventListener('click', async function() {
        checkbox.onchange = (e) => handleCheckboxChangeForQuestions(e, surveyId)
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
            
            let API_URL = `/api/questions/${surveyId}`;
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            updateQuestionsTable(data);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
            errorMessage.classList.remove('hidden');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    });
}
