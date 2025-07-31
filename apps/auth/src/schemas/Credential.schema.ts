import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
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

export type CredentialDocument = HydratedDocument<Credential>;

export const CredentialSchema = SchemaFactory.createForClass(Credential);
