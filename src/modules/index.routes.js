import { globalError } from "../middleware/globalError.js";

export const bootstrap = (app) => {
    
    app.use(globalError);
}