const db = require("../db/connection");

exports.selecTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.insertTopic = (description, slug) => {
  return db.query(`INSERT INTO topics (description, slug) VALUES ($1, $2) RETURNING *;`,[description,slug]).then(({rows: topics}) => {
    return topics[0];
  })
}
