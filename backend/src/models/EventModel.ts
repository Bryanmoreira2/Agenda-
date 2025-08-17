import { Schema, model } from 'mongoose';

const EventSchema = new Schema(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String },
        createdBy: { type: String, required: true },

        category: {
            type: String,
            enum: [
                'Culto',
                'Reunião',
                'Estudo',
                'Ensaio',
                'Evento Especial',
                'Outro',
            ],
            required: true,
        },
        color: { type: String, required: true },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const EventModel = model('Event', EventSchema);
