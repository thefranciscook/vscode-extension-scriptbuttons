import * as vscode from 'vscode';
import { ScriptButton } from './types';

/**
 * Manages script button storage and CRUD operations
 */
export class ButtonManager {
  private static readonly STORAGE_KEY = 'scriptButtons';
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
  }

  /**
   * Load buttons from storage
   */
  private loadButtons(): void {
    const stored = this.context.globalState.get<ScriptButton[]>(ButtonManager.STORAGE_KEY);
    this.buttons = stored || [];
    
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
      this.context.globalState.update(ButtonManager.STORAGE_KEY, this.buttons);
    }
  }

  /**
   * Save buttons to storage
   */
  private async saveButtons(): Promise<void> {
    await this.context.globalState.update(ButtonManager.STORAGE_KEY, this.buttons);
    this._onDidChangeButtons.fire();
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

