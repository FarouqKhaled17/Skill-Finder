import { userModel } from "../../databases/models/user.model.js"
import { appError } from "../utils/appError.js"

export const mobileNumberExist = async (req, res, next) => {
    let user = await userModel.findOne({ email: req.body.mobileNumber })
    if (user) {
        return next(new appError('mobile Number already exists', 409))
    }
    next()
}