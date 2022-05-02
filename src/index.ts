#!/usr/bin/env node

import inquirer, { Answers, Question } from 'inquirer';
import * as fs from 'fs';
import path from 'path';
import isValid from 'is-valid-path';
import { createLicenseFile, LICENSES } from './license';
import { getDefaultAuthor, openProject } from './utils';
import {
    createChangelogFile,
    createESLintConfigJsonFile,
    createIndexFile,
    createPackageJsonFile,
    createProjectDirectory,
    createReadmeFile,
    createTSConfigJsonFile,
} from './file-utils';
import * as commandExists from 'command-exists';
import { installCommonDependencies, installOptionalDependencies } from './dependency';

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
    //create README.md file
    createReadmeFile(answers);
    //create license file
    createLicenseFile(answers);
    //create CHANGELOG.md
    createChangelogFile();
    //create package.json
    createPackageJsonFile(answers);
    //create tsconfig.json
    createTSConfigJsonFile();
    //create .eslintrc.json
    createESLintConfigJsonFile();
    //create src/index.ts
    createIndexFile();
    //install all common dependencies
    installCommonDependencies(answers.packageManager);
    //install any optional dependencies the user may have chosen
    installOptionalDependencies(answers);
    console.log(`Your project '${answers.projectName}' has been fully set up and is ready to be used!`);

    //Now that the project is set up - offer to open it.
    let vsCodeCmdExists = false;
    const openProjectQuestion: Question = {
        type: 'confirm',
        name: 'openProject',
        default: true
    };
    //check if VSCode is available on the command line
    if(commandExists.sync('code')) {
        vsCodeCmdExists = true;
        openProjectQuestion.message = 'Would you like to open the project now with VSCode?';
    }
    else {
        openProjectQuestion.message = 'Would you like to the project location now?';
    }
    //prompt the user for the question and get the answer
    const openProjectAnswer = await inquirer.prompt([openProjectQuestion]);
    if(openProjectAnswer.openProject) {
        openProject(openProjectAnswer, vsCodeCmdExists);
    }
})();
