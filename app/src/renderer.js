import React from 'react';

import editorActions from '../src/actions/editor';
import File from '../src/file';
import App from '../src/components/app';
import initShortcuts from '../src/shortcuts';

initShortcuts();

React.render(
    <App />,
    document.getElementById('app')
);

editorActions.loadFile(new File(__dirname +'/../welcome.md', true));

// import browser from '../src/actions/browser';
// browser.toggleVisibility();
