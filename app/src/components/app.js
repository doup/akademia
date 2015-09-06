import React from 'react';

import AppStore from '../stores/app';
import Browser from '../components/browser';
import Editor from '../components/editor';

function getStateFromStores() {
    return {
        fileContent: AppStore.getFileContent(),
        fileName: AppStore.getFileName(),
        fileTags: ['antropoceno', 'gra'],
        fileFrontmatter: {},
        editorIsOnLeftColumn: AppStore.editorIsOnLeftColumn,
        browserIsPinned: AppStore.browserIsPinned,
        browserIsVisible: AppStore.browserIsVisible,
    };
}

export default React.createClass({
    /*
    componentDidMount: function () {
        AppStore.addChangeListener(this.handleStoreChange);
    },

    componentWillUnmount: function () {
        AppStore.removeChangeListener(this.handleStoreChange);
    },

    getInitialState: function () {
        return getStateFromStores();
    },

    handleStoreChange: function () {
        this.setState(getStateFromStores());
    },
    */

    render: function () {
        return (
            <div>
                <Editor />
                <Browser />
            </div>
        );
    },
});
