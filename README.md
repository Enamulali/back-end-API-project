# Northcoders News API

This project is a social news API built using PSQL, express and node.js. The API was created with the following:

- PostgreSQL: creating, seeding, connecting to and querying the database
- A model-view-controller pattern to handle server requests
- Test driven development: using jest and supertest to test API functions for unintended side effects
- Error Handling: endpoints are provided with (custom) error codes & messages e.g. invalid data type
- Heroku: hosting the API with a production database.

### To view the hosted version of this API, visit:
https://enams-nc-news-api.herokuapp.com/api/articles

and view the live front-end application for this API here: https://nc-news-ea.netlify.app

## Installation

Follow these instructions to install and run your own version of this app.

### Requirements

Node.js (v17.x) and PostgreSQL (v13.6 or above).

### Instructions

1. Clone the respository 
```
git clone https://github.com/Enamulali/back-end-API-project.git
```
and `cd` into the directory

2. Run `npm install` to install dependencies
3. To successfully connect to the databases, the developer should specify the databases in two .env files. From the root of the project directory, run the following:

   ```
   echo 'PGDATABASE=nc_news' > ./.env.development
   echo 'PGDATABASE=nc_news_test' > ./.env.test
   ```

4. Run `npm run setup-dbs` & `npm run seed` to setup and seed the development and test databases


### Testing

5. We have now successfully completed our setup:
   - To run the app, use: `npm start`. 
   - If you wish to view the api in a separate app (e.g. insomnia), the default port is 8080.
You can do this by requesting

```
localhost:8080/api
```
   - To otherwise test the app, use: `npm test`
   You can run jest with the test files to test the api endpoints

```
npm t __tests__/app.test.js
```

## Endpoints
The endpoint of /api will return a JSON of all endpoints available on the api and all possible queries.
