// Shortcuts
import key from 'keymaster';
import browser from '../src/actions/browser';
import editor from '../src/actions/editor';

export default function initShortcuts() {
    // Allow shortcuts in INPUT, TEXTAREA & SELECT
    key.filter = (event) => {
        var tagName = (event.target || event.srcElement).tagName;
        key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
        return true;
    };

    key('ctrl+p, command+p', () => {
        browser.toggleVisibility();
    });

    key('ctrl+t, command+t', () => {
        editor.toggleColumn();
    });
}
