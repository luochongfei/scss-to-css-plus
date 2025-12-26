import * as path from 'path';
import * as fs from 'fs-extra';
import * as sass from 'sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import * as vscode from 'vscode';
import { localize } from './nls';

// Fix: postcss-sort-media-queries is a CommonJS module, so we need to require it.
// Attempt to use import, but fallback to require if needed for type safety in TS.
const sortMediaQueries = require('postcss-sort-media-queries');

export interface CompilerOptions {
    outDir: string | null;
    generateSourceMap: boolean;
    minify: boolean;
    browserslist?: string[];
    targetPath?: string; // The file being compiled
}

export class Compiler {
    private outputChannel: vscode.LogOutputChannel;

    constructor(outputChannel: vscode.LogOutputChannel) {
        this.outputChannel = outputChannel;
    }

    private log(message: string) {
        // LogOutputChannel manages timestamps automatically
        this.outputChannel.info(message);
    }

    public async compile(filePath: string, options: CompilerOptions): Promise<void> {
        try {
            this.log(localize('compiler.compiling', 'Compiling: {0}', filePath));

            // 1. Compile Sass
            const result = await sass.compileAsync(filePath, {
                sourceMap: options.generateSourceMap,
                sourceMapIncludeSources: true,
                style: 'expanded' // We'll minify later with cssnano
            });

            let css = result.css;
            let map = result.sourceMap;

            // 2. Prepare PostCSS plugins
            const plugins: any[] = [
                // Merge and sort media queries BEFORE autoprefixer and cssnano
                sortMediaQueries({
                    sort: 'mobile-first' // Default to mobile-first sorting
                }),
                autoprefixer({
                    overrideBrowserslist: options.browserslist,
                    ignoreUnknownVersions: true
                })
            ];

            if (options.minify) {
                plugins.push(cssnano({
                    preset: 'default',
                }));
            }

            // 3. PostCSS Processing
            const postcssOptions: any = {
                from: filePath,
                map: options.generateSourceMap ? {
                    inline: false,
                    prev: map,
                    annotation: true
                } : false
            };

            // Determine output path
            const outputDir = options.outDir
                ? (path.isAbsolute(options.outDir) ? options.outDir : path.join(path.dirname(filePath), options.outDir))
                : path.dirname(filePath);

            const fileName = path.basename(filePath, path.extname(filePath)) + '.css';
            const outputPath = path.join(outputDir, fileName);

            postcssOptions.to = outputPath;

            const postcssResult = await postcss(plugins).process(css, postcssOptions);

            // 4. Write Output
            await fs.ensureDir(outputDir);
            await fs.writeFile(outputPath, postcssResult.css);

            if (postcssResult.map) {
                await fs.writeFile(outputPath + '.map', postcssResult.map.toString());
            }

            this.log(localize('compiler.success', 'Successfully compiled to: {0}', outputPath));

        } catch (error: any) {
            const errorMessage = localize('compiler.error', 'Error compiling {0}: {1}', filePath, error.message || error);
            // Use error() to make it red in the log output
            this.outputChannel.error(errorMessage);

            if (error.formatted) {
                 this.outputChannel.error(error.formatted);
            }
            throw error;
        }
    }
}


