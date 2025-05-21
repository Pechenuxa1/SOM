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