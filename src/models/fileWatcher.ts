/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from "vscode";
import { createLogger } from "./logger";
enum FileAction {
  CREATE,
  CHANGE,
  DELETE,
}
export class FileWatcher {
  watcher: vscode.FileSystemWatcher | undefined;
  ignore = [
    ".git/index",
    ".git/HEAD",
    ".git/config",
    ".git/hooks",
    ".git/info",
    ".git/refs",
    ".git/description",
  ];
  constructor() {
    const folder: vscode.WorkspaceFolder | undefined =
      vscode.workspace.workspaceFolders?.[0];
    if (folder) {
      this.watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(folder, "**"),
        false,
        false,
        false
      );
    } else {
      this.watcher = undefined;
    }
  }
  private _checkIgnore(path: string) {
    let isIgnore = this.ignore.some((ign) => path.includes(ign));
    return isIgnore;
  }
  private _listener(callback: Function, path: string, action: FileAction) {
    const logger = createLogger();
    if (!this._checkIgnore(path)) {
      logger.log(FileAction[action], path);
      callback();
    }
  }
  listener(callback: Function) {
    if (this.watcher) {
      this.watcher.onDidCreate((e: vscode.Uri) => {
        this._listener(callback, e.path, FileAction.CREATE);
      });
      this.watcher.onDidChange((e: vscode.Uri) => {
        this._listener(callback, e.path, FileAction.CHANGE);
      });
      this.watcher.onDidDelete((e: vscode.Uri) => {
        this._listener(callback, e.path, FileAction.DELETE);
      });
    }
  }
}
