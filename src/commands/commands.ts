import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git";
import { Repository } from "../models/repository";
import * as vscode from "vscode";

export class Git {
  private git: SimpleGit;
  constructor(_repos?: any) {
    const repos = _repos || new Repository();
    const options: Partial<SimpleGitOptions> = {
      baseDir: repos.getWorkURI()?.fsPath,
      binary: "git",
      maxConcurrentProcesses: 6,
      trimmed: false,
    };
    this.git = simpleGit(options);
  }
  async init() {
    return await this.git.init();
  }
  async isRepo() {
    return await this.git.checkIsRepo();
  }
  async status() {
    let isRepo = await this.isRepo();
    console.log("isRepo", isRepo);
    if (isRepo) {
      let stas = await this.git.status();
      return [stas];
    } else {
      return [];
    }
  }
  async config() {
    // let cfg = await this._git.getConfig("user.name", "local");
    // console.log(cfg);
    console.log(await this.git.grep("package.json"));
    let branchs = await this.git.branch();
    console.log(branchs);
    let cfg = await this.git.listConfig("local");
    // console.log(cfg);
    // let res = await this._git.raw("config", ["--list"]);
    // console.log(res);
    // this._git.
    // toGitUri();
    const config = vscode.workspace.getConfiguration("git", null);
    console.log(config.get("path"));
  }
}
