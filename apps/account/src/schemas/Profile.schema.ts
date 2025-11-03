import { Themes, Languages } from '@app/common';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
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
export class Preferences {
    @Prop({
        default: Themes.DEFAULT,
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

@Schema({ timestamps: true })
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
    })
    owner: mongoose.Schema.Types.ObjectId;

    @Prop({
        default: () => ({}),
        type: Preferences,
    })
    preferences: Preferences;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
