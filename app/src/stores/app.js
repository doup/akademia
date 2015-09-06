import {EventEmitter} from 'events';

import dispatcher from '../dispatcher/dispatcher';
import {types} from '../constants/constants';

// ---
import _ from 'lodash';
import File from '../file';
var files = [
    new File(__dirname +'/../../welcome.md', true),
    new File('/Users/doup/SparkleShare/SparkleShare/Akademia/goals-2015.md'),
    new File('/Users/doup/SparkleShare/SparkleShare/Akademia/scroll-lorem.md'),
    new File('/Users/doup/SparkleShare/SparkleShare/Akademia/scroll-test.md'),
];
// ---

class AppStore extends EventEmitter {
    constructor(dispatcher) {
        super();

        this.CHANGE_EVENT = 'change';
        this.LOAD_EVENT = 'load';

        this.browserIsPinned = false;
        this.browserIsVisible = false;

        this.editorFile = null;
        this.editorIsOnLeftColumn = true;

        // this.dispatchToken = dispatcher.register(this.actionHandler());
    }

    getFiles() {
        return _.chain(files)
            .map(function (file) {
                return [file.basename, file];
            })
            .zipObject()
            .value();
    }

    getFileContent() {
        return this.editorFile ? this.editorFile.getContent() : '';
    }

    getFileName() {
        return this.editorFile ? this.editorFile.basename : '';
    }

    actionHandler() {
        return (action) => {
            console.log(action);

            switch (action.type) {
                case types.EDITOR_CHANGE_FILE:
                    this.editorFile.setContent(action.value);
                    break;

                case types.EDITOR_LOAD_FILE:
                    this.editorFile = action.file;
                    this.emit(this.LOAD_EVENT);
                    return true;

                case types.EDITOR_TOGGLE_COLUMN:
                    this.editorIsOnLeftColumn = !this.editorIsOnLeftColumn;
                    break;

                case types.BROWSER_TOGGLE_PIN:
                    this.browserIsPinned = !this.browserIsPinned;
                    break;

                case types.BROWSER_TOGGLE_VISIBILITY:
                    this.browserIsVisible = !this.browserIsVisible;
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

export default new AppStore(dispatcher);
