import * as vscode from 'vscode';
import * as path from 'path';
import { Compiler, CompilerOptions } from './compiler';
import { localize } from './nls';

let outputChannel: vscode.OutputChannel;
let compiler: Compiler;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    // Initialize Output Channel
    outputChannel = vscode.window.createOutputChannel("SCSS to CSS Plus");
    compiler = new Compiler(outputChannel);

    // Initialize StatusBar Item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    context.subscriptions.push(statusBarItem);

    outputChannel.appendLine(localize('extension.active', 'SCSS to CSS Plus extension is now active!'));

    // Register Command
    let disposable = vscode.commands.registerCommand('scssToCssPlus.compile', async (uri: vscode.Uri) => {
        if (!uri && vscode.window.activeTextEditor) {
            uri = vscode.window.activeTextEditor.document.uri;
        }

        if (uri && (uri.fsPath.endsWith('.scss') || uri.fsPath.endsWith('.sass'))) {
            await compileFile(uri);
        } else {
            vscode.window.showInformationMessage(localize('msg.selectFile', 'Please open or select a SCSS/SASS file.'));
        }
    });

    context.subscriptions.push(disposable);

    // Watch for file saves
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(async (document) => {
        const config = vscode.workspace.getConfiguration('scssToCssPlus');
        const autoCompile = config.get<boolean>('autoCompile');

        if (!autoCompile) {
            return;
        }

        if (document.languageId === 'scss' || document.fileName.endsWith('.scss')) {
            const fileName = path.basename(document.fileName);
            // Skip partials (files starting with _)
            if (fileName.startsWith('_')) {
                outputChannel.appendLine(localize('msg.ignorePartial', 'Ignoring partial file: {0}', fileName));
                return;
            }
            await compileFile(document.uri);
        }
    }));
}

async function compileFile(uri: vscode.Uri) {
    const config = vscode.workspace.getConfiguration('scssToCssPlus');

    // Resolve outDir relative to workspace root if it's not absolute and not null
    let outDir = config.get<string | null>('outDir') ?? null;
    if (outDir && !path.isAbsolute(outDir)) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (workspaceFolder) {
            outDir = path.join(workspaceFolder.uri.fsPath, outDir);
        }
    }

    const options: CompilerOptions = {
        outDir: outDir,
        generateSourceMap: config.get<boolean>('generateSourceMap', true),
        minify: config.get<boolean>('minify', true),
        browserslist: config.get<string[]>('browserslist', ['> 1%', 'last 2 versions'])
    };

    try {
        // Show compiling status (Yellow)
        statusBarItem.text = `$(sync~spin) ${localize('status.compiling', 'SCSS Compiling...')}`;
        statusBarItem.color = '#ffff00'; // Yellow
        statusBarItem.show();

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: localize('msg.compiling', "Compiling SCSS..."),
            cancellable: false
        }, async () => {
            await compiler.compile(uri.fsPath, options);
        });

        // Show success status (Green)
        statusBarItem.text = `$(check) ${localize('status.success', 'SCSS Compiled Successfully')}`;
        statusBarItem.color = '#00ff00'; // Green

        // Hide after 3 seconds
        setTimeout(() => {
            statusBarItem.hide();
        }, 3000);

    } catch (error) {
        // Show error status (Red)
        statusBarItem.text = `$(alert) ${localize('status.error', 'SCSS Compilation Failed')}`;
        statusBarItem.color = '#ff0000'; // Red

        // Hide after 5 seconds
        setTimeout(() => {
            statusBarItem.hide();
        }, 5000);

        vscode.window.showErrorMessage(localize('msg.failed', 'SCSS Compilation Failed. Check Output for details.'));
    }
}

export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}

