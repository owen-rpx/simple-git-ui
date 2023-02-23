import * as vscode from "vscode";
export class FileWatcher {
  watcher: any;
  constructor() {
    const folder: any = vscode.workspace.workspaceFolders?.[0];
    this.watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(folder, "*")
    );
  }
  listener(callback: any) {
    this.watcher.onDidCreate((e: any) => {
      callback();
    });
    this.watcher.onDidChange((e: any) => {
      callback();
    });
    this.watcher.onDidDelete((e: any) => {
      callback();
    });
  }
}
