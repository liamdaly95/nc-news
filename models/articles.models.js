const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows: article }) => {
    if (!article.length) {
      return Promise.reject({ status: 404, msg: "article not found" });
    }
    return article;
  });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT 
      a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(comment_id) AS comment_count
      FROM articles a LEFT JOIN comments c ON a.article_id = c.article_id GROUP BY a.article_id
      ORDER BY a.created_at DESC;`
    )
    .then(({ rows: articles }) => {
      return articles;
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  const values = [inc_votes, article_id];
  return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, values)
    .then(({ rows: articles }) => {
      if (!articles.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return articles[0];
    });
};
