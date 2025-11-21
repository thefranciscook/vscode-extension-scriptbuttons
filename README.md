# Script Buttons

A VS Code extension that adds a colorful custom side panel with configurable script buttons for quick command execution.

## Why?

During development, I often need to run Python scripts to update data that my web app uses. It was a pain constantly trying to remember which script to run and where it was located. Now I can just turn them into buttons and use them whenever I need to - no more hunting through files or command history!

## Features

- **Sidebar Integration**: Script buttons appear in the Explorer sidebar alongside Outline and Timeline
- **Colorful Buttons**: Each button gets a random color indicator and emoji for easy visual identification
- **Easy Button Management**: Add, edit, and delete buttons through an intuitive UI
- **Quick Command Execution**: Execute terminal commands with a single click
- **Persistent Configuration**: Button configurations are saved globally across all workspaces
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

