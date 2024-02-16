import { DOMSerializer, Fragment, Schema } from "prosemirror-model"
import { JSDOM } from "jsdom"

export function renderHTML(schema: Schema, fragment: Fragment) {
    const dom = new JSDOM()
    const body = dom.window.document.body
    DOMSerializer.fromSchema(schema).serializeFragment(fragment, { document: dom.window.document }, body)
    return body.innerHTML
}