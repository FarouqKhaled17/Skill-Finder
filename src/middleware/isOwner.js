import mongoose from "mongoose";
import { companyModel } from "../../databases/models/company.model.js";
import { appError } from "../utils/appError.js";


// Check if the user is the owner of the company
export const isOwner = async (req, res, next) => {
    const companyId = req.params.companyId;
    const existingCompany = await companyModel.findById(companyId);

    if (!existingCompany) {
        return next(new appError('not found', 404));
    }

    const userId = req.user._id;
    if (existingCompany.companyHR.toString() !== new mongoose.Types.ObjectId(userId).toString()) {
        return next(new appError('Unauthorized: Only the owner can update', 403));
    }
    next()
}