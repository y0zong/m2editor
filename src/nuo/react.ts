import { EditorState, EditorStateConfig } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { useRef, useLayoutEffect } from "react"
import { changed } from "./plugin/changed"
import "prosemirror-view/style/prosemirror.css"
import "./prosemirror.css"

export interface ProseMirrorConfig extends EditorStateConfig {
    handlerOnChange: (editor: EditorView, pre: EditorState) => void
}
export function useProseMirror(config: ProseMirrorConfig) {
    let editor: EditorView | null = null
    const target = useRef(null)
    let { handlerOnChange, ...rest } = config
    rest.plugins = (rest.plugins || []).concat(changed(handlerOnChange))

    useLayoutEffect(() => {
        console.log(target)
        if (target.current) {
            editor = new EditorView(target.current, {
                state: EditorState.create(rest)
            })
        }
        return () => {
            if (editor) {
                editor.destroy()
            }
        }
    }, [target])

    return { target, editor }
}