import mongoose from "mongoose"
import { userModel } from "../../../databases/models/user.model.js"
import { catchError } from "../../middleware/catchError.js"
import { appError } from "../../utils/appError.js"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'


//! SignUp
const SignUp = catchError(async (req, res, next) => {
    let user = new userModel(req.body)
    await user.save()
    res.status(201).json({ message: "User Created Successfully" })
})

//! SignIn
const SignIn = catchError(async (req, res, next) => {
    let user = await userModel.findOne({ $or: [{ email: req.body.email }, { mobileNumber: req.body.mobileNumber }] })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign({ userID: user._id, role: user.role }, 'sherlocked')
        await userModel.updateOne({ email: user.email }, { $set: { status: 'Online' } });
        res.status(200).json({ message: "User Logged In Successfully", token })
    }
    else {
        return next(new appError('Incorrect email, mobile number, or password', 401))
    }
})

//? Change Password
const changePassword = catchError(async (req, res, next) => {
    let user = await userModel.findById(req.user._id)
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign({ userID: user._id, role: user.role }, 'sherlocked')
        await userModel.findByIdAndUpdate(req.user._id, { password: req.body.newPassword, passwordChangedAt: Date.now() })
        await userModel.updateOne({ email: user.email }, { $set: { status: 'Offline' } });
        res.status(200).json({ message: "Password Changed Successfully", token })
    }
    else {
        return next(new appError('Incorrect Password', 401))
    }
})

//* Update Account 
// TODO: WILL BE MODIFIED LATER
// const updateAccount = catchError(async (req, res, next) => {
//     const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body
//     let user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
//     if (user) {
//         res.status(200).json({ message: "Account Updated Successfully", user })
//     }
//     else {
//         return next(new appError('User not found', 404))
//     }
// })

const updateAccount = async (req, res, next) => {
    const userId = req.user._id;
    // Find the user by its ObjectId
    const existingUser = await userModel.findById(userId);
    // Check if the user exists
    if (!existingUser) {
        return next(new appError('User not found', 404));
    }
    // Update only the provided fields
    const allowedFields = ['email', 'mobileNumber', 'recoveryEmail', 'DOB', 'lastName', 'firstName'];
    allowedFields.forEach((field) => {
        if (req.body[field]) {
            existingUser[field] = req.body[field];
        }
    });
    // Save the updated account
    const updatedUser = await existingUser.save();
    // Respond with success message and updated user data
    res.status(200).json({ message: 'Account updated successfully', user: updatedUser });
}

//! Delete Account
const deleteAccount = catchError(async (req, res, next) => {
    let user = await userModel.findByIdAndDelete(req.params.id)
    if (user) {
        res.status(200).json({ message: "Account Deleted Successfully" })
    }
    else {
        return next(new appError('User not found', 404))
    }
})

//? Get profile data for another user 
const getProfile = catchError(async (req, res, next) => {
    const userId = req.params.id;
    if (userId) {
        let user = await userModel.findById(req.params.id)
        res.status(200).json({ message: "User found", user })
    }
    else {
        return next(new appError('User not found', 404))
    }
})

//* Get all accounts associated to a specific recovery Email 
const getAccounts = catchError(async (req, res, next) => {
    let user = await userModel.find({ recoveryEmail: req.body.recoveryEmail })
    if (user) {
        res.status(200).json({ message: "User found", user })
    }
    else {
        return next(new appError('User not found', 404))
    }
})

//* Get user account data 
const getUserData = catchError(async (req, res, next) => {
    let user = await userModel.findById(req.params.id)
    if (user) {
        res.status(200).json({ message: "User found", user })
    }
    else {
        return next(new appError('User not found', 404))
    }
})

//! Forget Password

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Update password with OTP function
const updatePasswordWithOTP = async (userId, otp) => {
    await userModel.findByIdAndUpdate(userId, { $set: { otp } });
};

const sendOTP = catchError(async (req, res, next) => {
    const { email } = req.body;
    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new appError('User not found', 404));
    }
    // Generate OTP
    const otp = generateOTP();
    // Update user document with the generated OTP
    await updatePasswordWithOTP(user._id, otp);
    return res.status(200).json({ message: 'OTP sent successfully' });
});


const forgetPassword = catchError(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email, otp });
    if (!user) {
        return next(new appError('Invalid OTP', 400));
    }
    await userModel.updateOne({ email: user.email }, { $set: { status: 'Offline' } });
    user.password = newPassword;
    user.otp = undefined; // Clear OTP after successful reset
    await user.save();
    return res.status(200).json({ message: 'Password reset successfully' });
})




export {
    SignUp,
    SignIn,
    changePassword,
    updateAccount,
    deleteAccount,
    getProfile,
    getAccounts,
    getUserData,
    sendOTP,
    forgetPassword
}