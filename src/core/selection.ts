import { Node } from "./node";

export abstract class Selection {
    ranges: readonly Range[] = []
    constructor() {
        
    }

    replace_selection_with(_node: Node, _inherit = true) {

    }
}

export class Range {
    /// Create a range.
    constructor(
      /// The lower bound of the range.
    //   readonly $from: ResolvedPos,
      /// The upper bound of the range.
    //   readonly $to: ResolvedPos
    ) {}
  }