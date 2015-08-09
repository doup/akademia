import {basename} from 'path';
import yamlFront from 'yaml-front-matter';

export class File {
    constructor(path) {
        this.isLoaded = false;
        this.path     = path;
        this.basename = basename(path);
        this.file     = yamlFront.loadFront(path);
    }

    equals(file) {
        return this.path === file.path;
    }
}
