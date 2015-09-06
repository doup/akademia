import _ from 'lodash';
import {basename, extname} from 'path';
import yamlFront from 'yaml-front-matter';

export default class File {
    constructor(path, isReadOnly = false) {
        this.isReadOnly = isReadOnly;
        this.path       = path;
        this.filename   = basename(path);
        this.extname    = extname(path);

        if (this.extname == '.md') {
            this.file = yamlFront.loadFront(path);
            this.file.__content = this.file.__content.trimLeft();
        } else {
            this.file = {};
        }
    }

    getContent() {
        return this.file.__content;
    }

    getFilename() {
        return this.filename;
    }

    getFrontmatter() {
        var fm = _.cloneDeep(this.file);
        delete fm.__content;

        return fm;
    }

    getTags() {
        return this.getFrontmatter().tags || [];
    }

    setContent(content) {
        this.file.__content = content;
    }

    equals(file) {
        return this.path === file.path;
    }
}
