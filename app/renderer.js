var _       = require('lodash');
var $       = require('jquery');
var md      = require('markdown-it')({ html: true, typographer: true, linkify: true });
var twemoji = require('twemoji');

md.use(require('markdown-it-checkbox'));
md.use(require('markdown-it-toc'));
md.use(require('markdown-it-emoji'));
md.use(require('markdown-it-highlightjs'));
md.use(require('markdown-it-sub'));
md.use(require('markdown-it-sup'));
md.use(require('markdown-it-footnote'));
md.use(require('markdown-it-video'));

md.renderer.rules.emoji = function(token, idx) {
    return twemoji.parse(token[idx].content, {
        callback: function (icon, options) {
            return 'node_modules/twemoji/svg/' + icon + '.svg';
        }
    });
};

$(function () {
    var editor = ace.edit('editor');
    editor.setTheme('ace/theme/solarized_light');
    editor.getSession().setMode('ace/mode/markdown');
    editor.getSession().setUseWrapMode(true);
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(15);
    editor.renderer.setPrintMarginColumn(false);

    function showPreview() {
        var str = editor.getValue();

        // TOC sugar
        str = str.replace(/\[\[(toc|TOC)\]\]/, '@[toc](Index)');

        $('#preview').html(md.render(str));
    }

    editor.on('change', _.debounce(showPreview, 150))
    showPreview()

    var search = $('[data-search]');

    search.keyup(function (e) {
        console.log(e);
    });

    $('[data-filter]').click(function (e) {
        console.log($(this).data('filter'))
        search.val($(this).data('filter'));
        e.preventDefault();
    });

    editor.getSession().on('changeScrollTop', function (scroll) {
        console.log(scroll)
        $('#preview').scrollTop(parseInt(scroll) || 0);
    });
});
