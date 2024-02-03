import { createRoot } from "react-dom/client"
import React, { useCallback, useEffect, useState } from "react"
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
import { EditorView } from "prosemirror-view"


function useAPI() {
    const [data, setData] = useState<any>(null)
    useEffect(() => {
        setTimeout(() => {
            setData({ "type": "doc", "content": [{ "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "feagryafsefs" }] }, { "type": "paragraph", "content": [{ "type": "text", "text": "/" }] }] })
        }, 2000)
    }, [])
    return data
}

// note: ProseMirror
function ReactApp() {
    let data = useAPI()
    let [test, setTest] = useState<any>(null)
    let [test2, setTest2] = useState<any>(null)
    const handlerOnChange = useCallback((editor: EditorView, pre: EditorState) => {
        if (!editor.state.doc.eq(pre.doc)) {
            console.log("changed!", data)
            // setTest(1)
            // setTimeout(() => {
            //     setTest2(2)
            // }, 2000)
        }
    }, [])
    // let handlerOnChange = (editor: EditorView, pre: EditorState) => {
    //     if (!editor.state.doc.eq(pre.doc)) {
    //         console.log("changed!", test, test2, setTest2)
    //         setTest(1)
    //         // setTimeout(() => {
    //         //     setTest2(2)
    //         // }, 2000)
    //     }
    // }
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

    const { target, editor, emitter } = useProseMirror({
        doc, plugins, schema
    }, data)

    useEffect(() => {
        emitter.on("changed", state => {
            console.log("changed!", state.doc)
            console.log(data)
        })
        return () => {
            emitter.removeListener("changed")
        }
    }, [data])

    return <div ref={target}></div>
}

createRoot(document.getElementById("app")!)
    // .render(<StrictMode><ReactApp /></StrictMode>)
    .render(<ReactApp />)