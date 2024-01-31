import { DOMConfig } from "../utils/r"
import { Editor } from "./m2editor"

export class Node {
    readonly text: string | undefined
    readonly order: number = 0
    readonly content: Fragment
    constructor(order: number, content?: Fragment | null) {
        this.order = order
        this.content = content || Fragment.Empty
    }

}

export class Fragment {
    static Empty = new Fragment()

}

export interface NodeDescription {
    name: string
    parser: (editor: Editor) => DOMConfig
    toTxt: () => string
}