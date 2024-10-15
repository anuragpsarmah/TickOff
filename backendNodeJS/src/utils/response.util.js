export const response = (res, status, message, data, error) => {
    res.status(status).json({
        message,
        error: error || "None",
        data: data || "None",
    });
};
