import { EditorState, EditorStateConfig } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { useRef, useCallback, useEffect } from "react"
import { changed } from "./plugin/changed"
import "prosemirror-view/style/prosemirror.css"
import "./prosemirror.css"

export interface ProseMirrorConfig extends EditorStateConfig {
    handlerOnChange: (editor: EditorView, pre: EditorState) => void
}
export function useProseMirror(config: ProseMirrorConfig) {
    let { handlerOnChange, ...rest } = config
    rest.plugins = (rest.plugins || []).concat(changed(handlerOnChange))
    const target = useRef(null)
    const editor = useRef<EditorView|null>(null)
    const builder = useCallback((dom: HTMLElement|null) => new EditorView(dom, { state: EditorState.create(rest) }), [])

    useEffect(() => {
        if (target.current) {
            editor.current = builder(target.current)
        }
        return () => {
            editor?.current?.destroy()
        }
    }, [target])

    return { target, editor }
}