import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        unique: true,
        required: [true, 'companyName is required'],
        minLength: [2, 'too short companyName'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'description is required'],
        minLength: [10, 'too short description'],
        trim: true,
    },
    industry: {
        type: String,
        required: [true, 'industry is required'],
        minLength: [2, 'too short industry name'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'address is required'],
        minLength: [2, 'too short address'],
        trim: true,
    },
    numberOfEmployees: {
        type: Number,
        required: [true, 'numberOfEmplyees is required'],
    },
    companyEmail: {
        type: String,
        unique: true,
        required: [true, 'companyEmail is required'],
        trim: true,
    },
    companyHR: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
}, { timestamps: true })

export const companyModel = mongoose.model('company', companySchema);