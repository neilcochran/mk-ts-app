import inquirer, { Answers } from 'inquirer';
import * as fs from 'fs';
import path from 'path';
import isValid from 'is-valid-path';
import { LICENSES } from './license';
import { installCommonPackageDependencies } from './dependencies';
import {
    createESLintConfigJsonFile,
    createIndexFile,
    createPackageJsonFile,
    createProjectDirectory,
    createTSConfigJsonFile,
    getDefaultAuthor
} from './utils';

/**
 * Construct all questions to be passed to inquirer
 */
const QUESTIONS = [
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
            if(!isValid(trimmedValue)) {
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
        choices: LICENSES.map(license => license.name),
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
            return LICENSES.find(license => license.name === answers.license)?.requiresFullName ?? false;
        }
    },
    {
        type: 'input',
        name: 'licenseProgramDescription',
        message: 'Please enter a short (less than 80 characters) description of the program (required by the license you selected):',
        filter(value: string): string {
            return value.trim();
        },
        validate(value: string): boolean | string {
            if(value === '') {
                return 'Please enter a non-empty program description';
            }
            if(value.length > 80) {
                return 'Please enter a shorter description (less than 80 characters)';
            }
            return true;
        },
        when(answers: Answers): boolean {
            return LICENSES.find(license => license.name === answers.license)?.requiresProgramDescription ?? false;
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
    }
];

/**
 * Prompt the user for all the inquirer questions and create the project based on the answers received
 */
(async function main(): Promise<void> {
    const answers = await inquirer.prompt(QUESTIONS);
    //create project dir and src dir
    createProjectDirectory(answers.projectName);
    //move into the new project directory we just created
    process.chdir(answers.projectName);
    //create package.json
    createPackageJsonFile(answers);
    //create tsconfig.json
    createTSConfigJsonFile();
    //create .eslintrc.json
    createESLintConfigJsonFile();
    //create src/index.ts
    createIndexFile();
    //install all common dependencies
    installCommonPackageDependencies(answers.packageManager);
    console.log(`Your project '${answers.projectName}' has been fully set up and is ready to be used!`);
})();
