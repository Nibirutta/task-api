import { IUserPreferences } from './user-preferences.interface';

export interface ICredentialData {
    id: string;
    username: string;
    email: string;
    hashedPassword: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserData {
    id: string;
    owner: string;
    firstName: string;
    lastName?: string;
    preferences: IUserPreferences;
    createdAt: Date;
    updatedAt: Date;
}
