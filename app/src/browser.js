import _ from 'lodash';
import {EventEmitter} from 'events';
import {Gaze} from 'gaze';
import glob from 'glob';
import {normalize} from 'path';
import {File} from './file.js';

export class Browser extends EventEmitter {
    constructor(path) {
        super();

        this.path = normalize(path);
        this.glob = '**/*.md';

        this._loadFiles();
        this._initWatcher();
    }

    _initWatcher() {
        this.watcher = new Gaze(this.glob, { cwd: this.path });

        this.watcher.on('error', err => {
            console.log(err);
        });

        this.watcher.on('renamed', (newPath, oldPath) => {
            console.log('renamed', newPath, oldPath);
        });

        this.watcher.on('changed', filepath => {
            console.log('changed '+ filepath);
        });

        this.watcher.on('added', filepath => {
            console.log('added '+ filepath);
        });

        this.watcher.on('deleted', filepath => {
            console.log('deleted '+ filepath);
        });
    }

    _loadFiles() {
        this.files = _.chain(glob.sync(this.path + this.glob))
            .map((file) => {
                return [file.replace(this.path, ''), new File(file)];
            })
            .zipObject()
            .value();
    }

    getFiles() {
        return this.files;
    }

    getState() {
        return {
            files: this.files,
            tags: ['favorites', 'antropoceno', 'gra'],
        };
    }
}
