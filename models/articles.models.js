const format = require("pg-format");
const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT a.*, COUNT(comment_id) AS comment_count 
      FROM articles a LEFT JOIN comments c ON a.article_id = c.article_id WHERE a.article_id = $1 
      GROUP BY a.article_id;`,
      [article_id]
    )
    .then(({ rows: articles }) => {
      if (!articles.length) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return articles[0];
    });
};

exports.selectArticles = (topic, sort_by, order) => {
  const values = [];
  let queryString = `SELECT 
  a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(comment_id) AS comment_count
  FROM articles a LEFT JOIN comments c ON a.article_id = c.article_id `;
  if (topic) {
    values.push(topic);
    queryString += `WHERE topic = $1`;
  }
  queryString += ` GROUP BY a.article_id
  ORDER BY %I %s;`;
  
  const formattedQuery = format(queryString, sort_by, order)
  return db.query(formattedQuery, values).then(({ rows: articles }) => {
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
