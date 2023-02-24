// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Git } from "./commands/commands";
import { FileWatcher } from "./models/fileWatcher";
import { createLogger } from "./models/logger";
import { createGitTreeView } from "./views/gitTreeView";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-simple-git-ui" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const logger = createLogger();
  // vscode.FileDecoration
  const treeViewProvider = await createGitTreeView();
  logger.log("Simple git ui loading...");
  const disposableRefresh = vscode.commands.registerCommand(
    "git-ui.refresh",
    async () => {
      logger.log("refresh");
      treeViewProvider.refresh();
    }
  );
  const disposable = vscode.commands.registerCommand(
    "git-ui.initRepository",
    async () => {
      logger.log("init repos");
      const git = new Git();
      await git.init();
      await vscode.commands.executeCommand("git-ui.refresh");
    }
  );
  const disposableTreeView = vscode.window.registerTreeDataProvider(
    treeViewProvider.getViewType(),
    treeViewProvider
  );

  //watcher disk file status... to fire the tree update.
  new FileWatcher().listener(() => treeViewProvider.refresh());

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposableRefresh);
  context.subscriptions.push(disposableTreeView);
}

// This method is called when your extension is deactivated
export function deactivate() {
  /* TODO document why this function 'deactivate' is empty */
}
