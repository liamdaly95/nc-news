const { selecTopics } = require("../models/models")

exports.getTopics = (req, res, next) => {
    selecTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}