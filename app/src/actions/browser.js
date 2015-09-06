import dispatcher from '../dispatcher/dispatcher';
import {types} from '../constants/constants';

export default {
    /*
    togglePin: function () {
        dispatcher.dispatch({
            type: types.BROWSER_TOGGLE_PIN,
        });
    },
    */
    toggleVisibility: function () {
        dispatcher.dispatch({
            type: types.BROWSER_TOGGLE_VISIBILITY,
        });
    }
};
