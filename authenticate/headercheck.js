module.exports = (req, res, next) => {
    if (!req.headers.authHeader) res.status(401).send({ 'status': 0, 'err': 'Unauthorized Request' })
    let headerInfo = req.headers.authHeader;
    headerInfo = headerInfo.split('-');
    if (headerInfo[0] == 'akssancarpooling123#' && headerInfo[1] == 'asb@1234567890abc') next()
    else res.status(401).send({ 'status': 0, 'err': 'Unauthorized Request' })
}