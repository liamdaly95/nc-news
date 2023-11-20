const { selecTopics } = require("../models/models")

exports.getTopics = (req, res) => {
    selecTopics().then((topics) => {
        res.status(200).send({topics})
    })
}