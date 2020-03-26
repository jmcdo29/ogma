/// <reference types="node" />
import { LogLevel } from '../enums';
export interface OgmaOptions {
    logLevel: keyof typeof LogLevel;
    color: boolean;
    stream: Partial<NodeJS.WritableStream | NodeJS.WriteStream> & Pick<NodeJS.WritableStream, 'write'>;
    json: boolean;
    context: string;
    application: string;
    [index: string]: any;
}
export declare const OgmaDefaults: OgmaOptions;
