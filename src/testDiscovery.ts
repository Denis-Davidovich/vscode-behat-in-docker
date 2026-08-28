import * as vscode from 'vscode';
import * as path from 'path';
import { minimatch } from 'minimatch';
import { TestFileParser } from './testFileParser';

const DEFAULT_EXCLUDE_PATTERNS = [
    '**/vendor/**',
    '**/node_modules/**',
    '**/.git/**',
    '**/.worktrees/**',
    '**/worktrees/**'
];

export class TestDiscovery {
    private testFileParser: TestFileParser;

    constructor(
        private testController: vscode.TestController,
        private outputChannel: vscode.OutputChannel
    ) {
        this.testFileParser = new TestFileParser(outputChannel, testController);
    }

    public async discoverAllTests() {
        this.outputChannel.appendLine('Starting test discovery');
        const config = vscode.workspace.getConfiguration('behatDocker');
        const pattern = config.get<string>('testFilePattern') || '**/*.feature';
        const excludePatterns = this.getExcludePatterns();
        
        this.outputChannel.appendLine(`Using test file pattern: ${pattern}`);
        this.outputChannel.appendLine(`Excluding files that match: ${excludePatterns.join(', ')}`);
        
        this.testController.items.replace([]);
        
        const excludePattern = excludePatterns.length === 1
            ? excludePatterns[0]
            : `{${excludePatterns.join(',')}}`;
        const files = await vscode.workspace.findFiles(pattern, excludePattern);
        this.outputChannel.appendLine(`Found ${files.length} feature files`);
        
        for (const file of files) {
            await this.addTestForFile(file);
        }
    }

    public async resolveTestMethods(testItem: vscode.TestItem) {
        await this.testFileParser.parseTestFile(testItem);
    }

    public async addTestForFile(uri: vscode.Uri): Promise<void> {
        if (this.isExcluded(uri)) {
            this.outputChannel.appendLine(`Skipping excluded feature file: ${uri.fsPath}`);
            return;
        }

        this.outputChannel.appendLine(`Adding feature file: ${uri.fsPath}`);
        const testItem = this.testController.createTestItem(
            uri.fsPath,
            path.basename(uri.fsPath),
            uri
        );
        testItem.canResolveChildren = true;
        this.testController.items.add(testItem);
        await this.resolveTestMethods(testItem);
    }

    public async updateTestForFile(uri: vscode.Uri): Promise<void> {
        if (this.isExcluded(uri)) {
            this.testController.items.delete(uri.fsPath);
            return;
        }

        this.outputChannel.appendLine(`Updating feature file: ${uri.fsPath}`);
        const testItem = this.testController.items.get(uri.fsPath);
        if (testItem) {
            await this.resolveTestMethods(testItem);
        } else {
            await this.addTestForFile(uri);
        }
    }

    public removeTestForFile(uri: vscode.Uri): void {
        this.outputChannel.appendLine(`Removing feature file: ${uri.fsPath}`);
        this.testController.items.delete(uri.fsPath);
    }

    private getExcludePatterns(): string[] {
        const configured = vscode.workspace
            .getConfiguration('behatDocker')
            .get<string[]>('testFileExcludePatterns');

        return configured?.length ? configured : DEFAULT_EXCLUDE_PATTERNS;
    }

    private isExcluded(uri: vscode.Uri): boolean {
        const relativePath = vscode.workspace.asRelativePath(uri, false).replace(/\\/g, '/');
        return this.getExcludePatterns().some(pattern => minimatch(relativePath, pattern, { dot: true }));
    }
}
