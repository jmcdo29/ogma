"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const ESC = '\x1B';
function colorize(value, color = enums_1.Color.WHITE, useColor = true, stream = process.stdout) {
    if (stream.hasColors &&
        stream.hasColors() &&
        useColor) {
        value = `${ESC}[3${color}m${value}${ESC}[0m`;
    }
    return value.toString();
}
exports.colorize = colorize;
function colorizeCLI(value, color = enums_1.Color.WHITE, useColor = true) {
    if (useColor) {
        value = `${ESC}[3${color}m${value}${ESC}[0m`;
    }
    return value.toString();
}
exports.colorizeCLI = colorizeCLI;
//# sourceMappingURL=colorize.js.map