"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../enums");
const colorize_1 = require("./colorize");
exports.color = {
    /**
     * Print your text in red. Send in a OgmaSimpleType and the output will be red.
     *
     * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in red
     */
    red: (value) => colorize_1.colorize(value, enums_1.Color.RED),
    /**
     * Print your text in green. Send in a OgmaSimpleType and the output will be green.
     *
     * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in green.
     */
    green: (value) => colorize_1.colorize(value, enums_1.Color.GREEN),
    /**
     * Print your text in yellow. Send in a OgmaSimpleType and the output will be yellow.
     *
     * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in yellow.
     */
    yellow: (value) => colorize_1.colorize(value, enums_1.Color.YELLOW),
    /**
     * Print your text in blue. Send in a OgmaSimpleType and the output will be blue.
     *
     * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in blue.
     */
    blue: (value) => colorize_1.colorize(value, enums_1.Color.BLUE),
    /**
     * Print your text in magenta. Send in a OgmaSimpleType and the output will be magenta.
     *
     * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in magenta.
     */
    magenta: (value) => colorize_1.colorize(value, enums_1.Color.MAGENTA),
    /**
     * Print your text in cyan. Send in a OgmaSimpleType and the output will be cyan.
     *
     * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in cyan.
     */
    cyan: (value) => colorize_1.colorize(value, enums_1.Color.CYAN),
    /**
     * Print your text in white. Send in a OgmaSimpleType and the output will be white.
     *
     * @param {OgmaSimpleType} value the OgmaSimpleType you want to print in white.
     */
    white: (value) => colorize_1.colorize(value, enums_1.Color.WHITE),
};
//# sourceMappingURL=color.js.map