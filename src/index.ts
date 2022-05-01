import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';

const questions = [
    {
        type: 'string',
        name: 'projectName',
        message: 'Enter project name:',
        //make sure the project name is not blank, and a directory with that name does not already exist
        validate(value: string): boolean | string {
            if(value.trim() === '') {
                return 'Please enter a non blank project name';
            }
            if(fs.existsSync(path.join('.', value))) {
                return 'A directory with that name already exists';
            }
            return true;
        }
    }
];

(async function main() {
    const answers = await inquirer.prompt(questions);
    console.log(answers);
})();
