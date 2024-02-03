import { InputRule, textblockTypeInputRule, wrappingInputRule } from "prosemirror-inputrules";
import { Schema } from "prosemirror-model"
import { addListNodes } from "prosemirror-schema-list"
import * as basic from "prosemirror-schema-basic"
import { keymap } from "prosemirror-keymap"
import { dropCursor } from "prosemirror-dropcursor"
import { gapCursor } from "prosemirror-gapcursor"
import { history } from "prosemirror-history"
import { baseKeymap } from "prosemirror-commands"
import { inputRules, smartQuotes, emDash, ellipsis } from "prosemirror-inputrules"
import { NodeType } from "prosemirror-model";

export function imageRule(nodeType: NodeType) {
    let regexp = /^!\[([\S| ]*)\]\((\S+)\)$/
    return new InputRule(regexp, (state, match, start, end) => {
        const src = match[2]
        const alt = match[1]
        return state.tr.replaceWith(start, end, nodeType.create({ src, alt, title: alt }))
    })
}

/// Given a blockquote node type, returns an input rule that turns `"> "`
/// at the start of a textblock into a blockquote.
export function blockQuoteRule(nodeType: NodeType) {
    return wrappingInputRule(/^\s*>\s$/, nodeType)
}

/// Given a list node type, returns an input rule that turns a number
/// followed by a dot at the start of a textblock into an ordered list.
export function orderedListRule(nodeType: NodeType) {
    return wrappingInputRule(/^(\d+)\.\s$/, nodeType, match => ({ order: +match[1] }),
        (match, node) => node.childCount + node.attrs.order == +match[1])
}

/// Given a list node type, returns an input rule that turns a bullet
/// (dash, plush, or asterisk) at the start of a textblock into a
/// bullet list.
export function bulletListRule(nodeType: NodeType) {
    return wrappingInputRule(/^\s*([-+*])\s$/, nodeType)
}

/// Given a code block node type, returns an input rule that turns a
/// textblock starting with three backticks into a code block.
export function codeBlockRule(nodeType: NodeType) {
    return textblockTypeInputRule(/^```$/, nodeType)
}

/// Given a node type and a maximum level, creates an input rule that
/// turns up to that number of `#` characters followed by a space at
/// the start of a textblock into a heading whose level corresponds to
/// the number of `#` signs.
export function headingRule(nodeType: NodeType, maxLevel: number) {
    return textblockTypeInputRule(new RegExp("^(#{1," + maxLevel + "})\\s$"),
        nodeType, match => ({ level: match[1].length }))
}

// note: basic setup
const schema = new Schema({
    nodes: addListNodes(basic.schema.spec.nodes, "paragraph block*", "block"),
    marks: basic.schema.spec.marks
})

const rules = smartQuotes.concat(ellipsis, emDash)
if (schema.nodes.blockquote) rules.push(blockQuoteRule(schema.nodes.blockquote))
if (schema.nodes.ordered_list) rules.push(orderedListRule(schema.nodes.ordered_list))
if (schema.nodes.bullet_list) rules.push(bulletListRule(schema.nodes.bullet_list))
if (schema.nodes.code_block) rules.push(codeBlockRule(schema.nodes.code_block))
if (schema.nodes.image) rules.push(imageRule(schema.nodes.image))
if (schema.nodes.heading) rules.push(headingRule(schema.nodes.heading, 6))

const plugins = [
    inputRules({ rules }),
    // keymap(buildKeymap(schema, mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor(),
    history()
]

export const basicConfig = {
    schema, plugins
}