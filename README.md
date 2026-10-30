# Behat in Docker (Localized) Extension for VS Code

This fork adds localized Gherkin discovery and safer defaults for repositories
that contain nested Git worktrees.

Run Behat tests inside Docker containers directly from VS Code's Test Explorer UI.

## Features

- 🐳 Execute Behat tests in Docker containers
- 🔍 Automatic feature discovery based on glob file patterns
- ▶️ Run tests at multiple levels (feature file, scenario)
- 🐛 Debug support with Xdebug integration
- 📋 Rich error reporting with source locations
- 📂 Configurable container paths and Behat executable locations
- 🌐 English and Russian Gherkin keywords (`Feature`/`Функция`, `Scenario`/`Сценарий`)
- 🌳 Nested worktree and dependency directories excluded from discovery by default

## Installation

1. Build a VSIX with `npx @vscode/vsce package` and install it with
   `code --install-extension <file>.vsix`.
2. Ensure your Docker container is running with your PHP project mounted
3. Configure the extension settings (see below)

## Configuration

Open VS Code settings (Ctrl+,) and configure under **Behat in Docker**:

- `behatDocker.containerName`: **Required**  
  Your Docker container name (e.g. `my-php-container`)
- `behatDocker.containerPath`: Path inside the container where the project is mounted  
  (Default: `/var/www`)
- `behatDocker.projectPath`: Project folder relative to the workspace root, the one mounted at `containerPath`  
  (Default: empty, the workspace root is the project)
- `behatDocker.behatPath`: Path to the Behat executable relative to the project root  
  (Default: `vendor/bin/behat`)
- `behatDocker.testFilePattern`: Glob pattern for feature files  
  (Default: `**/*.feature`)
- `behatDocker.testFileExcludePatterns`: Glob patterns excluded from discovery
  (Defaults exclude dependencies, Git metadata, and nested worktrees)

## Usage

1. Open the Test Explorer (View → Testing)
2. Feature files and scenarios will automatically be discovered from your project
3. Use the run/debug icons next to:
   - Individual scenarios (within a feature file)
   - Entire feature files

## Debugging Tests

1. Ensure Xdebug is configured in your Docker container
2. Set breakpoints in your feature files or supporting code
3. Use the "Debug" profile from the Test Explorer
4. VS Code will automatically attach to the debugger
