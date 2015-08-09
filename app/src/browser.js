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


//  var fs = require('fs');
//  var glob = require('glob');
//  var filesContainer = $('[data-filelist]');

//  function updateFiles(path) {
//      filesContainer.empty();

//      glob.sync(`${path}**/*.md`).forEach(function (file, i) {
//          var relative = file.replace(path, '')
//          var parts = relative.split('/');

//          filesContainer.append(`<li data-path="${file}">${relative}</li>`);
//      });
//  }

//  filesContainer.delegate('[data-path]', 'click', function (e) {
//      editor.setValue(fs.readFileSync($(e.target).data('path'), 'utf8'), -1);
//      $('#preview').empty()
//      $('.files').toggle();
//      $('.preview').toggle();
//  });

//  updateFiles('/users/doup/Sparkleshare/Sparkleshare/Akademiaa/');

