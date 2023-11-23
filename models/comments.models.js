const db = require("../db/connection");

exports.selectComments = (article_id, limit, page) => {
  const offset = limit * (page -1)
  return db
    .query(`SELECT *, COUNT(*) OVER() AS total_count FROM comments WHERE article_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;`, [article_id, limit, offset])
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.insertComment = (body, author, article_id) => {
  const values = [body, author, article_id, 0];

  return db
    .query(`INSERT INTO comments (body, author, article_id, votes) VALUES ($1, $2, $3, $4) RETURNING *;`, values)
    .then(({ rows: comment }) => {
      return comment[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
    .then(({ rows: comments }) => {
      if (!comments.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return comments[0];
    });
};

exports.updateCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`, [inc_votes, comment_id])
    .then(({ rows: comments }) => {
      return !comments.length ? Promise.reject({ status: 404, msg: "not found" }) : comments[0];
    });
};
