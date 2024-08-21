

import Store from 'electron-store';
import yaml from 'js-yaml'
import path from 'path';
import fs from 'fs'
import { CustomStorage, LocatorRepositoryModal } from './Contract';
const store = new Store();

export const getConfig = (key) => {
    console.log('config key read :', key)
    return store.get(key)
}

export const setConfig = (key, value) => {
    console.log('config key set :', key, value)
    store.set(key, value)
}

let storagePath;
let customStorage: CustomStorage = {} as any; // Initialize customStorage with an empty object

export const loadCustomStorage = (appPath) => {
    storagePath = path.join(appPath, 'custom-storage.yml');
    console.log(storagePath);
    // Check if the custom-storage.yml file exists
    if (!fs.existsSync(storagePath)) {
        customStorage = {
            Locators: {
                ComponentLocators: []
            }
        }
    }
    else {
        // Load the YAML file
        const fileContents = fs.readFileSync(storagePath, 'utf8');
        customStorage = yaml.load(fileContents) as CustomStorage;
    }

    setInterval(() => {
        // console.log(customStorage);
        fs.writeFileSync(storagePath, yaml.dump(customStorage))
    }, 5000);
}

export const getLocators = (componentName = '') => {
    if (componentName)
        return customStorage.Locators.ComponentLocators.find(x => x.ComponentName === componentName);

    return customStorage.Locators;
}

export const setLocators = (locators: LocatorRepositoryModal) => {
    customStorage.Locators = locators;
}
