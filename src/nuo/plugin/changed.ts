import { EditorState, Plugin, PluginKey } from "prosemirror-state"
import { EditorView } from "prosemirror-view"

const changed_key = new PluginKey("changed")
export const changed = (handler: (editor: EditorView, pre: EditorState) => void) => new Plugin({
    key: changed_key,
    view() {
        return {
            update(editor, pre) {
                handler(editor, pre)
            },
        }
    },
})