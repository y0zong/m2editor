import { NodeDescription } from "./node"

export class Text {
    readonly txt: string = ""
    readonly content: TextDescription
    constructor(content: TextDescription) {
        this.content = content
    }
}

export interface TextDescription {
    format: Format
    txt: string
    children: Array<TextDescription>
}

export class Format {
    constructor() {

    }
}

export const Paragraph: NodeDescription = {
    name: "paragraph",
    parser: () => ({ tag: "p" }),
    toTxt: () => ""
}