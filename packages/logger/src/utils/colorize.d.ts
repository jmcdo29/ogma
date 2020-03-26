/// <reference types="node" />
import { Color } from '../enums';
import { OgmaSimpleType } from '../types';
export declare function colorize(value: OgmaSimpleType, color?: Color, useColor?: boolean, stream?: Partial<NodeJS.WritableStream | NodeJS.WriteStream>): string;
export declare function colorizeCLI(value: OgmaSimpleType, color?: Color, useColor?: boolean): string;
