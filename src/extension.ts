import * as vscode from 'vscode';
import { ButtonManager } from './buttonManager';
import { ButtonTreeProvider, ButtonTreeItem } from './buttonTreeProvider';
import { ScriptButton } from './types';

let terminal: vscode.Terminal | undefined;

/**
 * Activate the extension
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('Script Buttons extension is now active');

  // Initialize button manager
  const buttonManager = new ButtonManager(context);

  // Initialize tree view provider
  const treeProvider = new ButtonTreeProvider(buttonManager);
  const treeView = vscode.window.createTreeView('scriptButtons', {
    treeDataProvider: treeProvider,
    showCollapseAll: false
  });

  // Register commands
  context.subscriptions.push(
    // Add button command
    vscode.commands.registerCommand('scriptButtons.addButton', async () => {
      await addButton(buttonManager);
    }),

    // Edit button command
    vscode.commands.registerCommand('scriptButtons.editButton', async (item: ButtonTreeItem) => {
      await editButton(buttonManager, item.button);
    }),

    // Delete button command
    vscode.commands.registerCommand('scriptButtons.deleteButton', async (item: ButtonTreeItem) => {
      await deleteButton(buttonManager, item.button);
    }),

    // Execute button command
    vscode.commands.registerCommand('scriptButtons.executeButton', async (button: ScriptButton) => {
      await executeButton(button);
    }),

    // Refresh command
    vscode.commands.registerCommand('scriptButtons.refresh', () => {
      treeProvider.refresh();
    }),

    // Register disposables
    treeView,
    buttonManager,
    treeProvider
  );

  // Clean up terminal when it's closed
  context.subscriptions.push(
    vscode.window.onDidCloseTerminal((closedTerminal) => {
      if (terminal === closedTerminal) {
        terminal = undefined;
      }
    })
  );
}

/**
 * Add a new button
 */
async function addButton(buttonManager: ButtonManager): Promise<void> {
  // Get label from user
  const label = await vscode.window.showInputBox({
    prompt: 'Enter a label for the button',
    placeHolder: 'e.g., Run Python Script',
    validateInput: (value) => {
      return value.trim() ? null : 'Label cannot be empty';
    }
  });

  if (!label) {
    return; // User cancelled
  }

  // Get command from user
  const command = await vscode.window.showInputBox({
    prompt: 'Enter the command to execute',
    placeHolder: 'e.g., python script.py',
    validateInput: (value) => {
      return value.trim() ? null : 'Command cannot be empty';
    }
  });

  if (!command) {
    return; // User cancelled
  }

  // Add the button
  await buttonManager.addButton(label.trim(), command.trim());
  vscode.window.showInformationMessage(`Button "${label}" added successfully`);
}

/**
 * Edit an existing button
 */
async function editButton(buttonManager: ButtonManager, button: ScriptButton): Promise<void> {
  // Get new label from user
  const label = await vscode.window.showInputBox({
    prompt: 'Enter a new label for the button',
    value: button.label,
    validateInput: (value) => {
      return value.trim() ? null : 'Label cannot be empty';
    }
  });

  if (!label) {
    return; // User cancelled
  }

  // Get new command from user
  const command = await vscode.window.showInputBox({
    prompt: 'Enter the new command to execute',
    value: button.command,
    validateInput: (value) => {
      return value.trim() ? null : 'Command cannot be empty';
    }
  });

  if (!command) {
    return; // User cancelled
  }

  // Update the button
  const success = await buttonManager.updateButton(button.id, label.trim(), command.trim());
  if (success) {
    vscode.window.showInformationMessage(`Button "${label}" updated successfully`);
  } else {
    vscode.window.showErrorMessage('Failed to update button');
  }
}

/**
 * Delete a button
 */
async function deleteButton(buttonManager: ButtonManager, button: ScriptButton): Promise<void> {
  // Confirm deletion
  const confirmation = await vscode.window.showWarningMessage(
    `Are you sure you want to delete "${button.label}"?`,
    { modal: true },
    'Delete'
  );

  if (confirmation !== 'Delete') {
    return; // User cancelled
  }

  // Delete the button
  const success = await buttonManager.deleteButton(button.id);
  if (success) {
    vscode.window.showInformationMessage(`Button "${button.label}" deleted successfully`);
  } else {
    vscode.window.showErrorMessage('Failed to delete button');
  }
}

/**
 * Execute a button's command
 */
async function executeButton(button: ScriptButton): Promise<void> {
  try {
    // Get or create terminal
    if (!terminal || terminal.exitStatus !== undefined) {
      terminal = vscode.window.createTerminal('Script Buttons');
    }

    // Show terminal and execute command
    terminal.show();
    terminal.sendText(button.command);

    vscode.window.showInformationMessage(`Executing: ${button.label}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to execute command: ${error}`);
  }
}

/**
 * Deactivate the extension
 */
export function deactivate() {
  if (terminal) {
    terminal.dispose();
  }
}

