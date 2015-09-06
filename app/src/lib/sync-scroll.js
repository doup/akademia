import $ from 'jquery';

export default class SyncScroll {
    constructor(editor, margin) {
        this.editor = editor;
        this.margin = margin;
    }

    getEditorHeight() {
        var lineCount = this.editor.session.getLength();

        return this.rowToPixels(lineCount);
    }

    getHtmlHeadings(previewEl, statusHeight) {
        var headings = [];
        var height = previewEl[0].scrollHeight;
        var offset;

        previewEl.children(':header').each((i, el) => {
            headings.push(($(el).offset().top - statusHeight) / height);
        });

        return [0.0].concat(headings).concat(1.0);
    }

    getMdHeadings(tokens) {
        var self = this;
        var headings = [];
        var height = this.getEditorHeight();
        var line;

        function getOffset(row) {
            return self.rowToPixels(row) / height;
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

    getScrollPos(s, from, to) {
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

    rowToPixels(row) {
        var screenRow = this.editor.session.documentToScreenPosition(row, 0).row;

        return (screenRow * this.editor.renderer.lineHeight) + this.margin;
    }

    syncEditor(previewContainerEl) {
        var pos = (previewContainerEl.scrollTop() / (previewContainerEl[0].scrollHeight - previewContainerEl.height()));

        this.editor.session.setScrollTop(
            this.getScrollPos(pos, this.htmlHeadings, this.mdHeadings) *
            this.getEditorHeight() - this.margin
        );
    }

    syncPreview(scroll, previewContainerEl, previewEl) {
        var pos = (scroll + this.margin) / this.getEditorHeight();
        pos = (pos > 1) ? 1 : ((pos < 0) ? 0 : pos);

        previewContainerEl.scrollTop(
            this.getScrollPos(pos, this.mdHeadings, this.htmlHeadings) *
            (previewEl.outerHeight() + this.margin)
        );
    }

    updateData(tokens, previewEl, statusHeight) {
        this.mdHeadings = this.getMdHeadings(tokens);
        this.htmlHeadings = this.getHtmlHeadings(previewEl, statusHeight);
    }
}
