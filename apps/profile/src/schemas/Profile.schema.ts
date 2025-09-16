import { IProfilePreferences } from '@app/common';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Credential } from 'apps/auth/src/schemas/Credential.schema';
import mongoose from 'mongoose';

export enum Themes {
    LIGHT = 'light',
    DARK = 'dark',
    LOFI = 'lofi',
}

@Schema({
    _id: false,
})
export class NotificationPreferences {
    @Prop({
        default: true,
    })
    email: boolean;
}

@Schema({
    _id: false,
})
export class Preferences implements IProfilePreferences {
    @Prop({
        default: Themes.LIGHT,
        enum: Object.values(Themes),
    })
    theme: string;

    @Prop({
        default: 'pt-BR',
    })
    language: string;

    @Prop({
        default: () => ({}),
        type: NotificationPreferences,
    })
    notification: NotificationPreferences;
}

@Schema({
    toObject: {
        transform(doc, ret: any, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
    timestamps: true,
})
export class Profile {
    @Prop({
        required: true,
    })
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Credential.name,
    })
    owner: Credential;

    @Prop({
        default: () => ({}),
        type: Preferences,
    })
    preferences: Preferences;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
