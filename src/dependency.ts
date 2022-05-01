import * as child_process from 'child_process';
import { exit } from 'process';

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
        name: 'ts-watch',
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
        console.log(`Could not install the dependency '${dependency.name}' due to: ${error}`);
        exit(1);
    }
}

/**
 * Install all the needed common package dependencies
 *
 * @param packageManager - The package manager to use for installing the dependencies
 */
export function installCommonPackageDependencies(packageManager: PackageManager): void {
    console.log('*** Installing common package dependencies ***');
    for(const dependency of COMMON_DEPENDENCIES) {
        addDependency(packageManager, dependency);
    }
}