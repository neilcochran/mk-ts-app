#!/usr/bin/env node

import inquirer from 'inquirer';
import { createLicenseFile } from './license';
import { initializeGitRepo, openFolder, openProjectVSCode } from './utils';
import {
    createChangelogFile,
    createESLintConfigJsonFile,
    createGitIgnoreFile,
    createIndexFile,
    createPackageJsonFile,
    createProjectDirectory,
    createReadmeFile,
    createTSConfigJsonFile,
} from './file-utils';
import { installCommonDependencies, installOptionalDependencies } from './dependency';
import { POST_CREATION_QUESTIONS, PRE_CREATION_QUESTIONS } from './question';

/**
 * Prompt the user for all the inquirer questions and create the project based on the answers received
 */
(async function main(): Promise<void> {

    //Ask all pre project creation questions
    const preProjAnswers = await inquirer.prompt(PRE_CREATION_QUESTIONS);

    //create project dir and src dir
    createProjectDirectory(preProjAnswers.projectName);
    //move into the new project directory we just created
    process.chdir(preProjAnswers.projectName);

    //create README.md file
    createReadmeFile(preProjAnswers);

    //create license file
    createLicenseFile(preProjAnswers);

    //create CHANGELOG.md
    createChangelogFile();

    //create package.json
    createPackageJsonFile(preProjAnswers);

    //create tsconfig.json
    createTSConfigJsonFile();

    //create .eslintrc.json
    createESLintConfigJsonFile();

    //create src/index.ts
    createIndexFile();

    //install all common dependencies
    installCommonDependencies(preProjAnswers.packageManager);

    //install any optional dependencies the user may have chosen
    installOptionalDependencies(preProjAnswers);

    //check if we should initialize the git repository and create a .gitignore file
    if(preProjAnswers.initializeGit) {
        initializeGitRepo();
        createGitIgnoreFile();
    }

    console.log(`\nYour project '${preProjAnswers.projectName}' has been fully set up and is ready to be used!\n`);

    //Now that the project is set up - ask any follow up questions
    const postProjAnswers = await inquirer.prompt(POST_CREATION_QUESTIONS);

    //check if we should open the project
    if(postProjAnswers.openProjectVSCode) {
        openProjectVSCode();
    }
    else if(postProjAnswers.openProjectLocation) {
        openFolder();
    }
})();
