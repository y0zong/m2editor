import { Editor } from "./m2editor"

export interface Plugin {
    name: string
    onKeyPress: (editor: Editor) => boolean
}