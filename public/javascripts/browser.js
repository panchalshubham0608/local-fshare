
function uploadFiles(event) {
    // event.preventDefault();
    // event.stopPropagation();
    alert('uploading files');
}

// captures the event when the user browses for files
function onChange(event) {
    let files = event.target.files;
    let feedback = document.getElementById('js-file-name');
    if (files.length === 0) {
        feedback.innerText = `No file selected`;
    } else if (files.length === 1) {
        feedback.innerText = `1 file selected`;
    } else {
        feedback.innerText = `${files.length} files selected`;
    }
}

// captures the event when the user clicks the upload button
function browseFiles() {
    let fileInput = document.getElementById('js-file-input');
    fileInput.click();
}