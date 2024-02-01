import { Attrs, NodeType } from "prosemirror-model"
import { Plugin, PluginKey } from "prosemirror-state"
import { Schema, Node } from 'prosemirror-model';

export type Template = Array<[number, NodeType, Attrs?]>

const layout_key = new PluginKey("layout")
export const layout = (template: Template) => new Plugin({
    key: layout_key,
    view() {
        return {
            update(view) {
                template.map(([line, type, attrs]) => {
                    let child = view.state.doc.content.maybeChild(line)
                    if (child?.type === type) return view.state

                    let pos = child!.resolve(line)
                    if (child!.isText || child!.isTextblock) {
                        let start = pos.start(0)
                        let end = start + (child?.nodeSize || 0)
                        view.dispatch(view.state.tr.replaceWith(start, end, type.create(attrs, child!.textContent ? view.state.schema.text(child!.textContent) : null)))
                    } else {
                        view.dispatch(view.state.tr.insert(line, type.create(attrs, null)))
                    }
                })
            },
        }
    },
})

const default_doc = { type: "doc", content: [] }
export const layout_doc = (template: Template, schema: Schema, json?: any | null) => {
    let doc = json || default_doc
    template.map(([line, type, attrs]) => {
        doc.content[line] = { type: type.name, content: [], attrs }
    })
    return Node.fromJSON(schema, doc)
}