import * as vscode from "vscode";
class Logger {
  private output: vscode.LogOutputChannel;
  private logKEY = "{GIT-UI}";
  constructor() {
    this.output = vscode.window.createOutputChannel("GitUI", { log: true });
  }
  log(...msg: string | undefined | any) {
    this.output.append(`${this.logKEY} ${msg}`);
  }
}

export function createLogger() {
  const logger = new Logger();
  return logger;
}
