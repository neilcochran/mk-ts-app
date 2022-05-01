import * as fs from 'fs';
import { Answers } from 'inquirer';
import path from 'path';
import { exit } from 'process';
import { LICENSES } from './license';

/**
 * Create the project directory and its 'src' subdirectory
 *
 * @param projectName - the project name used to create a new directory
 */
export function createProjectDirectory(projectName: string): void {
    console.log('*** Creating initial project directories ***');
    try {
        fs.mkdirSync(path.join(projectName, 'src'), { recursive: true });
    } catch(error) {
        console.error(`Error: Could not create project directory '${projectName}' encountered: ${error}`);
        exit(1);
    }
}

/**
 * Create the CHANGELOG.md file in the project's root
 */
export function createChangelogFile(): void {
    console.log('*** Creating CHANGELOG.md ***');
    try {
        fs.copyFileSync(path.join(__dirname, '../assets/file-templates/CHANGELOG.md.template'), 'CHANGELOG.md');
    } catch(error) {
        console.log(`Could not create CHANGELOG.md file. Encountered: ${error}`);
        exit(1);
    }
}

/**
 * Using the answers provided, create a package.json file in the project's root directory
 *
 * @param answers - The answers obtained from the user via inquirer
 */
export function createPackageJsonFile(answers: Answers): void {
    try {
        //replace placeholder values in the package.json template before writing it to the project's root directory
        let packageJsonContents = fs.readFileSync(path.join(__dirname, '../assets/file-templates/package.json.template')).toString();
        packageJsonContents = packageJsonContents.replace('[PROJECT]', answers.projectName);
        packageJsonContents = packageJsonContents.replace('[AUTHOR]', answers.author);
        const licenseName = LICENSES.find(license => license.displayName === answers.license)?.name;
        if(!licenseName) {
            throw new Error(`Could not find a license associated with the display name: '${answers.license}'`);
        }
        packageJsonContents = packageJsonContents.replace('[LICENSE]', licenseName);
        fs.writeFileSync('package.json', packageJsonContents);
    } catch(error) {
        console.log(`Could not create package.json file. Encountered: ${error}`);
        exit(1);
    }
}

/**
 * Create a tsconfig.json file in the project's root directory
 */
export function createTSConfigJsonFile(): void {
    console.log('*** Creating tsconfig.json ***');
    try {
        fs.copyFileSync(path.join(__dirname, '../assets/file-templates/tsconfig.json.template'), 'tsconfig.json');
    } catch(error) {
        console.log(`Error copying tsconfig.json into project: ${error}`);
        exit(1);
    }
}

/**
 * Create a .eslintrc.json file in the project's root directory
 */
export function createESLintConfigJsonFile(): void {
    console.log('*** Creating .eslintrc.json ***');
    try {
        fs.copyFileSync(path.join(__dirname, '../assets/file-templates/.eslintrc.json.template'), '.eslintrc.json');
    } catch(error) {
        console.log(`Error copying .eslintrc.json into project: ${error}`);
        exit(1);
    }
}

/**
 * Creates an 'src/index.ts' file with a simple main function
 */
export function createIndexFile(): void {
    console.log('*** Creating src/index.ts ***');
    try {
        fs.copyFileSync(path.join(__dirname, '../assets/file-templates/index.ts.template'), 'src/index.ts');
    } catch(error) {
        console.log(`Error copying index.ts into project: ${error}`);
        exit(1);
    }
}