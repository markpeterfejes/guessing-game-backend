import { Document, Schema, model } from "mongoose";

export interface ILogEntry extends Document
{
    guess: number;
    solution: number;
}

const LogEntrySchema = new Schema
({
        guess: { type: Number, required: true },
        solution: { type: Number, required: true},
});

export const LogEntry = model<ILogEntry>("LogEntry", LogEntrySchema);

