import { createFileForm, getOrCreateModal } from "./utils.js";

function getFilesFromFormData(form, name) {
    const fileInput = form.querySelector(`#${name}`);
    return fileInput?.files || [];
}

async function createFormContent(modal, modalContent) {
    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Добавить обследование';
    modalContent.appendChild(formTitle);

    const form = document.createElement('form');
    form.id = 'dataForm';
    form.enctype = 'multipart/form-data';
    modalContent.appendChild(form);

    const formFields = [
        { id: 'file-questions', label: 'Прикрепить файл опросников', multiple: false },
        { id: 'file-hunt', label: 'Прикрепить файл HUNT', multiple: false },
        { id: 'file-csv', label: 'Прикрепить файлы csv', multiple: true },
        { id: 'file-ecg', label: 'Прикрепить файлы ecg', multiple: true },
        { id: 'file-hr', label: 'Прикрепить файлы hr', multiple: true },
        { id: 'file-iqdat', label: 'Прикрепить файлы iqdat', multiple: true },
        { id: 'file-mp4', label: 'Прикрепить файлы mp4', multiple: true },
        { id: 'file-rr', label: 'Прикрепить файлы rr', multiple: true },
        { id: 'file-sm', label: 'Прикрепить файлы sm', multiple: true },
        { id: 'file-tmk', label: 'Прикрепить файлы tmk', multiple: true },
        { id: 'file-txt', label: 'Прикрепить файлы txt', multiple: true },
        { id: 'file-other', label: 'Прикрепить общие файлы', multiple: true }
    ];

    formFields.forEach(field => {
        form.appendChild(createFileForm(field.id, field.label, field.multiple));
    });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Отправить';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        try {
            const formData = new FormData();

            formFields.forEach(field => {
                const files = Array.from(getFilesFromFormData(form, field.id));
                let fieldName;
                if (field.id === "file-questions" || field.id === "file-hunt") {
                    fieldName = field.id.replace('file-', '') + '_file';
                }
                else {
                    fieldName = field.id.replace('file-', '') + '_files';
                }
                
                if (files.length > 0) {
                    files.forEach(file => {
                        formData.append(fieldName, file);
                    });
                }
            });

            const response = await fetch('/api/surveys/', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.detail || `Ошибка сервера: ${response.status}`
                );
            }

            const result = await response.json();

            alert(`Обследование №${result.number} успешно создано`);
            
            modal.classList.add('hidden');
            form.reset();
            
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            alert(`Ошибка: ${error.message}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Отправить';
        }
    });

    form.appendChild(submitBtn);
    form.style.maxHeight = '500px';
    form.style.overflowY = 'auto';
}

export async function addModalWindow(menu) {
    const modal = document.createElement('div');
    modal.id = 'modalForm';
    modal.className = 'modal hidden';
    document.body.appendChild(modal);

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);

    menu.addEventListener('click', async () => {
        const { modal, modalContent } = getOrCreateModal();
        await createFormContent(modal, modalContent);
        modal.classList.remove('hidden');
    });
}