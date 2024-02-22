import { userModel } from "../../databases/models/user.model.js"
import { appError } from "../utils/appError.js"

export const emailExist = async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.email })
    if (user) {
        return next(new appError('Email already exists', 409))
    }
    next()
}