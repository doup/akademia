import _ from 'lodash';
import $ from 'jquery';
import cx from 'classnames';
import React from 'react';

import ace from '../lib/ace';
import editorStore from '../stores/editor';
import editorActions from '../actions/editor';
import md from '../lib/markdown';
import SyncScroll from '../lib/sync-scroll';

const DEBOUNCE_TIME = 500;

export default React.createClass({
    getStateFromStores: function () {
        return {
            content: editorStore.getContent(),
            htmlContent: this.htmlContent || '',
            filename: editorStore.getFilename(),
            tags: editorStore.getTags(),
            frontmatter: editorStore.getFrontmatter(),
            editorIsOnLeftColumn: editorStore.editorIsOnLeftColumn,
        }
    },

    getInitialState: function () {
        return this.getStateFromStores();
    },

    componentDidMount: function () {
        this.margin     = 15;
        this.editor     = ace(React.findDOMNode(this.refs.editor), this.margin);
        this.syncScroll = new SyncScroll(this.editor, this.margin);

        this.updatePreviewMarginBottom();

        // Events
        editorStore.on(editorStore.LOAD_EVENT, this.handleStoreFileLoad);
        editorStore.on(editorStore.CHANGE_EVENT, this.handleStoreChange);
        this.editor.on('change', this.handleContentChange);
        this.editor.session.on('changeScrollTop', this.handleEditorScroll);
        $(React.findDOMNode(this.refs.previewContainer))
        .on('scroll', this.handlePreviewScroll)
        .delegate('a', 'click', function (e) {
            require('shell').openExternal($(this).attr('href'));
            e.preventDefault();
        });
        $(window).resize(this.handleWindowResize);
    },

    componentWillUnmount: function () {
        editorStore.off(editorStore.LOAD_EVENT, this.handleFileLoad);
    },

    handleStoreFileLoad: function () {
        var state = this.getStateFromStores();

        // Change Ace Editor value
        // Disable and re-enable the change event to avoid
        // saving the file on editor change.
        this.editor.off('change', this.handleContentChange);
        this.editor.setValue(state.content, -1);
        this.editor.on('change', this.handleContentChange);
        this.editor.focus();

        // editor scroll to top
        this.updatePreviewAndScrollData(state.content);
        state.htmlContent = this.htmlContent;
        // Sync preview scroll

        this.setState(state);
    },

    handleStoreChange: function () {
        this.setState(this.getStateFromStores());
    },

    handleContentChange: _.debounce(function () {
        var content = this.editor.getValue();
        this.updatePreviewAndScrollData(content);
        // TODO: SAVE ACTION
        //this.setState(this.getStateFromStores());
    }, DEBOUNCE_TIME),

    handleFilenameChange: _.debounce(function () {
        console.log(React.findDOMNode(this.refs.filename).value);
    }, DEBOUNCE_TIME),

    handleTagsChange: _.debounce(function () {
        var tags = React.findDOMNode(this.refs.tags).value
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag !== '')
            .sort();

        console.log(tags);
    }, DEBOUNCE_TIME),

    handleEditorScroll: function (scroll) {
        if ($(React.findDOMNode(this.refs.editor)).is(':hover')) {
            this.syncScroll.syncPreview(
                scroll,
                $(React.findDOMNode(this.refs.previewContainer)),
                $(React.findDOMNode(this.refs.preview)),
                $(React.findDOMNode(this.refs.status)).outerHeight()
            );
        }
    },

    handlePreviewScroll: function (e) {
        var previewContainerEl = $(React.findDOMNode(this.refs.previewContainer));

        if (previewContainerEl.is(':hover')) {
            this.syncScroll.syncEditor(previewContainerEl);
        }
    },

    handleWindowResize: function () {
        this.updatePreviewMarginBottom();
    },

    render: function () {
        var editorClasses = cx('column editor', {
            'left': this.state.editorIsOnLeftColumn,
            'right': !this.state.editorIsOnLeftColumn,
        });

        var previewClasses = cx('column preview', {
            'left': !this.state.editorIsOnLeftColumn,
            'right': this.state.editorIsOnLeftColumn,
        });

        return (
            <div>
                <div className={editorClasses}>
                    <div className='status'>
                        <input ref='filename'
                               className='filename'
                               type='text'
                               value={this.state.filename}
                               placeholder='tags comma separated'
                               onChange={this.handleFilenameChange} />
                        <input ref='tags'
                               className='tags'
                               type='text'
                               value={this.state.tags.join(', ')}
                               placeholder='tags'
                               onChange={this.handleTagsChange} />
                    </div>
                    <div ref='editor' className='content' />
                </div>
                <div ref='previewContainer' className={previewClasses}>
                    <div ref='status' className='status'>
                        <button>Metadata</button>
                        <button>Progress 2/8</button>
                        <button>TOC</button>
                        <button>Settings</button>
                    </div>
                    <div ref='preview'
                         className='content'
                         dangerouslySetInnerHTML={{ __html: this.state.htmlContent }} />
                </div>
            </div>
        )
    },

    updatePreviewAndScrollData: function (content) {
        var env = {};
        var tokens = md.parse(content, env);
        var previewContainerEl = $(React.findDOMNode(this.refs.previewContainer));
        var previewEl = $(React.findDOMNode(this.refs.preview));
        var statusEl = $(React.findDOMNode(this.refs.status));

        // Update preview
        this.htmlContent = md.renderer.render(tokens, md.options, env);
        previewEl.html(this.htmlContent);

        // Update scroll data
        previewContainerEl.scrollTop(0);
        this.syncScroll.updateData(tokens, previewEl, statusEl.outerHeight());
    },

    updatePreviewMarginBottom: function () {
        var statusEl = $(React.findDOMNode(this.refs.status));
        var previewEl = $(React.findDOMNode(this.refs.preview));
        previewEl.css('marginBottom', $(window).outerHeight() - statusEl.outerHeight());
    },
});
