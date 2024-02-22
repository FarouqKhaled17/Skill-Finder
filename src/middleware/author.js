import { appError } from "../utils/appError.js"
import { catchError } from "./catchError.js"

export const allowedTo = (...roles) => {
    return catchError(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new appError('You are not allowed to perform this action 🚫', 403))
        }
        next()
    })
}