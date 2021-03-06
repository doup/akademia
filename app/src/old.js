/*
import {Browser} from '../src/browser.js';

var browser = new Browser('/users/doup/Sparkleshare/Sparkleshare/Akademia/');
var editor;

var BrowserUI = React.createClass({
    getState: function () {
        return {
            files: this.props.browser.getFiles(),
            tags: this.props.browser.getTags(),
        };
    },
    getInitialState: function () {
        return this.getState();
    },
    handleFilterChange: function (e) {
        var filter = React.findDOMNode(this.refs.filter).value;
        console.log(filter);
    },
    handleFileClick: function (file) {
        /// CHANGE THIS
        editor.setValue(file.file.__content, -1);
        $('#preview').empty();
        $('.preview').scrollTop(0);
        $('.files').toggle();
        ///
    },
    handleTagClick: function (tag) {
        console.log(tag);
    },
    render: function () {
        var files = _.map(this.state.files, (file, path) => {
            return (
                <li data-path={file} onClick={this.handleFileClick.bind(this, file)}>{path}</li>
            )
        });

        var tags = _.map(this.state.tags, (tag) => {
            return (
                <li><a onClick={this.handleTagClick.bind(this, tag)}>{tag}</a></li>
            )
        });

        return (
            <div>
                <input ref='filter' type='text' onChange={this.handleFilterChange}/>
                <ul className='tags'>
                    <li><a onClick={this.handleTagClick.bind(this, null)}>Clear</a></li>
                    {tags}
                </ul>
                <ul className='file-list'>
                    {files}
                </ul>
            </div>
        );
    }
})

React.render(
    <BrowserUI browser={browser} />,
    document.getElementById('files')
);

import _ from 'lodash';
import $ from 'jquery';
import MarkdownIt from 'markdown-it';
import twemoji from 'twemoji';

var md = MarkdownIt({ html: true, typographer: true, linkify: true });

md.use(require('markdown-it-checkbox'));
md.use(require('markdown-it-emoji'));
md.use(require('markdown-it-footnote'));
md.use(require('markdown-it-highlightjs'));
md.use(require('markdown-it-smartarrows'));
md.use(require('markdown-it-sub'));
md.use(require('markdown-it-sup'));
md.use(require('markdown-it-video'));

md.renderer.rules.emoji = function(token, idx) {
    return twemoji.parse(token[idx].content, {
        callback: function (icon, options) {
            return '../node_modules/twemoji/svg/' + icon + '.svg';
        }
    });
};

/// DISABLE PINCH ZOOM
// http://stackoverflow.com/q/29929411
document.addEventListener('mousewheel', function (e) {
  if(e.deltaY % 1 !== 0) {
    e.preventDefault();
  }
});
/// --- --- ---

$(function () {
    var margin = 15;
    editor = ace.edit('editor');
    editor.setTheme({ cssClass: 'ace-akademia', cssText: '' });
    //editor.setTheme('ace/theme/tomorrow_night');
    editor.getSession().setMode('ace/mode/markdown');
    editor.getSession().setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    editor.renderer.setPadding(margin);
    editor.renderer.setPrintMarginColumn(false);
    editor.renderer.setScrollMargin(margin);
    editor.setOption('scrollPastEnd', 1.0);
    editor.setOption('animatedScroll', true);

    /// AUTOCOMPLETE

    var langTools = ace.require("ace/ext/language_tools");
    var emojis = require('../node_modules/markdown-it-emoji/lib/data/full.json');

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

    /// SYNC SCROLL ///

    var mdHeadings, htmlHeadings;

    function rowToPixels(row) {
        var screenRow = editor.getSession().documentToScreenPosition(row, 0).row;

        return (screenRow * editor.renderer.lineHeight) + margin;
    }

    function getMdHeadings(tokens) {
        var headings = [];
        var height = getEditorHeight();
        var line;

        function getOffset(row) {
            return rowToPixels(row) / height;
        }

        tokens.forEach(function (token) {
            if (token.type == 'inline' || token.type == 'html_block') {
                if (/<h[1-6]\s*?>/gi.test(token.content)) {
                    headings.push(getOffset(token.map[0]));
                }
            }

            if (token.type == 'inline' && token.map != null) {
                line = token.map[0];
            } else if (token.type == 'heading_close') {
                headings.push(getOffset(line));
            }
        });

        return [0.0].concat(headings).concat(1.0);
    }

    function getHtmlHeadings() {
        var headings = [];
        var height = $('#preview')[0].scrollHeight;
        var offset;

        $('#preview > :header').each((i, el) => {
            headings.push($(el).offset().top / height);
        });

        return [0.0].concat(headings).concat(1.0);
    }

    function getScrollPos(s, from, to) {
        var i, idx;

        for (i = 0; i < (from.length - 1); i++) {
            if (s >= from[i] && s <= from[i + 1]) {
                idx = i;
                break;
            }
        }

        var pos = (s - from[idx]) / (from[idx + 1] - from[idx]);

        return to[idx] + ((to[idx + 1] - to[idx]) * pos);
    }

    function getEditorHeight() {
        var lineCount = editor.getSession().getLength();

        return rowToPixels(lineCount);
    }

    editor.getSession().on('changeScrollTop', function (scroll) {
        if ($('.editor').is(':hover')) {
            var pos = (scroll + margin) / getEditorHeight();
            pos = (pos > 1) ? 1 : ((pos < 0) ? 0 : pos);

            $('.preview').scrollTop(
                getScrollPos(pos, mdHeadings, htmlHeadings) *
                ($('#preview').outerHeight() + margin)
            );
        }
    });

    $('.preview').scroll(function (e) {
        if ($(this).is(':hover')) {
            var pos = ($(this).scrollTop() / ($(this)[0].scrollHeight - $(this).height()));

            editor.getSession().setScrollTop(
                getScrollPos(pos, htmlHeadings, mdHeadings) *
                getEditorHeight() - margin
            );
        }
    });

    $(window).resize(function (e) {
        $('#preview').css('marginBottom', $(window).outerHeight());
    });

    $(window).resize();

    /////////////////

    function showPreview() {
        var env = {};
        var tokens = md.parse(editor.getValue(), env);

        $('#preview').html(md.renderer.render(tokens, md.options, env));

        // Update scroll data
        mdHeadings = getMdHeadings(tokens);
        htmlHeadings = getHtmlHeadings();
    }

    editor.on('change', _.debounce(showPreview, 500))
    showPreview()

    /// --- --- ---

    /// Search events

    var search = $('#files input');

    search.keyup(function (e) {
        //console.log(e);
    });

    $('[data-filter]').click(function (e) {
        console.log($(this).data('filter'))
        search.val($(this).data('filter'));
        e.preventDefault();
    });

    /// --- --- ---

    /// load welcome.md

    var fs = require('fs');
    editor.setValue(fs.readFileSync(__dirname +'/../welcome.md', 'utf8'), -1);
    editor.session.setScrollTop(-margin);
    editor.focus();

    /// --- --- ---

    //// Bidirectional checkbox
    // How to solve this when code is used? e.g: `- [ ]`
    //
    // $('.preview').delegate('input[type=checkbox]', 'change', function (e) {
    //     console.log($('.preview input[type=checkbox]').index($(this)));
    //     console.log($(this).is(':checked'));
    // });
    ////
});
*/
