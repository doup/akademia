import _ from 'lodash';
import cx from 'classnames';
import React from 'react';

import editorActions from '../actions/editor';
import browserStore from '../stores/browser';

function getStateFromStores() {
    return {
        isPinned: browserStore.isPinned,
        isVisible: browserStore.isVisible,
        files: browserStore.getFiles(),
    };
}

var Browser = React.createClass({
    getInitialState: function () {
        return getStateFromStores();
    },

    componentDidMount: function () {
        browserStore.on(browserStore.CHANGE_EVENT, this.handleStoreChange);
    },

    componentWillUnmount: function () {
        browserStore.removeListener(browserStore.CHANGE_EVENT, this.handleStoreChange);
    },

    handleFileClick: function (file) {
        editorActions.loadFile(file);
    },

    render: function () {
        var classes = cx('column right files', {
            'hidden': !this.state.isVisible
        });

        var files = _.map(this.state.files, (file, filename) => {
            return <li onClick={this.handleFileClick.bind(this, file)}>{filename}</li>;
        });

        console.log(this.state);

        return (
            <div className={classes}>
                <div className='status'>
                    <input type='text' />
                </div>
                <div id='files' className='content'>
                    <ul className='file-list'>
                        {files}
                    </ul>
                </div>
            </div>
        );
    },

    handleStoreChange: function () {
        this.setState(getStateFromStores());
    }
});

module.exports = Browser;
