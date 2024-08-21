import path from 'path';
import { ConfigKeys } from '../Actions';
import { getConfig } from '../storage/ElectronStorage';

let customMethods;
let methodNames;
export const LoadScript = () => {
    const filePath = path.join(getConfig(ConfigKeys.repoPath) as string, 'dist/custom-methods/index.js');

    try {
        customMethods = require(filePath); // Use require to load the module
    } catch (error) {
        console.error('Error loading script:', error);
        return []; // Return an empty array if there's an error
    }

    methodNames = Object.keys(customMethods);
    console.log(methodNames)    

    return methodNames;
};


export const ExecuteMethod = async (methodName: string, ...args: any[]) => {
    if (methodNames.includes(methodName)) {
        try {
            const result = await customMethods[methodName](...args);
            console.log('Result:', result);
        } catch (error) {
            console.error('Error executing method:', error);
        }
    } else {
        console.error('Method not found:', methodName);
    }
};