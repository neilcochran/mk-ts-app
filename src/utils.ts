import * as child_process from 'child_process';
import * as fs from 'fs';
import os from 'os';

/**
 * Using git config information return a string representing the default author.
 * The full author format is 'username <email>' but both fields may omitted if not set
 *
 * @returns The available git author information (username and/or email), or undefined if none exists
 */
export function getDefaultAuthor(): string | undefined {
    let gitUsername: string | undefined;
    try {
        gitUsername = child_process.execSync('git config --get user.name').toString().trim();
    } catch(error) {
        gitUsername = undefined;
    }
    let gitEmail: string | undefined;
    try {
        gitEmail = child_process.execSync('git config --get user.email').toString().trim();
    } catch(error) {
        gitEmail = undefined;
    }
    const name = ((gitUsername ? gitUsername : '') + (gitEmail ? ' <' + gitEmail + '>' : '')).trim();
    return name === '' ? undefined : name;
}

/**
 * Add a script to the package.json's scripts
 *
 * @param scriptName - The name of the script
 * @param script - The contents of the script
 */
export function addScriptToPackageJson(scriptName: string, script: string): void {
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json').toString());
        packageJson.scripts[scriptName] = script;
        fs.writeFileSync('package.json', JSON.stringify(packageJson, undefined, 4));
    } catch(error) {
        console.error(`An error occurred adding to a script to package.json: ${error}`);
    }
}

/**
 * Open the project (current directory) in VSCode
 */
export function openProjectVSCode(): void {
    try {
        child_process.execSync('code .');
    } catch(error) {
        console.error(`Failed to open project with VSCode due to: ${error}`);
    }
}

/**
 * Open the project (current directory) in the OS's native file explorer
 */
export function openFolder(): void {
    let command = '';
    switch(os.type()) {
        case 'Windows_NT':
            command = 'explorer .';
            break;
        case 'Darwin':
            command = 'open .';
            break;
        default: // default to linux
            command = 'xdg-open .';
    }
    try {
        child_process.execSync(command);
    } catch (error) {
        console.error(`Failed to open project due to: ${error}`);
    }
}

/**
 * Initialize a git repository
 */
export function initializeGitRepo(): void {
    console.log('*** Initializing git repository ***');
    try {
        child_process.execSync('git init');
    } catch(error) {
        console.error(`Failed to initialize a git repository due to: ${error}`);
    }
}