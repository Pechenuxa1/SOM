async function updateHuntTable(data) {
    const hunts = data.hunts;

    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';

    if (hunts.length > 0) {
        const boolColumns = [
            'hunt',
        ];

        const columns = ['№', ...Object.keys(hunts[0])];

        columns.forEach(col => {
            const th = document.createElement('th');
            th.textContent = col === '№' ? '№' : col.charAt(0).toUpperCase() + col.slice(1);
            th.style.textAlign = 'left';
            tableHeader.appendChild(th);
        });

        hunts.forEach((hunt, index) => {
            const row = document.createElement('tr');
            
            columns.forEach(col => {
                const td = document.createElement('td');
                
                if (col === '№') {
                    td.textContent = index + 1;
                    td.style.textAlign = 'left'; 
                    td.style.paddingLeft = '10px';
                }
                else if (boolColumns.includes(col)) {
                    const icon = document.createElement('span');

                    if (hunt[col] === null) {
                        icon.textContent = 'Нет данных';
                    } 
                    else if (hunt[col]) {
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
                    td.style.textAlign = 'left'; 
                    td.style.paddingLeft = '10px'; 
                }
                else {
                    td.textContent = hunt[col] || '—';
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


async function handleCheckboxChangeForHunt(e) {
    const isChecked = e.target.checked;

    if (!currentSurveyId) {
        console.warn('Обследование не выбрано');
        return;
    }

    try {
        loadingIndicator.classList.remove('hidden');
        
        const response = await fetch(`/api/hunt/${currentSurveyId}?sort=${isChecked}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
        }

        const data = await response.json();
        updateHuntTable(data);
    } catch (error) {
        console.error('Ошибка запроса:', error);
        errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
        errorMessage.classList.remove('hidden');
    } finally {
        loadingIndicator.classList.add('hidden');
    }
}


async function addSurveyButtonHandler(surveyId) {
    let loadingIndicator = document.getElementById('loadingIndicator');
    let tableContainer = document.getElementById('tableContainer');
    let errorMessage = document.getElementById('errorMessage');
    let extraButtonsContainer = document.getElementById('extraButtonsContainer');
    let tableButtons = document.getElementById('tableButtons');
    let checkbox = document.getElementById('filter-checkbox');

    button.addEventListener('click', async function() {
        checkbox.removeEventListener('change', handleCheckboxChangeForFile)
        checkbox.removeEventListener('change', handleCheckboxChange)
        checkbox.removeEventListener('change', handleCheckboxChangeForQuestions)
        checkbox.addEventListener('change', handleCheckboxChangeForHunt)
        try {
            currentSurveyId = surveyId;
            loadingIndicator.classList.remove('hidden');
            tableContainer.classList.add('hidden');
            errorMessage.classList.add('hidden');
            extraButtonsContainer.innerHTML = '';
            tableButtons.classList.add('hidden');
            
            API_URL = `/api/hunt/${survey.id}`;
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            updateHuntTable(data);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
            errorMessage.classList.remove('hidden');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    });
}
