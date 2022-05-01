import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import * as child_process from 'child_process';

/**
 * Using git config information return a string representing the default author.
 * The full author format is 'username <email>' but both fields may omitted if not set
 *
 * @returns The available git author information (username and/or email), or undefined if none exists
 */
function getDefaultAuthor(): string | undefined {
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

const questions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter project name:',
        validate(value: string): boolean | string {
            if(value.trim() === '') {
                return 'Please enter a non-blank project name';
            }
            if(fs.existsSync(path.join('.', value))) {
                return 'A directory with that name already exists';
            }
            return true;
        }
    },
    {
        type: 'input',
        name: 'author',
        message: 'Author?',
        default: getDefaultAuthor()
    },
    {
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager would you like to use?',
        choices: ['yarn', 'npm'],
        default: 'yarn'
    },
    {
        type: 'list',
        name: 'license',
        message: 'Which license would you like to use?',
        choices: [
            'MIT',
            'ISC',
            'GNU AGPLv3',
            'GNU GPLv3',
            'GNU LGPLv3',
            'Apache 2.0',
            'Boost Software License 1.0',
            'Mozilla Public License 2.0',
            'The Unlicense'
        ],
        default: 'MIT'
    },
    {
        type: 'confirm',
        name: 'useJest',
        message: 'Would you like to add unit testing support via Jest?',
        default: true
    }
];

(async function main() {
    const answers = await inquirer.prompt(questions);
    console.log(answers);
})();
