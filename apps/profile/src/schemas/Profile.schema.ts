import { IProfilePreferences, Themes, Languages } from '@app/common';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Credential } from 'apps/auth/src/schemas/Credential.schema';
import mongoose from 'mongoose';

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
        default: Languages.PT_BR,
        enum: Object.values(Languages),
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
        minlength: 1,
        maxlength: 20,
    })
    name: string;

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
