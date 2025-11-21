import * as vscode from 'vscode';
import { ScriptButton } from './types';
import { ButtonManager } from './buttonManager';

/**
 * Tree item for a script button
 */
export class ButtonTreeItem extends vscode.TreeItem {
  constructor(
    public readonly button: ScriptButton,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    // Add emoji to the label
    super(`${button.emoji} ${button.label}`, collapsibleState);
    
    this.tooltip = `${button.emoji} ${button.label}\nCommand: ${button.command}`;
    this.description = button.command;
    this.contextValue = 'scriptButton';
    
    // Make the button clickable to execute the command
    this.command = {
      command: 'scriptButtons.executeButton',
      title: 'Execute Command',
      arguments: [button]
    };
    
    // Use a colored circle icon for visual distinction
    this.iconPath = new vscode.ThemeIcon(
      'circle-filled',
      new vscode.ThemeColor(button.color)
    );
  }
}

/**
 * Tree data provider for script buttons
 */
export class ButtonTreeProvider implements vscode.TreeDataProvider<ButtonTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<ButtonTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private buttonManager: ButtonManager) {
    // Refresh the tree when buttons change
    this.buttonManager.onDidChangeButtons(() => {
      this.refresh();
    });
  }

  /**
   * Refresh the tree view
   */
  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Get tree item
   */
  public getTreeItem(element: ButtonTreeItem): vscode.TreeItem {
    return element;
  }

  /**
   * Get children (buttons)
   */
  public getChildren(element?: ButtonTreeItem): Thenable<ButtonTreeItem[]> {
    if (element) {
      // Buttons have no children
      return Promise.resolve([]);
    }

    const buttons = this.buttonManager.getButtons();
    
    if (buttons.length === 0) {
      // Return empty array if no buttons
      return Promise.resolve([]);
    }

    const items = buttons.map(button => 
      new ButtonTreeItem(button, vscode.TreeItemCollapsibleState.None)
    );

    return Promise.resolve(items);
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    this._onDidChangeTreeData.dispose();
  }
}

