import * as child_process from 'child_process';
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