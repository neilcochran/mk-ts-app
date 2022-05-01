/**
 * Interface representing a given License and any required information that needs to be provided
 */
export interface License {
    readonly name: string,
    readonly fileName: string,
    readonly requiresFullName: boolean,
    readonly requiresYear: boolean,
    readonly requiresProgramDescription: boolean
}

/**
 * List of all Licenses supported
 */
export const LICENSES: License[] = [
    {
        name: 'MIT',
        fileName: 'MIT.md',
        requiresFullName: true,
        requiresYear: true,
        requiresProgramDescription: false,
    },
    {
        name: 'ISC',
        fileName: 'ISC.md',
        requiresFullName: true,
        requiresYear: true,
        requiresProgramDescription: false,
    },
    {
        name: 'GNU AGPLv3',
        fileName: 'AGPL-3.0-or-later.md',
        requiresFullName: true,
        requiresYear: true,
        requiresProgramDescription: true,
    },
    {
        name: 'GNU GPLv3',
        fileName: 'GPL-3.0-or-later.md',
        requiresFullName: true,
        requiresYear: true,
        requiresProgramDescription: true,
    },
    {
        name: 'GNU LGPLv3',
        fileName: 'LGPL-3.0-or-later.md',
        requiresFullName: false,
        requiresYear: false,
        requiresProgramDescription: false,
    },
    {
        name: 'Apache 2.0',
        fileName: 'Apache-2.0.md',
        requiresFullName: true,
        requiresYear: true,
        requiresProgramDescription: false,
    },
    {
        name: 'Boost Software License 1.0',
        fileName: 'BSL-1.0.md',
        requiresFullName: false,
        requiresYear: false,
        requiresProgramDescription: false,
    },
    {
        name: 'Mozilla Public License 2.0',
        fileName: 'MPL-2.0.md',
        requiresFullName: false,
        requiresYear: false,
        requiresProgramDescription: false,
    },
    {
        name: 'The Unlicense',
        fileName: 'Unlicense.md',
        requiresFullName: false,
        requiresYear: false,
        requiresProgramDescription: false,
    }
];