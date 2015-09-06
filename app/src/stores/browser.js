import _ from 'lodash';
import {EventEmitter} from 'events';
import glob from 'glob';
import {normalize} from 'path';
import {statSync} from 'fs';

import dispatcher from '../dispatcher/dispatcher';
import File from '../file';
import {types} from '../constants/constants';

// ---
var files = [
    new File(__dirname +'/../../welcome.md', true),
    new File('/Users/doup/SparkleShare/SparkleShare/Akademia/goals-2015.md'),
    new File('/Users/doup/SparkleShare/SparkleShare/Akademia/scroll-lorem.md'),
    new File('/Users/doup/SparkleShare/SparkleShare/Akademia/scroll-test.md'),
    new File('/Users/doup/SparkleShare/SparkleShare/Akademia/limpiar-colchon.md'),
    new File('/Users/doup/SparkleShare/SparkleShare/Akademia/Recetas/higos-en-almibar.md'),
];
// ---

class BrowserStore extends EventEmitter {
    constructor(dispatcher, path) {
        super();

        this.CHANGE_EVENT = 'change';

        this.path = normalize(path);
        this.glob = '**/*.md'; '**/*';
        this.isPinned = false;
        this.isVisible = false;

        this.dispatchToken = dispatcher.register(this.actionHandler());
    }

    getFiles() {
        return _.chain(glob.sync(this.path + this.glob, { follow: false }))
            .filter((file) => {
                try {
                    return statSync(file).isFile();
                } catch (e) {
                    return false;
                }
            })
            .map((file) => {
                return [file.replace(this.path, ''), new File(file)];
            })
            .zipObject()
            .value();
    }

    actionHandler() {
        return (action) => {
            console.log('BROWSER_STORE', action);

            switch (action.type) {
                /*
                case types.BROWSER_TOGGLE_PIN:
                    this.isPinned = !this.isPinned;
                    break;
                */

                case types.BROWSER_TOGGLE_VISIBILITY:
                    this.isVisible = !this.isVisible;
                    break;

                default:
                    // no-op
            }

            if (action.type in types) {
                this.emit(this.CHANGE_EVENT);
            }

            return true;
        };
    }
}

export default new BrowserStore(dispatcher, '/Users/doup/SparkleShare/SparkleShare/Akademia/');
