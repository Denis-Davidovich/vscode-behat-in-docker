import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	useInstallation: process.env.VSCODE_TEST_EXECUTABLE_PATH
		? { fromPath: process.env.VSCODE_TEST_EXECUTABLE_PATH }
		: undefined,
	download: {
		timeout: 120_000,
	},
});
