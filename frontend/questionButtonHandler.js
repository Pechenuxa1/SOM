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


async function handleCheckboxChangeForQuestions(e) {
    const isChecked = e.target.checked;

    if (!currentSurveyId) {
        console.warn('Обследование не выбрано');
        return;
    }

    try {
        loadingIndicator.classList.remove('hidden');
        
        const response = await fetch(`/api/questions/${currentSurveyId}?sort=${isChecked}`, {
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


document.addEventListener('DOMContentLoaded', async function() {
    const loadBtn = document.getElementById('loadDataBtn3');
    tableContainer = document.getElementById('tableContainer');
    tableButtons = document.getElementById('tableButtons');
    tableHeader = document.getElementById('tableHeader');
    tableBody = document.getElementById('tableBody');
    loadingIndicator = document.getElementById('loadingIndicator');
    errorMessage = document.getElementById('errorMessage');
    extraButtonsContainer = document.getElementById('extraButtonsContainer');
    checkbox = document.getElementById('filter-checkbox');

    var API_URL = `/api/surveys/total-number`;

    const response = await fetch(API_URL);
            
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    const session_total_number = data.number;

    const menu = document.querySelector(`#loadDataBtn3`).nextElementSibling;
    for (const survey of data.surveys) {
        const button = document.createElement('button');
        button.className = 'dropdown-button';
        button.textContent = `Обследование ${survey.number}`;

        button.addEventListener('click', async function() {
            checkbox.removeEventListener('change', handleCheckboxChangeForFile)
            checkbox.removeEventListener('change', handleCheckboxChange)
            checkbox.removeEventListener('change', handleCheckboxChangeForHunt)
            checkbox.addEventListener('change', handleCheckboxChangeForQuestions)
            console.log(`Обследование ${survey.number}`);
            try {
                currentSurveyId = survey.id;
                loadingIndicator.classList.remove('hidden');
                tableContainer.classList.add('hidden');
                errorMessage.classList.add('hidden');
                extraButtonsContainer.innerHTML = '';
                tableButtons.classList.add('hidden');
                
                API_URL = `/api/questions/${survey.id}`;
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
        menu.appendChild(button);
    }
});