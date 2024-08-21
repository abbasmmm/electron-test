import os from 'os';

export const GetUserName = () => {
    return os.userInfo().username
}