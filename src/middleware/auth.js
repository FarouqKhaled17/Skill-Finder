import { userModel } from "../../databases/models/user.model.js"
import { appError } from "../utils/appError.js"
import { catchError } from "./catchError.js"
import jwt from 'jsonwebtoken'



export const protectedRoutes = catchError(async (req, res, next) => {
    let { token } = req.headers
    //1- Check if token exists
    if (!token) {
        return next(new appError('You are not logged in 🔑', 401))
    }
    //2- Verify token
    let decoded = jwt.verify(token, 'sherlocked')
    //3- Check if user still exists
    let user = await userModel.findById(decoded.userID)
    if (!user) {
        return next(new appError('User does not exist ❗', 401))
    }
    if (user.passwordChangedAt) {
        const time = user.passwordChangedAt.getTime() / 1000;
        if (time > decoded.iat) {
            return next(new appError('invalid token..Login Again', 401))
        }
    }
    req.user = user
    next()
})