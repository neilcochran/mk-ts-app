import * as child_process from 'child_process';
import * as fs from 'fs';
import { Answers } from 'inquirer';
import path from 'path';
import { exit } from 'process';
import { createIndexTestFile } from './file-utils';
import { addScriptToPackageJson } from './utils';

/**
 * helper type representing the supported package managers
 */
export type PackageManager = 'yarn' | 'npm';

/**
 * An interface representing a package dependency
 */
interface Dependency {
    name: string,
    saveDev: boolean
}

/**
 * All common dependencies used regardless of users' answers
 */
const COMMON_DEPENDENCIES: Dependency[] = [
    {
        name: 'typescript',
        saveDev: true
    },
    {
        name: '@types/node',
        saveDev: true
    },
    {
        name: 'ts-node',
        saveDev: true
    },
    {
        name: 'tsc-watch',
        saveDev: true
    },
    {
        name: 'eslint',
        saveDev: true
    },
    {
        name: '@typescript-eslint/parser',
        saveDev: true
    },
    {
        name: '@typescript-eslint/eslint-plugin',
        saveDev: true
    }
];

/**
 * Install a dependency using the specified package manager
 *
 * @param packageManager - the package manager to be used
 * @param dependency - the dependency to install
 */
function addDependency(packageManager: PackageManager, dependency: Dependency): void {
    let installCommand = '';
    switch(packageManager) {
        case 'npm':
            installCommand = `npm install ${dependency.name} ${dependency.saveDev ? '--save-dev' : ''}`;
            break;
        case 'yarn':
            installCommand = `yarn add ${dependency.name} ${dependency.saveDev ? '--dev' : ''}`;
            break;
        default:
            console.error(`addDependency received an unsupported PackageManager: ${packageManager}`);
            return;
    }
    console.log(`  --> installing ${dependency.saveDev ? '(dev)' : ''}: ${dependency.name}`);
    try {
        child_process.execSync(installCommand);
    } catch(error) {
        console.error(`Could not install the dependency '${dependency.name}' due to: ${error}`);
        exit(1);
    }
}

/**
 * Install all the needed common package dependencies
 *
 * @param packageManager - The package manager to use for installing the dependencies
 */
export function installCommonDependencies(packageManager: PackageManager): void {
    console.log('*** Installing common package dependencies ***');
    for(const dependency of COMMON_DEPENDENCIES) {
        addDependency(packageManager, dependency);
    }
}

/**
 * Checking the responses in answers, install any optional dependencies selected
 *
 * @param answers - The answers obtained from the user via inquirer
 */
export function installOptionalDependencies(answers: Answers): void {
    if(answers.useJest) {
        console.log('*** Adding Jest testing support ***');
        addDependency(answers.packageManager, {
            name: 'jest@^27.0.0', //latest version of jest currently supported by ts-jest
            saveDev: true
        });
        addDependency(answers.packageManager, {
            name: '@types/jest@^27.0.0', //match jest version
            saveDev: true
        });
        addDependency(answers.packageManager, {
            name: 'ts-jest',
            saveDev: true
        });
        //create test directory
        try {
            fs.mkdirSync('test');
        } catch(error) {
            console.error(`Could not create test directory due to: ${error}`);
            exit(1);
        }
        //add test/index.test.ts
        createIndexTestFile();
        //add jest config file
        try {
            fs.copyFileSync(path.join(__dirname, '../assets/file-templates/jest.config.ts.template'), 'jest.config.ts');
        } catch(error) {
            console.error(`Error occurred copying jest.config.ts: ${error}`);
            exit(1);
        }
        //add test to package.json scripts
        addScriptToPackageJson('test', 'jest');
    }
    if(answers.addTypeDocSupport) {
        console.log('*** Adding TypeDoc support ***');
        addDependency(answers.packageManager, {
            name: 'typedoc',
            saveDev: true
        });
        //add doc gen to package.json scripts
        addScriptToPackageJson('doc', 'typedoc --includeVersion --out doc src/');
    }
}