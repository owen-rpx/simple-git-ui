import * as vscode from "vscode";
export class Logger {
  private output: vscode.LogOutputChannel;
  constructor() {
    this.output = vscode.window.createOutputChannel("GitUI", { log: true });
  }
  log(...msg: string | undefined | any) {
    this.output.append("GIT::" + msg);
  }
}
