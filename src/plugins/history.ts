import { Plugin } from "../core/plugin";

export const history: Plugin = {
    name: "history",
    onKeyPress: function (editor) {
        console.log("key press", editor)
        return false
    }
}