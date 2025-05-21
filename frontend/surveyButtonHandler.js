function createFileForm(name, label, multiple = false) {
    const fileFormGroup = document.createElement('div');
    fileFormGroup.className = 'form-group';

    const fileLabel = document.createElement('label');
    fileLabel.setAttribute('for', 'file');
    fileLabel.textContent = label;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = name;
    fileInput.name = name;
    fileInput.multiple = multiple

    fileFormGroup.appendChild(fileLabel);
    fileFormGroup.appendChild(fileInput);
    return fileFormGroup;
}


function createFormContent(modal, modalContent, surveyId) {
    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Редактировать обследование';
    modalContent.appendChild(formTitle);

    const form = document.createElement('form');
    form.id = 'dataForm';
    modalContent.appendChild(form);

    form.appendChild(createFileForm('file-question', 'Прикрепить файл опросников'));
    form.appendChild(createFileForm('file-hunt', 'Прикрепить файл HUNT'));
    form.appendChild(createFileForm('file-csv', 'Прикрепить файлы csv', multiple=true));
    form.appendChild(createFileForm('file-ecg', 'Прикрепить файлы ecg', multiple=true));
    form.appendChild(createFileForm('file-hr', 'Прикрепить файлы hr', multiple=true));
    form.appendChild(createFileForm('file-iqdat', 'Прикрепить файлы iqdat', multiple=true));
    form.appendChild(createFileForm('file-mp4', 'Прикрепить файлы mp4', multiple=true));
    form.appendChild(createFileForm('file-rr', 'Прикрепить файлы rr', multiple=true));
    form.appendChild(createFileForm('file-sm', 'Прикрепить файлы sm', multiple=true));
    form.appendChild(createFileForm('file-tmk', 'Прикрепить файлы tmk', multiple=true));
    form.appendChild(createFileForm('file-txt', 'Прикрепить файлы txt', multiple=true));
    form.appendChild(createFileForm('file-other', 'Прикрепить другие файлы', multiple=true));


    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Отправить';
    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        try {
            let API_URL = `${window.APP_CONFIG.API_URL}`

            const formData = new FormData();

            Array.from(getFilesFromFormData(form, "file-question")).forEach(file => {
                formData.append('questions_file', file);
            });
            Array.from(getFilesFromFormData(form, "file-hunt")).forEach(file => {
                formData.append('hunt_file', file);
            });
            Array.from(getFilesFromFormData(form, "file-csv")).forEach(file => {
                formData.append('csv_files', file);
            });
            Array.from(getFilesFromFormData(form, "file-ecg")).forEach(file => {
                formData.append('ecg_files', file);
            });
            Array.from(getFilesFromFormData(form, "file-hr")).forEach(file => {
                formData.append('hr_files', file);
            });
            Array.from(getFilesFromFormData(form, "file-iqdat")).forEach(file => {
                formData.append('iqdat_files', file);
            });
            Array.from(getFilesFromFormData(form, "file-mp4")).forEach(file => {
                formData.append('mp4_files', file);
            });
            Array.from(getFilesFromFormData(form, "file-rr")).forEach(file => {
                formData.append('rr_files', file);
            });
            Array.from(getFilesFromFormData(form, "file-tmk")).forEach(file => {
                formData.append('tmk_files', file);
            });
            Array.from(getFilesFromFormData(form, "file-txt")).forEach(file => {
                formData.append('txt_files', file);
            });
            Array.from(getFilesFromFormData(form, "file-other")).forEach(file => {
                formData.append('other_files', file);
            });

            let response = await fetch(`/api/surveys/${surveyId}`, {
                method: 'PATCH',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`);
            }

            let result = await response.json();

            modal.classList.add('hidden');
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            alert(`Ошибка: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        }
    })
    form.appendChild(submitBtn);
    form.style.maxHeight = '500px';
    form.style.overflowY = 'auto';
}

function createCheckboxForm(name, labelText, checked = false) {
    const formGroup = document.createElement('div');
    formGroup.className = 'form-group';

    const label = document.createElement('label');
    label.setAttribute('for', name);
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '10px';
    label.style.fontSize = '16px';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = name;
    input.name = name;
    input.checked = checked;
    input.classList.add('file-checkbox');

    input.style.width = '30px';
    input.style.height = '30px';

    const textSpan = document.createElement('span');
    textSpan.textContent = labelText;

    label.appendChild(input);
    label.appendChild(textSpan);

    formGroup.appendChild(label);

    return formGroup;
}


