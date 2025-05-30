export function createFileForm(name, label, multiple = false) {
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

export function getOrCreateModal() {
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
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modalContent.appendChild(closeBtn);
    } else {
        modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = '';
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        modalContent.appendChild(closeBtn);
    }

    return { modal, modalContent };
}