import { appError } from "../utils/appError.js";

export const validation = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate({ ...req.body, ...req.query, ...req.params });
        if (!error) {
            next();
        }
        else {
            let errorList = []
            error.details.forEach(val => {
                errorList.push(val.message)
            });
            next(new appError(errorList, 400))
        }
    }
}