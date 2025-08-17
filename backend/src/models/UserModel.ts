import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
    {
        name: String,
        email: String,
        password: String,
        isAdmin: Boolean,
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const UserModel = model('User', UserSchema);
