import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Credential } from 'apps/auth/src/schemas/Credential.schema';
import mongoose from 'mongoose';

export enum Themes {
    LIGHT = 'light',
    DARK = 'dark',
    LOFI = 'lofi'
}

@Schema({
    _id: false
})
export class NotificationPreferences {
    @Prop({
        default: true
    })
    email: boolean;
}

@Schema({
    _id: false
})
export class Preferences {
    @Prop({
        default: Themes.LIGHT,
        enum: Object.values(Themes)
    })
    theme: string;

    @Prop({
        default: 'pt-BR'
    })
    language: string;

    @Prop({
        type: NotificationPreferences
    })
    notification: NotificationPreferences;
}

@Schema({
    timestamps: true,
})
export class User {
    @Prop({
        required: true,
    })
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({
        required: true,
        type: mongoose.Types.ObjectId,
        ref: Credential.name,
    })
    owner: Credential;

    @Prop({
        type: Preferences
    })
    preferences: Preferences;
}

export const UserSchema = SchemaFactory.createForClass(User);
