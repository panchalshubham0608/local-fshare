// imports
const fs = require('fs');
const os = require('os');
const path = require('path');

// root directory for uploads
const ROOT_DIR = path.join(os.homedir(), 'local-fshare');

// defines the upload directory for a given upload id
module.exports.uploadPath = (uploadId) => path.join(ROOT_DIR, 'temp', 'uploads', uploadId);

// initiate an upload
module.exports.initUpload = (uploadId) => {
    let uploadPath = this.uploadPath(uploadId);
    fs.mkdirSync(uploadPath, { recursive: true });
    let startedAt = Date.now();
    let startedAtPath = path.join(uploadPath, 'startedAt');
    fs.writeFileSync(startedAtPath, `${startedAt}`);
    let dataPath = path.join(uploadPath, 'data');
    fs.writeFileSync(dataPath, '');
    return uploadPath;
}

// retrieves the size of the content uploaded
module.exports.dataSize = (uploadId) => {
    let uploadPath = this.uploadPath(uploadId);
    let dataPath = path.join(uploadPath, 'data');
    let bytes = fs.statSync(dataPath);
    return bytes.size;
}

// appends content to the upload
module.exports.appendContent = (uploadId, content) => {
    let uploadPath = this.uploadPath(uploadId);
    let dataPath = path.join(uploadPath, 'data');
    fs.appendFileSync(dataPath, content);
}

// finishes the upload
module.exports.finishUpload = (uploadId, filename) => {
    let filesDir = path.join(ROOT_DIR, 'files');
    fs.mkdirSync(filesDir, { recursive: true });
    let uploadPath = this.uploadPath(uploadId);
    let dataPath = path.join(uploadPath, 'data');
    let startedAtPath = path.join(uploadPath, 'startedAt');
    if (!filename)  {
        filename = fs.readFileSync(startedAtPath).toString();
    }
    filename = filename.replace(/[^a-zA-Z0-9.]/g, '_');
    let targetPath = path.join(filesDir, filename);
    fs.renameSync(dataPath, targetPath);
    fs.rmdirSync(uploadPath);
}
