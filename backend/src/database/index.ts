import mongoose from 'mongoose';

export async function setupMongo() {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        console.log('🎲 Connecting to database.... ');

        const uri = process.env.MONGO_URL;

        if (!uri) {
            throw new Error(
                '❌ Variável MONGO_URL não foi definida no ambiente!',
            );
        }

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 3000,
        });

        console.log('✅ Database connection established successfully! ✅');
    } catch (error) {
        console.error('❌ Database not connected:', error.message);
        throw error;
    }
}
