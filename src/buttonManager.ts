import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ScriptButton } from './types';

/**
 * Manages script button storage and CRUD operations
 */
export class ButtonManager {
  private static readonly CONFIG_DIR = '.vscode';
  private static readonly CONFIG_FILE = 'scriptbuttons.json';
  private buttons: ScriptButton[] = [];
  private context: vscode.ExtensionContext;
  private _onDidChangeButtons = new vscode.EventEmitter<void>();
  
  /** Event fired when buttons change */
  public readonly onDidChangeButtons = this._onDidChangeButtons.event;

  /** Available emojis for buttons */
  private static readonly EMOJIS = [
    '🚀', '⚡', '🔥', '✨', '🎯', '🎨', '🔨', '⚙️', '🛠️', '📦',
    '🎉', '💡', '🌟', '🎪', '🎭', '🎮', '🎲', '🎸', '🎺', '🎼',
    '🏃', '🚴', '🏋️', '🤸', '🧘', '🕺', '💃', '🧗', '🏊', '🚣',
    '🌈', '🌸', '🌺', '🌻', '🌼', '🌷', '🌹', '🍀', '🌿', '🍃',
    '⭐', '🌙', '☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️'
  ];

  /** Available colors for buttons */
  private static readonly COLORS = [
    'charts.red', 'charts.blue', 'charts.green', 'charts.yellow',
    'charts.orange', 'charts.purple', 'terminal.ansiCyan',
    'terminal.ansiMagenta', 'terminal.ansiGreen', 'terminal.ansiYellow'
  ];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.loadButtons();
    this.setupFileWatcher();
  }

  /**
   * Setup file watcher to reload buttons when file changes
   */
  private setupFileWatcher(): void {
    const configPath = this.getConfigPath();
    if (!configPath) {
      return;
    }

    // Watch for changes to the config file
    const watcher = vscode.workspace.createFileSystemWatcher(configPath);
    
    watcher.onDidChange(() => {
      this.loadButtons();
      this._onDidChangeButtons.fire();
    });
    
    watcher.onDidCreate(() => {
      this.loadButtons();
      this._onDidChangeButtons.fire();
    });
    
    watcher.onDidDelete(() => {
      this.buttons = [];
      this._onDidChangeButtons.fire();
    });

    this.context.subscriptions.push(watcher);
  }

  /**
   * Get the path to the config file
   */
  private getConfigPath(): string | null {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return null;
    }
    return path.join(workspaceFolder.uri.fsPath, ButtonManager.CONFIG_DIR, ButtonManager.CONFIG_FILE);
  }

  /**
   * Ensure the .vscode directory exists
   */
  private ensureConfigDir(): string | null {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      return null;
    }
    
    const configDir = path.join(workspaceFolder.uri.fsPath, ButtonManager.CONFIG_DIR);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    return configDir;
  }

  /**
   * Load buttons from storage
   */
  private loadButtons(): void {
    const configPath = this.getConfigPath();
    if (!configPath) {
      this.buttons = [];
      return;
    }

    try {
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf8');
        const data = JSON.parse(content);
        this.buttons = data.buttons || [];
        
        // Migrate old buttons without emoji/color
        let needsSave = false;
        this.buttons = this.buttons.map(button => {
          if (!button.emoji || !button.color) {
            needsSave = true;
            return {
              ...button,
              emoji: button.emoji || this.getRandomEmoji(),
              color: button.color || this.getRandomColor()
            };
          }
          return button;
        });
        
        if (needsSave) {
          this.saveButtonsSync();
        }
      } else {
        this.buttons = [];
      }
    } catch (error) {
      console.error('Error loading script buttons:', error);
      vscode.window.showErrorMessage('Failed to load script buttons configuration');
      this.buttons = [];
    }
  }

  /**
   * Save buttons to storage (synchronous)
   */
  private saveButtonsSync(): void {
    const configPath = this.getConfigPath();
    if (!configPath) {
      vscode.window.showWarningMessage('No workspace folder open. Cannot save script buttons.');
      return;
    }

    try {
      this.ensureConfigDir();
      const data = {
        buttons: this.buttons
      };
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving script buttons:', error);
      vscode.window.showErrorMessage('Failed to save script buttons configuration');
    }
  }

  /**
   * Save buttons to storage
   */
  private async saveButtons(): Promise<void> {
    const configPath = this.getConfigPath();
    if (!configPath) {
      vscode.window.showWarningMessage('No workspace folder open. Cannot save script buttons.');
      return;
    }

    try {
      this.ensureConfigDir();
      const data = {
        buttons: this.buttons
      };
      await fs.promises.writeFile(configPath, JSON.stringify(data, null, 2), 'utf8');
      this._onDidChangeButtons.fire();
    } catch (error) {
      console.error('Error saving script buttons:', error);
      vscode.window.showErrorMessage('Failed to save script buttons configuration');
    }
  }

  /**
   * Get all buttons
   */
  public getButtons(): ScriptButton[] {
    return [...this.buttons];
  }

  /**
   * Get a button by ID
   */
  public getButton(id: string): ScriptButton | undefined {
    return this.buttons.find(b => b.id === id);
  }

  /**
   * Add a new button
   */
  public async addButton(label: string, command: string): Promise<ScriptButton> {
    const button: ScriptButton = {
      id: this.generateId(),
      label,
      command,
      emoji: this.getRandomEmoji(),
      color: this.getRandomColor()
    };
    this.buttons.push(button);
    await this.saveButtons();
    return button;
  }

  /**
   * Update an existing button
   */
  public async updateButton(id: string, label: string, command: string): Promise<boolean> {
    const index = this.buttons.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }
    // Keep the existing emoji and color
    const existingButton = this.buttons[index];
    this.buttons[index] = { 
      id, 
      label, 
      command,
      emoji: existingButton.emoji,
      color: existingButton.color
    };
    await this.saveButtons();
    return true;
  }

  /**
   * Delete a button
   */
  public async deleteButton(id: string): Promise<boolean> {
    const index = this.buttons.findIndex(b => b.id === id);
    if (index === -1) {
      return false;
    }
    this.buttons.splice(index, 1);
    await this.saveButtons();
    return true;
  }

  /**
   * Generate a unique ID for a button
   */
  private generateId(): string {
    return `button-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get a random emoji
   */
  private getRandomEmoji(): string {
    return ButtonManager.EMOJIS[Math.floor(Math.random() * ButtonManager.EMOJIS.length)];
  }

  /**
   * Get a random color
   */
  private getRandomColor(): string {
    return ButtonManager.COLORS[Math.floor(Math.random() * ButtonManager.COLORS.length)];
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    this._onDidChangeButtons.dispose();
  }
}

