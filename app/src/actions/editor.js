import dispatcher from '../dispatcher/dispatcher';
import {types} from '../constants/constants';

export default {
    loadFile: function (file) {
        dispatcher.dispatch({
            type: types.EDITOR_LOAD_FILE,
            file: file,
        });
    },
    /*
    changeFile: function (value) {
        dispatcher.dispatch({
            type:  types.EDITOR_CHANGE_FILE,
            value: value,
        });
    },
    */
    toggleColumn: function () {
        dispatcher.dispatch({
            type: types.EDITOR_TOGGLE_COLUMN,
        });
    },
};
