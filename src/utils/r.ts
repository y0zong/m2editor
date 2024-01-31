enum SVGTag {
    SVG = "svg",
    POLYLINE = "polyline",
    LINE = "line",
    CIRCLE = "circle",
}

export default function r(config: DOMConfig | SVGConfig) {
    let dom
    
    if (["svg", "polyline", "line", "circle"].indexOf(config.tag.toLowerCase()) > -1) {
        dom = document.createElementNS("http://www.w3.org/2000/svg", config.tag[0]) as SVGElement
    } else {
        dom = document.createElement(config.tag) as HTMLElement
    }

    if (config.attr) {
        for (const key in config.attr) {
            if (key.startsWith("on")) {
                dom.addEventListener(key.substring(2), config.attr[key] as EventListenerOrEventListenerObject)
            } else if (config.attr[key]) {
                dom.setAttribute(key, config.attr[key] as string)
            }
        }
    }

    if (config.node) {
        if (Array.isArray(config.node)) {
            for (const key in config.node) {
                dom.appendChild(r(config.node[key]))
            }
            return dom
        }

        if (typeof config.node === "string") {
            dom.appendChild(document.createTextNode(config.node))
            return dom
        }
        dom.appendChild(r(config.node))
    }
    return dom
}

export type Attr = { [attr: string]: string | EventListenerOrEventListenerObject }
export type SVGConfig = { tag: SVGTag, attr?: Attr, node: SVGConfig | Array<SVGConfig> }
export type DOMConfig = { tag: string, attr?: Attr, node?: string | DOMConfig | Array<DOMConfig> }