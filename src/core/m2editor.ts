import r, { DOMConfig } from "../utils/r";
import { NodeDescription } from "./node";
import * as browser from "./browser"
import { Plugin } from "./plugin";

// note - static
const EditorDOMConfig: DOMConfig = { tag: "div", attr: { contenteditable: "true", translate: "no", tabindex: "0", class: "ëditór", style: "outline:none;" } }

// note - Types
type EditorText = string
type EditorContent = {}
export interface EditorConfig {
    target: HTMLElement
    nodes: NodeDescription[]
    layout?: any
    plugin?: Plugin[]
}

export class InputState {
    lastKey: number | null = null
    isShiftKeyPressed: boolean = false
    lastKeyPressedTime: number = 0
}

// note - Editor Class
export function renderHTML(config: Omit<EditorConfig, "target">) {
    // todo: just render html
    console.log(config)
}

export class Editor {
    readonly config: EditorConfig
    readonly input: InputState
    readonly element: HTMLElement
    readonly command: Array<[string, (editor: Editor) => {}]> = []
    protected content: string | EditorContent = ""

    readonly binding: {[key: string]: any} = {}

    constructor(config: EditorConfig) {
        this.config = Object.assign({ plugin: [] }, config)
        this.input = new InputState()
        this.element = r(EditorDOMConfig) as HTMLElement
        // this.inputInterrupt.bind(this.inputInterrupt)
        this.element.addEventListener("keydown", this.inputInterrupt)

        // On Safari, for reasons beyond my understanding, adding an input
        // event handler makes an issue where the composition vanishes when
        // you press enter go away.
        if (browser.safari) this.element.addEventListener("input", () => null)

        this.config.target.replaceWith(this.element)
        console.log("editor init")
    }

    loadContent(content: EditorContent | EditorText) {
        this.content = content
    }

    // todo: focus on spec line or just focus editor
    focus() { }
    lock() { }

    inputInterrupt = (ev: KeyboardEvent) => {
        // const code = ev.code

        // if (code === "Enter") {
        //     return
        // }

        // if (code === "Escape") {
        //     return
        // }

        this.input.isShiftKeyPressed = ev.keyCode == 16 || ev.shiftKey
        this.input.lastKey = ev.keyCode
        this.input.lastKeyPressedTime = Date.now()

        // Suppress enter key events on Chrome Android, because those tend
        // to be part of a confused sequence of composition events fired,
        // and handling them eagerly tends to corrupt the input.
        if (browser.android && browser.chrome && ev.keyCode == 13) return
        if (ev.keyCode != 229) {

        }

        for (const plugin of this.config.plugin!) {
            if (!plugin.onKeyPress(this)) return
        }

        
    }

    onKeyESC() {

    }
}
