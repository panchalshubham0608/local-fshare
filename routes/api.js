// imports
var express = require('express');
var router = express.Router();
const { uuid } = require('uuidv4');
const { initUpload, dataSize, appendContent, finishUpload } = require('../util/fshelper');

// initiates an upload
router.post('/uploads', (_, res) => {
    let uploadId = uuid();
    try {
        initUpload(uploadId);
    } catch (error) {        
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
    return res.status(200).json({ uploadId: uploadId });
});

// appends content to the upload
router.put('/uploads/:uploadId', (req, res) => {
    let size = 0;    
    try {
        size = dataSize(req.params.uploadId);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
    console.log(`Have ${size} bytes so far`);

    let content = req.body.content;
    if (!content) {
        res.status(400).send('Bad Request');
    }
    let contentSize = Buffer.byteLength(content, 'utf8');
    let contentRange = req.headers['content-range'];
    if (!contentRange) {
        return res.status(400).send('Bad Request');
    }
    let [startStr, endStr] = contentRange.split('-');
    if (!startStr || !endStr) {
        return res.status(400).send('Bad Request');
    }
    let [start, end] = [0, 0];
    try {
        start = parseInt(startStr);
        end = parseInt(endStr);
    } catch (error) {
        return res.status(400).send('Bad Request');
    }
    console.log(`Got ${contentSize} bytes from ${start} to ${end}`);

    if (start !== size) {        
        console.log(`Expected ${size} bytes, got ${start}`);
        return res.status(409).send('Conflict');
    } if (end - start + 1 !== contentSize) {
        console.log(`Expected ${end - start + 1} bytes, got ${contentSize}`);
        return res.status(400).send('Bad Request');
    }
        try {
        appendContent(req.params.uploadId, content);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
    req.headers['content-range'] = `${start + contentSize}-${end + contentSize}`;
    return res.status(201).send('Created');
});

// finishes the upload
router.post('/uploads/:uploadId', (req, res) => {
    let uploadId = req.params.uploadId;
    let filename = req.query.filename || uploadId;
    try {
        finishUpload(uploadId, filename);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal Server Error');
    }
    return res.status(200).send('OK');
});

// exports
module.exports = router;
