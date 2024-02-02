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
    const target = useRef(null)
    const editor = useRef<EditorView | null>(null)
    const builder = useCallback((dom: HTMLElement) => {
        let { handlerOnChange, ...rest } = config
        rest.plugins = (rest.plugins || []).concat(changed(handlerOnChange))
        const state = EditorState.create(rest)
        console.log(state)
        return new EditorView(dom, { state })
    }, [])

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