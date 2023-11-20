const { dirname } = require("path");
const db = require("../db/connection")
const fs = require("fs/promises")

exports.selecTopics = () => {
    return db.query(`SELECT * FROM topics;`).then(({rows: topics}) => {
        return topics;
    })
}

exports.readDocumentation = () => {
    const path = `${__dirname}/../endpoints.JSON`
    return fs.readFile(path, "utf8").then((contents) => {
        return JSON.parse(contents)
    })
    .then((endpoints) => {
        for (const endpoint in endpoints) {
            if(!endpoints[endpoint].requestBodyFormat){
                endpoints[endpoint].requestBodyFormat = {}
            }
        }
        return endpoints
    })
}