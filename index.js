// ro handle errors when trying to access a variable that is not defined
process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception', err);
})

import express from "express";
import { dbConnection } from "./databases/dbConnection.js";
import { globalError } from "./src/middleware/globalError.js";
import { appError } from "./src/utils/appError.js";
import userRouter from "./src/modules/user/user.routes.js";
import companyRouter from "./src/modules/company/company.routes.js";
import jobRouter from "./src/modules/job/job.routes.js";
const app = express();
const port = 3000;
app.use(express.json());
app.use(userRouter)
app.use(companyRouter)
app.use(jobRouter)


dbConnection();

//! Error Handling
app.use(globalError)
app.use("*", (req, res, next) => {
    next(new appError(`Endpoint Not Found : ${req.originalUrl}`, 404))
})

// to handle errors outside of the express app
// process.on('unhandledRejection', (err) => {
//     console.log('Unhandled Rejection', err);
// })
app.listen(port, () => {
    console.log(`listening on Port ${port} 🎈 `);
})