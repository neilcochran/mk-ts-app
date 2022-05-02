import * as child_process from 'child_process';
import { Answers } from 'inquirer';
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
 * Determines if the project should be opened. If it is to be opened and hasVSCodeCommand is true
 * the project will be opened in VSCode. If it is to be opened and hasVSCodeCommand is false, it will be opened in
 * the OS's native file explorer
 *
 * @param openProjAnswer - The Answers object containing the response to our openProject question
*
 * @param hasVSCodeCommand - If the users OS has the VSCode 'code' command available
 */
export function openProject(openProjAnswer: Answers, hasVSCodeCommand: boolean): void {
    if(openProjAnswer.openProject) {
        if(hasVSCodeCommand) {
            try {
                child_process.execSync('code .');
            } catch(error) {
                console.log(`Failed to open project with VSCode due to: ${error}`);
            }
        }
        else {
            openFolderForOS();
        }
    }
}

/**
 * Open a folder in the OS's native file explorer
 */
function openFolderForOS(): void {
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
        console.log(`Failed to open project due to: ${error}`);
    }
}