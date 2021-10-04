// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const pidCwd = require('pid-cwd');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

let renameTimeout = null

function activate() {
	async function renameWithDirName() {
		const pid = await vscode.window.activeTerminal.processId
		pidCwd(pid)
			.then(cwd => {
				if(cwd) {
					const folderName = path.basename(cwd)
					vscode.commands.executeCommand('workbench.action.terminal.renameWithArg', { name: folderName })
				}
			});
	}

	if(vscode.window.activeTerminal) {
		renameWithDirName()
	}

	vscode.window.onDidOpenTerminal(() => {
		clearTimeout(renameTimeout)
		renameTimeout = setTimeout(() => {
			renameWithDirName()
		}, 400)
	});
}

// this method is called when your extension is deactivated
function deactivate() {
	clearTimeout(renameTimeout)
	renameTimeout = undefined
}

module.exports = {
	activate,
	deactivate
}
