async function updateParticipantsTable(data) {
    const participants = data.participants;
            
    tableHeader.innerHTML = '';
    tableBody.innerHTML = '';
    
    if (participants.length > 0) {
        const columns = ['№', 'subject', 'sex', 'foreign', 'birth_date', 'sessions'];
    
        columns.forEach((col, index) => {
            const th = document.createElement('th');
            const columnTitles = {
                '№': '№',
                'subject': 'ID участника',
                'sex': 'Пол',
                'foreign': 'Иностранец',
                'birth_date': 'Дата рождения',
                'sessions': 'Сессии'
            };
            th.textContent = columnTitles[col] || col;
            if (col !== '№') {
                th.dataset.column = col;
                th.style.cursor = 'pointer';
            }
            tableHeader.appendChild(th);
        });
        
        participants.forEach((participant, index) => {
            const row = document.createElement('tr');
            
            columns.forEach(col => {
                const td = document.createElement('td');
                
                if (col === '№') {
                    td.textContent = index + 1;
                    td.style.textAlign = 'center';
                }
                else if (col === 'foreign') {
                    td.textContent = participant[col] === null ? 'Нет данных' : 
                                    participant[col] ? 'Да' : 'Нет';
                }
                else if (col === 'sessions') {
                    td.textContent = participant[col].join(', ');
                }
                else if (col === 'birth_date') {
                    td.textContent = participant[col];
                }
                else {
                    td.textContent = participant[col] || '—';
                }
                
                row.appendChild(td);
            });
            
            tableBody.appendChild(row);
        });
        
        tableContainer.classList.remove('hidden');
    } else {
        errorMessage.textContent = 'Нет данных для отображения';
        errorMessage.classList.remove('hidden');
    }
}


async function addParticipantsButtonHandler() {
    const API_URL = `/api/subjects`;
    let tableContainer = document.getElementById('tableContainer');
    let loadingIndicator = document.getElementById('loadingIndicator');
    let errorMessage = document.getElementById('errorMessage');
    let extraButtonsContainer = document.getElementById('extraButtonsContainer');
    loadBtn.addEventListener('click', async function() {
        try {
            loadingIndicator.classList.remove('hidden');
            tableContainer.classList.add('hidden');
            errorMessage.classList.add('hidden');
            extraButtonsContainer.innerHTML = '';
            
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            updateParticipantsTable(data)
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            errorMessage.textContent = `Ошибка при загрузке данных: ${error.message}`;
            errorMessage.classList.remove('hidden');
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    });
}
