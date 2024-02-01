import { createRoot } from "react-dom/client"
import React, { StrictMode } from "react"
import { EditorState } from "prosemirror-state"
import { Schema } from "prosemirror-model"
import { addListNodes } from "prosemirror-schema-list"
import * as basic from "prosemirror-schema-basic"
import { keymap } from "prosemirror-keymap"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { history } from "prosemirror-history"
import { baseKeymap } from "prosemirror-commands"
import { inputRules, smartQuotes, emDash, ellipsis } from "prosemirror-inputrules"
import { Template, layout, layout_doc } from "./src/nuo/plugin/layout.ts"
import { blockQuoteRule, bulletListRule, codeBlockRule, headingRule, imageRule, orderedListRule } from "./src/nuo/inputrule/basic.ts"
import { useProseMirror } from "./src/nuo/react.ts"

// function useEditor(config: Omit<EditorConfig, "target">) {
//     let editor: Editor | null = null
//     const target = useRef(null)
//     useEffect(() => {
//         if (target.current) {
//             editor = new Editor({
//                 target: target.current,
//                 ...config
//             })
//         }
//     })

//     return { target, editor }
// }

// note: ProseMirror
function ReactApp() {
    const schema = new Schema({
        nodes: addListNodes(basic.schema.spec.nodes, "paragraph block*", "block"),
        marks: basic.schema.spec.marks
    })

    const template: Template = [[0, schema.nodes.heading, { "data-placeholder": "How is day today :)" }]]
    const doc = layout_doc(template, schema)
    const rules = smartQuotes.concat(ellipsis, emDash)
    if (schema.nodes.blockquote) rules.push(blockQuoteRule(schema.nodes.blockquote))
    if (schema.nodes.ordered_list) rules.push(orderedListRule(schema.nodes.ordered_list))
    if (schema.nodes.bullet_list) rules.push(bulletListRule(schema.nodes.bullet_list))
    if (schema.nodes.code_block) rules.push(codeBlockRule(schema.nodes.code_block))
    if (schema.nodes.image) rules.push(imageRule(schema.nodes.image))
    if (schema.nodes.heading) rules.push(headingRule(schema.nodes.heading, 6))

    const plugins = [
        inputRules({ rules }),
        // keymap(buildKeymap(schema, mapKeys)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        history(),
        layout(template)
    ]

    const { target, editor } = useProseMirror({
        doc, plugins, schema, handlerOnChange(editor, pre) {
            if (!editor.state.doc.eq(pre.doc)) {
                console.log("changed!", target.current)
            }
        }
    })
    setTimeout(() => {
        console.log('1>', target, editor)
        const doc = editor.current?.state.schema.nodeFromJSON({ "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "feagryafsefs" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "/" }] }] })
        editor.current?.updateState(EditorState.create({ doc, plugins, schema }))
    }, 2000)

    return <div ref={target}></div>
}

createRoot(document.getElementById("app")!)
    .render(<StrictMode><ReactApp /></StrictMode>)