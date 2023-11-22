# Northcoders News API

Hosted Version

Here is the link to the hosted version of the api https://nc-news-z45s.onrender.com/

Summary

The project creates an API linked to a database of news related items. The data includes articles, topics, users and comments. These can be accessed through the hosted version of the api through the various endpoints (setup with the get method) found in the app.js file. Also, post and delete routes for comments have been created along with a patch route to update the votes key for a specific article. Documentation can be retrieved by requesting the endpoint "/api"

Instructions

- clone the repo by entering the command "git clone https://github.com/liamdaly95/nc-news.git" into your terminal
- setup the database by running "npm run setup-dbs"
- three environment variable files need to be setup in the root directory. The first should be named ".env.development" and include the line "PGDATABASE=nc_news". The second should be named ".env.test" and include the line "PGDATABASE=nc_news_test". The third should be named ".env.production" and include the line "DATABASE_URL=postgres://bfpcrptu:qJ8iU6rmVEIFd-JRguU0KMxsetAx19ul@flora.db.elephantsql.com/bfpcrptu".
- run "npm install jest" to allow you to run the tests
- run "npm test app" to run the tests for the various endpoints (the test database will automatically be seeded). These can be found in the app.test.js file within the __tests__ folder.
- run "npm run seed" to seed the dev database.
- run "npm start" to start the server and allow the dev database to be requested by user (e.g. through Insomnia)

Requirements

- node must be version 14 or above
- postgress must be version 16.1 or above