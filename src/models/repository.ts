import * as vscode from "vscode";
export class Repository {
  constructor() {}

  getWorkURI() {
    const workSpaces = vscode.workspace.workspaceFolders;
    if (workSpaces) {
      const repoFs: vscode.Uri = workSpaces[0].uri;
      return repoFs;
    }
    return undefined;
  }
}
