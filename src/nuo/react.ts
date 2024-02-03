import { EditorState, EditorStateConfig } from "prosemirror-state"
import { DirectEditorProps, EditorView } from "prosemirror-view"
import { useRef, useEffect } from "react"
import { changed } from "./plugin/changed"
import "prosemirror-view/style/prosemirror.css"
import "./prosemirror.css"

export interface ProseMirrorConfig extends Omit<DirectEditorProps, "state">, EditorStateConfig {
    handlerOnChange: (editor: EditorView, pre: EditorState) => void
}
export function useProseMirror(config: ProseMirrorConfig, content: object, deps?: React.DependencyList) {
    const target = useRef(null)
    const editor = useRef<EditorView | null>(null)

    useEffect(() => {
        if (editor.current) {
            let plugins = editor.current.state.plugins.slice() || []
            plugins[0] = changed(config.handlerOnChange)
            editor.current.updateState(editor.current?.state.reconfigure({ plugins }))
        }
    }, deps)

    useEffect(() => {
        if (target.current) {
            let { plugins, schema, storedMarks, selection, doc, handlerOnChange, ...props } = config
            plugins = [changed(handlerOnChange)].concat(plugins || [])
            const state = EditorState.create({ plugins, schema, storedMarks, selection, doc })
            editor.current = new EditorView(target.current, { state, ...props })
        }
        return () => {
            editor?.current?.destroy()
        }
    }, [target])

    useEffect(() => {
        if (editor.current && content) {
            let node = editor.current.state.schema.nodeFromJSON(content)
            let tr = editor.current.state.tr.replaceWith(0, editor.current.state.doc.content.size, node)
            editor.current.dispatch(tr)
        }
    }, [content])

    return { target, editor }
}