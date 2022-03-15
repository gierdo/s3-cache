const S3Operation = require('./S3Operation.js');
const ZipOperation = require('./ZipOperation.js');
const fs = require('fs');
const core = require('@actions/core');

class CacheOperation {
    constructor(connection, bucket_root, bucket_dir, cache_key, filename, paths_to_cache, dir_to_unzip) {
        this.connection = connection;
        this.filename = filename;
        this.bucket = `${bucket_root}`;
        this.key = `${bucket_dir}/${cache_key}/${filename}`;
        this.s3Operation = new S3Operation(connection, bucket_root, bucket_dir, cache_key, filename);
        this.zipOperation = new ZipOperation();
        this.paths_to_cache = paths_to_cache;
        this.dir_to_unzip = dir_to_unzip;


        console.log("paths to cache: here we go")
        console.log(this.paths_to_cache)

    }

    retrieveCache() {
        return new Promise((resolve, reject) => {
            this.s3Operation.pullFile().then((result) => {
                this.zipOperation.unzipFile(`./${this.filename}`, this.dir_to_unzip).then((result) => {
                    console.log("paths to cache: here we go")
                    console.log(this.paths_to_cache)
                    this.lsDir(this.paths_to_cache);
                    resolve({"operation": "retrieval"});
                }, function (err) {
                    core.error(`Error retrieving cache`);
                    console.log(err);
                    reject(err);
                })
            }, function (err) {
                if (err.code == 'NoSuchKey') {
                    resolve({"operation": "creation"});;
                } else {
                    core.error(`Error pushing cache file`);
                    console.log(err, err.stack);
                    reject();
                }
            })
        })
    }

    generateCache() {
        return new Promise((resolve, reject) => {
            console.log("paths to zip: here we go")
            console.log(this.paths_to_cache)
            this.zipOperation.zipFile(this.filename, this.paths_to_cache).then((result) => {
                fs.readFile(this.filename, (err, fileData) => {
                    this.s3Operation.pushFile(fileData).then((result) => {
                        console.log(`file ${this.filename} uploaded`);
                        resolve();
                    }, function (err) {
                        console.log(err, err.stack);
                        reject(err);
                    });
                });
            }, function (err) {
                console.log(err);
                core.err(err);
                reject(err);
            });
        })
    }

    lsDir(paths) {
        paths.forEach(function (path) {
            if (fs.lstatSync(path).isDirectory()) {
                fs.readdir(path, (err, files) => {
                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    }
                    files.forEach(function (file) {
                        console.log(file);
                    });
                });
            } else {
                console.log(path);
            }
        });
    }
}

module.exports = CacheOperation;
