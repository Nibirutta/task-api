import { IProfilePreferences } from './profile-preferences.interface';

export interface ICredentialData {
    id: string;
    username: string;
    email: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IProfileData {
    id: string;
    owner: string;
    firstName: string;
    lastName?: string;
    preferences: IProfilePreferences;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserInfo {
    username: string;
}
