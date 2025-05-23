import { createFileForm } from "./utils.js";

async function getFilesFromFormData(form, name) {
    const fileInput = form.querySelector(`#${name}`);
    return fileInput.files;
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
    form.appendChild(createFileForm('file-csv', 'Прикрепить файлы csv', true));
    form.appendChild(createFileForm('file-ecg', 'Прикрепить файлы ecg', true));
    form.appendChild(createFileForm('file-hr', 'Прикрепить файлы hr', true));
    form.appendChild(createFileForm('file-iqdat', 'Прикрепить файлы iqdat', true));
    form.appendChild(createFileForm('file-mp4', 'Прикрепить файлы mp4', true));
    form.appendChild(createFileForm('file-rr', 'Прикрепить файлы rr', true));
    form.appendChild(createFileForm('file-sm', 'Прикрепить файлы sm', true));
    form.appendChild(createFileForm('file-tmk', 'Прикрепить файлы tmk', true));
    form.appendChild(createFileForm('file-txt', 'Прикрепить файлы txt', true));
    form.appendChild(createFileForm('file-other', 'Прикрепить другие файлы', true));


    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Отправить';
    form.addEventListener('submit', async function (e) {
        e.preventDefault()

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        try {

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


export async function addEditButtonHandler(editButton, surveyId) {
    editButton.addEventListener('click', function() {

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
        
        createFormContent(modal, modalContent, surveyId);
        modal.classList.remove('hidden');
    });
}