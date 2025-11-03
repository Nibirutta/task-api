import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Credential {
    @Prop({
        unique: true,
        trim: true,
        required: true,
        minlength: 3,
        maxlength: 20,
    })
    username: string;

    @Prop({
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    })
    email: string;

    @Prop({
        required: true,
    })
    hashedPassword: string;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);
