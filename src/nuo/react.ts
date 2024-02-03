import { EditorState, EditorStateConfig } from "prosemirror-state"
import { DirectEditorProps, EditorView } from "prosemirror-view"
import { useRef, useEffect } from "react"
import { EventEmitter } from "eventemitter3"
import { changed } from "./plugin/changed"
import "prosemirror-view/style/prosemirror.css"
import "./prosemirror.css"

export interface ProseMirrorConfig extends Omit<DirectEditorProps, "state">, EditorStateConfig { }

interface ProseMirrorEvent {
    changed: (state: EditorState) => void
}

export function useProseMirror(config: ProseMirrorConfig, content?: object) {
    const target = useRef(null)
    const editor = useRef<EditorView | null>(null)
    const eEmitter = useRef(new EventEmitter<ProseMirrorEvent>())

    useEffect(() => {
        if (target.current) {
            let { plugins, schema, storedMarks, selection, doc, ...props } = config
            const handler = (editor: EditorView, pre: EditorState) => {
                if (!editor.state.doc.eq(pre.doc)) {
                    eEmitter.current.emit("changed", editor.state)
                }
            }
            plugins = [changed(handler)].concat(plugins || [])
            const state = EditorState.create({ plugins, schema, storedMarks, selection, doc })
            editor.current = new EditorView(target.current, { state, ...props })
        }
        return () => {
            editor?.current?.destroy()
        }
    }, [target])

    useEffect(() => {
        if (editor.current && !editor.current?.isDestroyed && content) {
            let node = editor.current.state.schema.nodeFromJSON(content)
            let tr = editor.current.state.tr.replaceWith(0, editor.current.state.doc.content.size, node)
            editor.current.dispatch(tr)
        }
    }, [content])

    return { target, editor, emitter: eEmitter.current }
}