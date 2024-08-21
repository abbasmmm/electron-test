export enum PwActions{
    LaunchBrowser = "LaunchBrowser",
    Fill = "Fill",
    Click = "Click",
    LocatorSelected = "LocatorSelected",
    Test = "Test",
}

export enum StorageActions{
    GetLocators = "GetLocators",
    GetUserName = "GetUserName",
    SetLocators = "SetLocators",
    GetConfig = "GetConfig",
    SetConfig = "SetConfig",
    SelectFolder = "SelectFolder"
}

export enum EsActions {
    LoadScript = "LoadScript",
    ExecuteMethod = "ExecuteMethod"
}

export enum ConfigKeys {
    url = 'url',
    repoPath = 'repoPath'
}