function createFormDownloadContent(modal, modalContent, i) {
    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Выберите файлы для скачивания';
    modalContent.appendChild(formTitle);

    const form = document.createElement('form');
    form.id = 'dataForm';
    modalContent.appendChild(form);

    form.appendChild(createCheckboxForm('questions-checkbox', 'Файл опросников'));
    form.appendChild(createCheckboxForm('hunt-checkbox', 'Файл HUNT'));
    form.appendChild(createCheckboxForm('csv-checkbox', 'Файлы csv'));
    form.appendChild(createCheckboxForm('ecg-checkbox', 'Файлы ecg'));
    form.appendChild(createCheckboxForm('hr-checkbox', 'Файлы hr'));
    form.appendChild(createCheckboxForm('iqdat-checkbox', 'Файлы iqdat'));
    form.appendChild(createCheckboxForm('mp4-checkbox', 'Файлы mp4'));
    form.appendChild(createCheckboxForm('rr-checkbox', 'Файлы rr'));
    form.appendChild(createCheckboxForm('sm-checkbox', 'Файлы sm'));
    form.appendChild(createCheckboxForm('tmk-checkbox', 'Файлы tmk'));
    form.appendChild(createCheckboxForm('txt-checkbox', 'Файлы txt'));


    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Скачать';
    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        submitBtn.disabled = true;
        submitBtn.textContent = 'Скачивание...';

        try {
            const selectedFiles = Array.from(document.querySelectorAll('.file-checkbox'))
                .filter(cb => cb.checked)
                .map(cb => cb.id.replace('-checkbox', ''));

            const params = new URLSearchParams();
            selectedFiles.forEach(file => params.append('file_types', file));


            const response = await fetch(`/api/surveys/${i}/download?${params.toString()}`);

            if (!response.ok) {
                console.error('Ошибка при скачивании:', await response.text());
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `survey_${i}_files.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            modal.classList.add('hidden');
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            alert(`Ошибка: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Скачать';
        }
    })
    form.appendChild(submitBtn);
    form.style.maxHeight = '500px';
    form.style.overflowY = 'auto';

}

let currentSurveyId = null;
let tableHeader;
let tableBody;
let tableContainer;
let errorMessage;
let tableButtons;
let extraButtonsContainer;
let loadingIndicator;

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


async function handleCheckboxChange(e) {
    const isChecked = e.target.checked;

    if (!currentSurveyId) {
        console.warn('Обследование не выбрано');
        return;
    }

    try {
        loadingIndicator.classList.remove('hidden');
        
        const response = await fetch(`/api/sessions/${currentSurveyId}?sort=${isChecked}`, {
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

    downloadButton.addEventListener('click', async function() {
        if (!currentSurveyId) {
            alert('Сначала выберите обследование');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'modalForm';
        modal.className = 'modal hidden';
        document.body.appendChild(modal);

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modal.appendChild(modalContent);
        modalContent.innerHTML = '';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        modalContent.appendChild(closeBtn);
        
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
        
        createFormDownloadContent(modal, modalContent, currentSurveyId);
        modal.classList.remove('hidden');
    });

    editButton.addEventListener('click', function() {
        if (!currentSurveyId) {
            alert('Сначала выберите обследование');
            return;
        }

        const modal = document.createElement('div');
        modal.id = 'modalForm';
        modal.className = 'modal hidden';
        document.body.appendChild(modal);

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modal.appendChild(modalContent);
        modalContent.innerHTML = '';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        modalContent.appendChild(closeBtn);
        
        closeBtn.addEventListener('click', function() {
            modal.classList.add('hidden');
        });
        
        createFormContent(modal, modalContent, currentSurveyId);
        modal.classList.remove('hidden');
    });

    try {
        const API_URL = `/api/surveys/total-number`;
        const response = await fetch(API_URL);
                
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        const session_total_number = data.number; 

        const menu = document.querySelector(`#loadDataBtn2`).nextElementSibling;
        
        for (const survey of data.surveys) {
            const button = document.createElement('button');
            button.className = 'dropdown-button';
            button.textContent = `Обследование ${survey.number}`;

            button.addEventListener('click', async function() {
                checkbox.removeEventListener('change', handleCheckboxChangeForFile)
                checkbox.removeEventListener('change', handleCheckboxChangeForQuestions)
                checkbox.removeEventListener('change', handleCheckboxChangeForHunt)
                checkbox.addEventListener('change', handleCheckboxChange);
                try {
                    currentSurveyId = survey.id;
                    loadingIndicator.classList.remove('hidden');
                    tableContainer.classList.add('hidden');
                    errorMessage.classList.add('hidden');
                    extraButtonsContainer.innerHTML = '';
                    tableButtons.classList.add('hidden');
                    
                    const API_URL = `/api/sessions/${survey.id}`;
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
            menu.appendChild(button);
        }
    } catch (error) {
        console.error('Ошибка при загрузке количества обследований:', error);
        errorMessage.textContent = `Ошибка при загрузке списка обследований: ${error.message}`;
        errorMessage.classList.remove('hidden');
    }
});
