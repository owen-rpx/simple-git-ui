import * as vscode from "vscode";
import { Git } from "../commands/commands";
class GitTreeView implements vscode.TreeDataProvider<vscode.TreeItem> {
  public static readonly viewType = "git-tree-view";
  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | void
  > = this._onDidChangeTreeData.event;
  private root: any = [
    {
      label: "changes",
      contextValue: "changes",
      collapsibleState: vscode.TreeItemCollapsibleState.Expanded,
    },
  ];
  private children: any;
  constructor() {}
  getViewType() {
    return GitTreeView.viewType;
  }
  async init() {
    this.children = await new Git().status();
    return this;
  }
  async refresh() {
    await this.init();
    this._onDidChangeTreeData.fire(undefined);
  }
  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(
    element?: vscode.TreeItem | undefined
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (this.children && !this.children.length) {
      return null;
    }
    if (!element) {
      return Promise.resolve(this.getItem("root"));
    } else {
      return Promise.resolve(this.getItem("child"));
    }
  }

  private async getItem(key: string): Promise<vscode.TreeItem[]> {
    if (key === "root") {
      return Promise.resolve(this.root);
    }
    if (key === "child") {
      let childrenSet = this.children[0].not_added.map((d: any, idx: any) => {
        return {
          label: d,
          collapsibleState: vscode.TreeItemCollapsibleState.None,
          command: {
            title: "Open it",
            command: "vscode.open",
            arguments: [],
          },
        };
      });
      let childrenSet2 = this.children[0].modified.map(
        async (d: any, idx: any) => {
          return {
            label: d,
            contextValue: d,
            collapsibleState: vscode.TreeItemCollapsibleState.None,
            command: {
              title: "Open it",
              command: "vscode.open",
            },
          };
        }
      );
      childrenSet = childrenSet.concat(childrenSet2);
      return Promise.resolve(childrenSet);
    }
    return Promise.resolve([]);
  }
}

//factory model
export async function createGitTreeView() {
  return await new GitTreeView().init();
}
