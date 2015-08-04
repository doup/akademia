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
    editor.setTheme('ace/theme/chrome');
    editor.getSession().setMode('ace/mode/markdown');
    editor.getSession().setUseWrapMode(true);
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(15);
    editor.renderer.setPrintMarginColumn(false);
    editor.setOption('scrollPastEnd', 1.0);

    function showPreview() {
        var str = editor.getValue();

        // TOC sugar
        str = str.replace(/\[\[(toc|TOC)\]\]/, '@[toc](Index)');

        $('#preview').html(md.render(str));
    }

    editor.on('change', _.debounce(showPreview, 250))
    showPreview()

    /*
    editor.getSession().on('changeScrollTop', function (scroll) {
        console.log(scroll)
        $('#preview').scrollTop(parseInt(scroll) || 0);
    });
    */

    var search = $('[data-search]');

    search.keyup(function (e) {
        console.log(e);
    });

    $('[data-filter]').click(function (e) {
        console.log($(this).data('filter'))
        search.val($(this).data('filter'));
        e.preventDefault();
    });

    // Allow shortcuts in INPUT, TEXTAREA & SELECT
    key.filter = function(event){
        var tagName = (event.target || event.srcElement).tagName;
        key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
        return true;
    }

    // Shortcuts
    key('ctrl+p, command+p', () => {
        $('.files').toggle();

        if ($('.files').is(':visible')) {
            search.focus();
        } else {
            editor.focus();
        }
    });

    key('ctrl+t, command+t', () => {
        $('.editor, .preview').toggleClass('right left');
    });

    var fs = require('fs');
    var glob = require('glob');
    var filesContainer = $('[data-filelist]');

    function updateFiles(path) {
        filesContainer.empty();

        glob.sync(`${path}**/*.md`).forEach(function (file, i) {
            var relative = file.replace(path, '')
            var parts = relative.split('/');

            filesContainer.append(`<li data-path="${file}">${relative}</li>`);
        });
    }

    filesContainer.delegate('[data-path]', 'click', function (e) {
        editor.setValue('\n' + fs.readFileSync($(e.target).data('path'), 'utf8'), -1);
        $('#preview').empty()
        $('.files').toggle();
    });

    updateFiles('/users/doup/Sparkleshare/Sparkleshare/Akademia/');
});
