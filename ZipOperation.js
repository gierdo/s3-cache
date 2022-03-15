const fs = require('fs');
const core = require('@actions/core');
const tar = require('tar');

class ZipOperation {
    constructor() {

    }

    unzipFile(path, dir_to_unzip) {
        return new Promise((resolve, reject) => {
            tar.x({
                file: path,
                C: dir_to_unzip
            }).then((result) => {
                resolve(result);
            }, (err) => {
                reject(err);
            })
        })
    }

    zipFile(filename, sources) {
        console.log(`C: ${sources}`);
        core.debug(`C: ${sources}`);
        return new Promise((resolve, reject) => {
            tar.create({
                gzip: true,
                file: filename
            }, sources).then((result) => {
                console.log(`tar file created: ${filename}`);
                resolve(result);
            }, (err) => {
                reject(err);
            })
        })
    }
}

module.exports = ZipOperation;
