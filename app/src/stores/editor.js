import {EventEmitter} from 'events';

import dispatcher from '../dispatcher/dispatcher';
import {types} from '../constants/constants';

class EditorStore extends EventEmitter {
    constructor(dispatcher) {
        super();

        this.CHANGE_EVENT = 'change';
        this.LOAD_EVENT = 'load';

        this.file = null;
        this.editorIsOnLeftColumn = true;

        this.dispatchToken = dispatcher.register(this.actionHandler());
    }

    actionHandler() {
        return (action) => {
            console.log('EDITOR_STORE', action);

            switch (action.type) {
                /*
                case types.EDITOR_CHANGE_FILE:
                    this.file.setContent(action.value);
                    break;
                */
                case types.EDITOR_LOAD_FILE:
                    this.file = action.file;
                    this.emit(this.LOAD_EVENT);
                    return true;

                case types.EDITOR_TOGGLE_COLUMN:
                    this.editorIsOnLeftColumn = !this.editorIsOnLeftColumn;
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

    getContent() {
        return this.file ? this.file.getContent() : '';
    }

    getFilename() {
        return this.file ? this.file.getFilename() : '';
    }

    getFrontmatter() {
        return this.file ? this.file.getFrontmatter() : {};
    }

    getTags() {
        return this.file ? this.file.getTags() : [];
    }
}

export default new EditorStore(dispatcher);
