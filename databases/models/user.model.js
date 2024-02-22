import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'firstName is required'],
        minLength: [2, 'too short name'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'lastName is required'],
        minLength: [2, 'too short name'],
        trim: true,
    },
    username: {
        type: String,
        required: [true, 'username is required'],
        minLength: [2, 'too short username'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    newPassword: {
        type: String,
    },
    recoveryEmail: {
        type: String,
        required: [true, 'recoveryEmail is required'],
    },
    DOB: {
        type: Date,
        required: [true, 'DOB is required'],
    },
    mobileNumber: {
        type: Number,
        required: [true, 'mobileNumber is required'],
        unique: true
    },
    role: {
        type: String,
        enum: ['Company_HR', 'user'],
        default: "user"
    },
    status: {
        type: String,
        enum: ['Offline', 'Online'],
        default: "Offline"
    },
    passwordChangedAt: Date,
    otp: {
        type: Number,
    }
}, { timestamps: true })

//! we hash passwords for all api that saves or updates here to save writing the same code in each api
userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 8);
})

// userSchema.pre('findOneAndUpdate', function () {
//     this._update.password = bcrypt.hashSync(this._update.password, 8);
// })

export const userModel = mongoose.model('user', userSchema);