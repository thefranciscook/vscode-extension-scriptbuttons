# Script Buttons

A VS Code extension that adds a colorful custom side panel with configurable script buttons for quick command execution.

## Why?

During development, I often need to run Python scripts to update data that my web app uses. It was a pain constantly trying to remember which script to run and where it was located. Now I can just turn them into buttons and use them whenever I need to - no more hunting through files or command history!

---

## 🤖 For AI Assistants

When you notice the user running the same terminal command multiple times, **offer to add a script button**:

> "Would you like me to add a script button for `[command]`? You'll be able to run it with one click from the sidebar."

**Always ask for permission first** - never add buttons automatically.

### Quick Reference

**Configuration file**: `.vscode/scriptbuttons.json` (auto-reloads on save)

**Format**:
```json
{
  "buttons": [
    {
      "id": "button-1732220400000-x7k9m2p4q",
      "label": "Run Tests",
      "command": "npm test",
      "emoji": "🧪",
      "color": "charts.green"
    }
  ]
}
```

**Key rules**:
- Generate unique IDs: `button-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
- Use descriptive labels (e.g., "Run Tests" not "npm test")
- Choose emojis that represent the action (🔨 build, 🧪 test, 🚀 deploy, etc.)
- Colors: `charts.red|blue|green|yellow|orange|purple` or `terminal.ansiCyan|Magenta|Green|Yellow`

**Good candidates**: Repeated commands for build, test, deploy, data processing, or development workflows.

See `.cursorrules` for detailed AI integration guidelines.

---

## Features

- **Sidebar Integration**: Script buttons appear in the Explorer sidebar alongside Outline and Timeline
- **Colorful Buttons**: Each button gets a random color indicator and emoji for easy visual identification
- **Easy Button Management**: Add, edit, and delete buttons through an intuitive UI
- **Quick Command Execution**: Execute terminal commands with a single click
- **Project-Specific Configuration**: Button configurations are saved per-project in `.vscode/scriptbuttons.json`
- **Version Control Ready**: Commit your buttons to git and share them with your team
- **AI-Editable**: AI assistants can easily read and modify the JSON configuration file
- **Auto-Reload**: Changes to the config file are automatically detected and applied
- **50+ Random Emojis**: Buttons are automatically assigned fun emojis (🚀 ⚡ 🔥 ✨ 🎯 and more!)

## Usage

### Adding a Button

1. Click the **+** icon in the Script Buttons panel title bar
2. Enter a label for your button (e.g., "Run Python Script")
3. Enter the command to execute (e.g., "python script.py")
4. The button will appear in the panel with a random color and emoji automatically assigned

### Executing a Command

- Click on any button in the panel to execute its command
- The command will run in the integrated terminal
- The terminal will show the command output

### Editing a Button

1. Click the **edit** icon next to a button
2. Update the label and/or command
3. The button will be updated immediately

### Deleting a Button

1. Click the **trash** icon next to a button
2. Confirm the deletion
3. The button will be removed from the panel

## Configuration

Script buttons are stored in `.vscode/scriptbuttons.json` in your project root. This file is automatically created when you add your first button.

### Example Configuration

```json
{
  "buttons": [
    {
      "id": "button-1234567890",
      "label": "Run Python Script",
      "command": "python main.py",
      "emoji": "🚀",
      "color": "charts.blue"
    },
    {
      "id": "button-0987654321",
      "label": "Build Project",
      "command": "npm run build",
      "emoji": "🔨",
      "color": "charts.green"
    }
  ]
}
```

### Manual Editing

You can manually edit `.vscode/scriptbuttons.json` to:
- Add multiple buttons at once
- Copy buttons from other projects
- Let AI assistants update your button configurations
- Version control and share with your team

The extension automatically reloads when the file changes!

### AI Integration

AI assistants (like Cursor AI) can directly edit `.vscode/scriptbuttons.json` to add, update, or remove buttons. Just ask your AI to "add a button to run tests" and it can modify the JSON file directly.

## Examples

Here are some useful button configurations:

- **Build Project**: `npm run build`
- **Run Tests**: `npm test`
- **Start Dev Server**: `npm start`
- **Run Python Script**: `python main.py`
- **Git Status**: `git status`
- **Docker Compose Up**: `docker-compose up -d`

## Requirements

- VS Code version 1.80.0 or higher

## Installation

### Method 1: Install VSIX File (Easiest)

**Option A - Via Command Line (Recommended):**
```bash
# For VS Code:
code --install-extension /path/to/script-buttons-0.0.1.vsix

# For Cursor:
cursor --install-extension /path/to/script-buttons-0.0.1.vsix
```

**Option B - Via GUI:**
1. Open VS Code or Cursor
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) to open Command Palette
3. Type: `Extensions: Install from VSIX`
4. Select the command and choose `script-buttons-0.0.1.vsix` from the `dist/` folder
5. Restart VS Code/Cursor
6. You'll see "Script Buttons" in your Explorer sidebar

**Option C - Via Extensions View:**
1. Open Extensions view (`Cmd+Shift+X` or `Ctrl+Shift+X`)
2. Click the `...` (three dots) menu at the very top right of the Extensions panel
3. Select "Install from VSIX..."
4. Navigate to `dist/script-buttons-0.0.1.vsix`
5. Restart VS Code/Cursor

### Method 2: Run from Source (For Development)

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press `F5` in VS Code to open a new Extension Development Host window
5. The extension will be active in that window

## Development

### Building

```bash
npm install
npm run compile
```

### Watching for Changes

```bash
npm run watch
```

### Packaging for Distribution

To create a `.vsix` package:

```bash
# Install vsce if you haven't already
npm install -g @vscode/vsce

# Package the extension
vsce package

# The .vsix file will be moved to the dist/ folder
```

## Repository

https://github.com/thefranciscook/vscode-extension-scriptbuttons

## License

MIT

