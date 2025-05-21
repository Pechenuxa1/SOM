async function updateFileTable(data) {
    const files = data.files;
    
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    if (files.length > 0) {
        const columns = [
            '№', 
            'subject', 
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
        
        files.forEach((session, index) => {
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


async function handleCheckboxChangeForFile(e) {
    const isChecked = e.target.checked;

    if (!currentSurveyId) {
        console.warn('Обследование не выбрано');
        return;
    }

    try {
        loadingIndicator.classList.remove('hidden');
        
        const response = await fetch(`/api/files/${currentSurveyId}?sort=${isChecked}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        updateFileTable(data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
        errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
        errorMessage.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}


document.addEventListener('DOMContentLoaded', async function() {
    const loadBtn = document.getElementById('loadDataBtn2');
    tableContainer = document.getElementById('tableContainer');
    tableHeader = document.getElementById('tableHeader');
    tableBody = document.getElementById('tableBody');
    loadingIndicator = document.getElementById('loadingIndicator');
    errorMessage = document.getElementById('errorMessage');
    extraButtonsContainer = document.getElementById('extraButtonsContainer');
    tableButtons = document.getElementById('tableButtons');
    const checkbox = document.getElementById('filter-checkbox');
    const downloadButton = document.getElementById('downloadButton');
    const editButton = document.getElementById('editButton');

    try {
        const API_URL = `/api/surveys/total-number`;
        const response = await fetch(API_URL);
                
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        const session_total_number = data.number; 

        const menu = document.querySelector(`#loadDataBtn7`).nextElementSibling;
        
        for (const survey of data.surveys) {
            const button = document.createElement('button');
            button.className = 'dropdown-button';
            button.textContent = `Обследование ${survey.number}`;

            button.addEventListener('click', async function() {
                checkbox.removeEventListener('change', handleCheckboxChangeForQuestions)
                checkbox.removeEventListener('change', handleCheckboxChangeForHunt)
                checkbox.removeEventListener('change', handleCheckboxChange);
                checkbox.addEventListener('change', handleCheckboxChangeForFile);
                try {
                    currentSurveyId = survey.id;
                    loadingIndicator.classList.remove('hidden');
                    tableContainer.classList.add('hidden');
                    errorMessage.classList.add('hidden');
                    extraButtonsContainer.innerHTML = '';
                    tableButtons.classList.add('hidden');
                    
                    const API_URL = `/api/files/${survey.id}`;
                    const response = await fetch(API_URL);
                    
                    if (!response.ok) {
                        throw new Error(`Ошибка HTTP: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    updateFileTable(data);
                } catch (error) {
                    console.error('Ошибка загрузки данных:', error);
                    errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
                    errorMessage.classList.remove('hidden');
                } finally {
                    loadingIndicator.classList.add('hidden');
                }
            });
            menu.appendChild(button);
        }
    } catch (error) {
        console.error('Ошибка при загрузке количества обследований:', error);
        errorMessage.textContent = `Ошибка при загрузке списка обследований: ${error.message}`;
        errorMessage.classList.remove('hidden');
    }
});
