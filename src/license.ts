import * as fs from 'fs';
import { Answers } from 'inquirer';
import path from 'path';

/**
 * Interface representing a given License and any required information that needs to be provided
 */
export interface License {
    readonly name: string,
    readonly displayName: string,
    readonly outputFilename: string;
    readonly requiresFullName: boolean,
    readonly requiresYear: boolean,
}

/**
 * List of all Licenses supported
 */
export const LICENSES: License[] = [
    {
        name: 'MIT',
        displayName: 'MIT',
        outputFilename: 'LICENSE.md',
        requiresFullName: true,
        requiresYear: true
    },
    {
        name: 'ISC',
        displayName: 'ISC',
        outputFilename: 'LICENSE.md',
        requiresFullName: true,
        requiresYear: true
    },
    {
        name: 'AGPL-3.0-or-later',
        displayName: 'GNU AGPLv3',
        outputFilename: 'LICENSE.md',
        requiresFullName: false,
        requiresYear: false
    },
    {
        name: 'GPL-3.0-or-later',
        displayName: 'GNU GPLv3',
        outputFilename: 'COPYING.md',
        requiresFullName: false,
        requiresYear: false
    },
    {
        name: 'Apache-2.0',
        displayName: 'Apache 2.0',
        outputFilename: 'LICENSE.md',
        requiresFullName: false,
        requiresYear: false
    },
    {
        name: 'BSL-1.0',
        displayName: 'Boost Software License 1.0',
        outputFilename: 'LICENSE.md',
        requiresFullName: false,
        requiresYear: false
    },
    {
        name: 'MPL-2.0',
        displayName: 'Mozilla Public License 2.0',
        outputFilename: 'LICENSE.md',
        requiresFullName: false,
        requiresYear: false
    },
    {
        name: 'Unlicense',
        displayName: 'The Unlicense',
        outputFilename: 'UNLICENSE.md',
        requiresFullName: false,
        requiresYear: false,
    }
];

/**
 * Create the license file in the project root of the indicated license
 *
 * @param answers - The answers obtained from the user via inquirer
 */
export const createLicenseFile = (answers: Answers): void => {
    const license = LICENSES.find(license => license.displayName === answers.license);
    if(!license) {
        throw new Error(`Invalid license name provided: '${answers.license}'`);
    }
    console.log('*** Creating license file ***');
    try {
        let licenseContents = fs.readFileSync(path.join(__dirname, '../assets/licenses', license.name + '.md')).toString();
        if(license.requiresFullName) {
            licenseContents = licenseContents.replace('[full name]', answers.licenseFullName);
        }
        if(license.requiresYear) {
            licenseContents = licenseContents.replace('[year]', new Date().getFullYear().toString());
        }
        fs.writeFileSync(license.outputFilename, licenseContents);
    } catch(error) {
        console.error(`Error encountered creating and copying license file for: ${license.displayName}`);
    }
};