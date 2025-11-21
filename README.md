# Script Buttons

A VS Code extension that adds a custom side panel with configurable script buttons for quick command execution.

## Features

- **Custom Side Panel**: Access script buttons from a dedicated panel in the Activity Bar
- **Easy Button Management**: Add, edit, and delete buttons through an intuitive UI
- **Quick Command Execution**: Execute terminal commands with a single click
- **Persistent Configuration**: Button configurations are saved globally across all workspaces

## Usage

### Adding a Button

1. Click the **+** icon in the Script Buttons panel title bar
2. Enter a label for your button (e.g., "Run Python Script")
3. Enter the command to execute (e.g., "python script.py")
4. The button will appear in the panel

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

### From Source

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Press F5 in VS Code to open a new window with the extension loaded

### From VSIX

1. Package the extension: `vsce package`
2. Install the `.vsix` file in VS Code

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

## License

MIT

