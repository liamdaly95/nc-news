const db = require("../db/connection")

exports.selecTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows: topics}) => {
        return topics;
    })
}