export default function(el, margin) {
    var editor = ace.edit(el);

    editor.setTheme({ cssClass: 'ace-akademia', cssText: '' });
    editor.session.setMode('ace/mode/markdown');
    editor.session.setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(margin);
    editor.renderer.setPrintMarginColumn(false);
    editor.renderer.setScrollMargin(margin);
    editor.setOption('scrollPastEnd', 1.0);
    editor.setOption('animatedScroll', true);

    /// AUTOCOMPLETE

    var langTools = ace.require("ace/ext/language_tools");
    var emojis = require('../../node_modules/markdown-it-emoji/lib/data/full.json');

    var emojiCompleter = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            callback(null, _.map(emojis, function (value, key) {
                return { name: value, value: `:${key}:`, meta: 'emoji' };
            }));

            return;
        }
    };

    langTools.setCompleters([emojiCompleter]);

    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: false,
        enableLiveAutocompletion: false,
    });

    return editor;
}
