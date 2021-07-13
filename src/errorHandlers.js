export const unAuthorizedHandler = (err, _, res, next) => {
    if (err.status === 401) res.status(401).send(err.message || "You are not logged in!")
    else next(err)
}

export const forbiddenHandler = (err, _, res, next) => {
    if (err.status === 403) res.status(403).send(err.message || "You are not allowed to do that!")
    else next(err)
}

export const catchAllHandler = (_, _, res, _) => {
    res.status(500).send("Generic Server Error!")
}
