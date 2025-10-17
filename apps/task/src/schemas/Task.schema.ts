import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { TaskPriority, TaskStatus } from "@app/common";
import mongoose from "mongoose";

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
export class Task {
    @Prop({
        required: true,
        minLength: 1,
        maxLength: 50,
        trim: true
    })
    title: string;

    @Prop({
        maxLength: 500,
        trim: true,
    })
    description: string;

    @Prop({
        default: TaskStatus.TO_DO,
        enum: Object.values(TaskStatus)
    })
    status: string;

    @Prop({
        default: TaskPriority.MEDIUM,
        enum: Object.values(TaskPriority)
    })
    priority: string;

    @Prop({
        required: false,
    })
    dueDate: Date;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId
    })
    owner: mongoose.Schema.Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
