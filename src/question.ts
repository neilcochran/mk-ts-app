import { Answers, QuestionCollection } from 'inquirer';
import path from 'path';
import * as fs from 'fs';
import isValidPath from 'is-valid-path';
import { LICENSES } from './license';
import { getDefaultAuthor } from './utils';
import commandExists from 'command-exists';

/**
 * Construct all questions to be asked before any project creation takes place
 */
export const PRE_CREATION_QUESTIONS: QuestionCollection = [
    {
        type: 'input',
        name: 'projectName',
        message: 'Enter project name:',
        filter(value: string): string {
            return value.trim();
        },
        validate(value: string): boolean | string {
            const trimmedValue = value.trim();
            if(trimmedValue === '') {
                return 'Project name cannot be blank';
            }
            if(fs.existsSync(trimmedValue)) {
                return `A directory with that name already exists: '${trimmedValue}'`;
            }
            if(!isValidPath(trimmedValue)) {
                return `Project name is not a valid directory name: '${trimmedValue}'`;
            }
            //don't allow users to pass a path, enforce that this script is run in the desired parent directory
            if(path.basename(trimmedValue) !== trimmedValue) {
                return 'Cannot use a path for a project name. Please run this script in the desired parent directory and pass a project name only';
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
        choices: LICENSES.map(license => license.displayName),
        default: 'MIT'
    },
    {
        type: 'input',
        name: 'licenseFullName',
        message: 'Please enter a full name for the license copywriter (required by the license you selected):',
        filter(value: string): string {
            return value.trim();
        },
        validate(value: string): boolean | string {
            if(value === '') {
                return 'Please enter a non-empty full name';
            }
            return true;
        },
        when(answers: Answers): boolean {
            return LICENSES.find(license => license.displayName === answers.license)?.requiresFullName ?? false;
        }
    },
    {
        type: 'confirm',
        name: 'useJest',
        message: 'Would you like to add unit testing support via Jest?',
        default: true
    },
    {
        type: 'confirm',
        name: 'addTypeDocSupport',
        message: 'Would you like to add TypeDoc support (generates HTML documentation from TSDoc comments)?',
        default: true
    },
    {
        type: 'confirm',
        name: 'initializeGit',
        message: 'Would you like to initialize a git repository?',
        default: true,
        when(): boolean {
            //only ask this when the 'git' command exists
            return commandExists.sync('git');
        }
    },
];

/**
 * Construct all questions to be asked after the project creation takes place
 */
export const POST_CREATION_QUESTIONS: QuestionCollection = [
    {
        type: 'confirm',
        name: 'openProjectVSCode',
        message: 'Would you like to open the project now with VSCode?',
        default: true,
        when(): boolean {
            //only ask this question when the VSCode command does not exists
            return commandExists.sync('code');
        }
    },
    {
        type: 'confirm',
        name: 'openProjectLocation',
        message: 'Would you like to open the project location now?',
        default: true,
        when(): boolean {
            //only ask this question when the VSCode command exists
            return !commandExists.sync('code');
        }
    }
];