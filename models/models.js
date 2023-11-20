const db = require("../db/connection");

exports.selecTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows: topics }) => {
    return topics;
  });
};

exports.selectArticleById = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({ rows: article }) => {
    if(!article.length){return Promise.reject({status: 404, msg: "article not found"})}
    return article;
  });
};
