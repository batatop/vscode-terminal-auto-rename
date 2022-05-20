// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const pidCwd = require('pid-cwd');
const path = require('path');
const debounce = require('debounce');

/**
 * @param {vscode.ExtensionContext} context
 */

let activeTerminal

async function renameWithDirName() {
	const pid = await activeTerminal.processId
	pidCwd(pid)
		.then(cwd => {
			if(cwd) {
				const folderName = path.basename(cwd)
				vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name: folderName })
			}
		});
}

const renameWithDirnameDebounced = debounce(renameWithDirName);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate() {

	if (vscode.window.activeTerminal) {
		activeTerminal = vscode.window.activeTerminal
		renameWithDirnameDebounced()
	}

	vscode.window.onDidChangeActiveTerminal((terminal) => {
		activeTerminal = terminal
		renameWithDirnameDebounced()
	});
}

// this method is called when your extension is deactivated
function deactivate() {
	renameWithDirnameDebounced.clear()
}

module.exports = {
	activate,
	deactivate
}
