const db = require("../db/connection");

exports.selectComments = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [article_id])
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.insertComment = (body, author, article_id) => {
const values = [body, author, article_id, 0]

  return db.query(`INSERT INTO comments (body, author, article_id, votes) VALUES ($1, $2, $3, $4) RETURNING *;`,values).then(({rows: comment}) => {
    return comment[0];
  })
}
