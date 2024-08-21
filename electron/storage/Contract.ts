
export interface CustomStorage{
    Locators: LocatorRepositoryModal
}

export interface LocatorRepositoryModal {
    ComponentLocators: ComponentLocatorsModel[]
}

export interface LocatorModel {
    id?: any;
    name: string,
    locator: string,
}

export interface ComponentLocatorsModel {
    ComponentName: string;
    ComponentLocator?:string;
    Locators: LocatorModel[];
}