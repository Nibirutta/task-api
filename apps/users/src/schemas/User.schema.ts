import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';
import { Credential } from 'apps/auth/src/schemas/Credential.schema';
import mongoose from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
