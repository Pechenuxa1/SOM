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

function createFormDownloadContent(modal, modalContent, surveyId) {
    modalContent.innerHTML = ''; // очищаем содержимое при каждом открытии

    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Выберите файлы для скачивания';
    modalContent.appendChild(formTitle);

    const form = document.createElement('form');
    form.id = 'dataForm';
    modalContent.appendChild(form);

    const fileOptions = [
        ['questions', 'Файл опросников'],
        ['hunt', 'Файл HUNT'],
        ['csv', 'Файлы csv'],
        ['ecg', 'Файлы ecg'],
        ['hr', 'Файлы hr'],
        ['iqdat', 'Файлы iqdat'],
        ['mp4', 'Файлы mp4'],
        ['rr', 'Файлы rr'],
        ['sm', 'Файлы sm'],
        ['tmk', 'Файлы tmk'],
        ['txt', 'Файлы txt']
    ];

    fileOptions.forEach(([name, label]) => {
        form.appendChild(createCheckboxForm(`${name}-checkbox`, label));
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Скачать';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Скачивание...';

        try {
            const selectedFiles = [...new Set(
                Array.from(form.querySelectorAll('.file-checkbox'))
                    .filter(cb => cb.checked)
                    .map(cb => cb.id.replace('-checkbox', ''))
            )];

            if (selectedFiles.length === 0) {
                alert('Пожалуйста, выберите хотя бы один тип файла для скачивания.');
                return;
            }

            const params = new URLSearchParams();
            selectedFiles.forEach(file => params.append('file_types', file));

            const response = await fetch(`/api/surveys/${surveyId}/download?${params.toString()}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Ошибка при скачивании:', errorText);
                alert('Ошибка при скачивании файлов:\n' + errorText);
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `survey_${surveyId}_files.zip`;
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
    });

    form.appendChild(submitBtn);
    form.style.maxHeight = '500px';
    form.style.overflowY = 'auto';
}

export async function addDownloadButtonHandler(downloadButton, surveyId) {
    downloadButton.addEventListener('click', function () {
        let modal = document.getElementById('modalForm');
        let modalContent;

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalForm';
            modal.className = 'modal hidden';
            document.body.appendChild(modal);

            modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modal.appendChild(modalContent);

            const closeBtn = document.createElement('span');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', function () {
                modal.classList.add('hidden');
            });
            modalContent.appendChild(closeBtn);
        } else {
            modalContent = modal.querySelector('.modal-content');
        }

        createFormDownloadContent(modal, modalContent, surveyId);
        modal.classList.remove('hidden');
    });
}
