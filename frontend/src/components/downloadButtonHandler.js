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


export async function addDownloadButtonHandler(downloadButton) {
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
}