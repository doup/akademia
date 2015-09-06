# Welcome to Akademia :book:

## Reference

- https://stackedit.io
- http://writeapp.net/mac/
- https://marxi.co

## Events

- ace:change
    - update preview
    - update scroll-data
    - sync preview scroll
    - save file
- ace:scroll
    - sync preview scroll
- preview:scroll
    - sync ace scroll
- browser:close
    - focus editor
    - sync preview scroll
- app:`cmd+p`
    - if browser not pinned
        - toggle browser
        - check preview visibility (see app:cmd+t)
- app:`cmd+t`
    - toggle ace & preview columns
    - check preview visibility:
        - if browser is visible AND preview is on right:
            - hide preview
- browser:pin
    - toggle isPinned state
- browser:filter:keyup
    - filter files
    - update files view
- browser:tag:click
    - change filter
    - fire event
- browser:folder:click
    - navigate to folder
- browser:file:click
    - load file
    - if is not pinned
        - browser:close (see event)
- filesystem:update-file (via watch)
    - ...

## TODO Markdown

- [ ] Videos. `//` tema konpondu.
- [ ] [More plugins?](https://www.npmjs.com/browse/keyword/markdown-it-plugin)
- [ ] On checkbox toggle show warning ("not implemented, change in markdown")
- [ ] Tweak theme (`zenburn` beitu)
- [x] Emoji hint, popup.
- [x] Double-synced scroll
- [x] Open external links in browser (not in electron)
- [x] Emoji
- [x] Tables
- [x] Tipography
- [x] Code blocks
- [x] Checkboxes
- [x] Footnotes
- [x] Sub/Sup
- [x] `<http://example.com>` links. HTML encoding problema bat uan.

## TODO App

- [ ] Preview footer buttons:
    - [ ] TOC
    - [ ] Progress bar (for checkboxes)
    - [ ] Frontmatter table?
- [ ] Images
- [ ] CSS, UI, UX, Design.
- [ ] Añadir shortcuts + documentar: `cmd+enter` (toggle editor), `cmd+p` (search), `cmd+s` (toggle sidebar)
- [ ] Bidirectional checkbox. Synced-scroll moduan soluzionatzia ziok, zenbagarren checkboxa dan beitu eta beste aldian N-garrena eguneratu.
- [ ] Preview beian TOC link bat eta Progress mini summary bat jarri (adib: `2/20`)
- [ ] Use URL to know which file was open `#/path/to/file.md`. Usefull for development

## TODO Future

- [ ] MathJax
- [ ] <http://bramp.github.io/js-sequence-diagrams/>
- [ ] <http://adrai.github.io/flowchart.js/>
- [ ] Link between documents
- [ ] Markdown css style with different font-sizes/colors: http://codemirror.net/demo/variableheight.html
- [ ] Hyphenate [based on language](https://www.npmjs.com/package/cld-atom-shell)?

## Introducing Markdown

> Markdown is a plain text formatting syntax designed to be converted to HTML. Markdown is popularly used as format for readme files... or in text editors for the quick creation of rich text documents. -- [Wikipedia](http://en.wikipedia.org/wiki/Markdown)

As showed in this manual, it uses hash(`#`) to identify headings, emphasizes some text to be **bold** or _italic_. You can insert a [link](http://www.example.com).

### Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'

### Footnotes

You can write footnotes using a keyword [^demo], or numbers[^1].

[^demo]: This is a demo footnote.

[^1]: Here goes another footnote.

### Subscript & supscript

H~2~O

e = mc^2^

### Code block

``` python
@requires_authorization
def somefunc(param1='', param2=0):
    '''A docstring'''
    if param1 > param2: # interesting
        print 'Greater'
    return (param2 - param1 + 1) or None

class SomeClass:
    pass

>>> message = '''interpreter
... prompt'''
```

    function test() {
        return 'javascript';
    }

### Videos

@[youtube](dQw4w9WgXcQ)

@[vimeo](68841186)

@[youtube](MV_3Dpw-BRY)

### Table

| Item      |    Value | Quantity |
| :-------- | --------:| :------: |
| Computer  | 1600 USD |     5    |
| Phone     |   12 USD |    12    |
| Pipe      |    1 USD |   234    |

### Checkbox

You can use `- [ ]` and `- [x]` to create checkboxes, for example:

- [x] Item1
- [ ] Item2
- [ ] Item3

> **Note:** Currently it is only partially supported. You can't toggle checkboxes in the preview.

### Emoji :kissing_smiling_eyes:

:see: [emoji cheat-sheet](http://www.emoji-cheat-sheet.com) :document:. Hit `ctrl+space` for autocomplete.

## Feedback & Bug Report

- [GitHub](https://github.com/doup/akademia)
- Twitter: [@aillarra](https://twitter.com/aillarra)
- Email: <asier@illarra.com>
