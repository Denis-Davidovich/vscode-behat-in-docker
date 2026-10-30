import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	useInstallation: process.env.VSCODE_TEST_EXECUTABLE_PATH
		? { fromPath: process.env.VSCODE_TEST_EXECUTABLE_PATH }
		: undefined,
	download: {
		timeout: 120_000,
	},
	// In a nested checkout, such as a worktree, the default .vscode-test/user-data puts the
	// IPC socket past the 103 character limit, and VS Code exits at startup.
	launchArgs: [`--user-data-dir=${mkdtempSync(join(tmpdir(), 'behat-docker-test-'))}`],
});
