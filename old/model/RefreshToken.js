const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// Automatically remove documents in the db after the expiration date
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); 

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);