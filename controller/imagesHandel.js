let User = require('../helper/userdetail');
module.exports = {
    profileImage: (req, res) => {
        if (!req.body) res.status(422).send({ 'status': 422, 'err': 'Data Required' })
        else if (!req.body.email || !req.body.purl) res.status(422).send({ 'status': 422, 'err': 'Data Required' })
        else {
            User.profilePicUpload({ 'email': req.body.email, 'url': req.body.purl }).then(data => {
                if (data == null || data.length <= 0) res.status(404).send({ 'status': 404, 'err': 'User Not Found' })
                else res.status(200).send({ 'status': 200, 'data': 'Picture Uploaded Successfully' })
            }).catch(err => res.status(500).send({ 'status': 500, 'err': 'Internal Server Error' }))
        }
    }
}