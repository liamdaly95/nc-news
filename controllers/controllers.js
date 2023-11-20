const { selecTopics, readDocumentation } = require("../models/models")

exports.getTopics = (req, res, next) => {
    selecTopics().then((topics) => {
        res.status(200).send({topics})
    })
    .catch(next)
}

exports.getDocumentation = (req, res, next) => {
    readDocumentation().then((endpoints) => {
        res.status(200).send({endpoints})
    })
    .catch(next)
}