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

export default md;
