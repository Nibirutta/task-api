import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Credential } from './Credential.schema';
import { TokenType } from '@app/common';
import mongoose from 'mongoose';

@Schema({
    toObject: {
        transform(doc, ret: any, options) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
})
export class Token {
    @Prop({
        unique: true,
        required: true,
    })
    token: string;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(TokenType),
    })
    type: TokenType;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Credential.name,
    })
    owner: Credential;

    @Prop({
        type: Date,
        default: Date.now,
    })
    createdAt: Date;

    @Prop({
        required: true,
        type: Date,
    })
    expiresAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);

TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
