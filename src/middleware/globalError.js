export const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (process.env.NODE_ENV !== 'development')
        res.status(err.statusCode).json({
            error: err.message,
            status: err.status,
            stack: err.stack,
        })
    else {
        res.status(err.statusCode).json({ error: err.message })
    }
}