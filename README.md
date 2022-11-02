# NorthCoders News

This project is a RESTful API for accessing application data programmatically.
The intention here is to mimic the API of a real world backend service (such as
reddit - an American social news aggregation, content rating, and discussion
website) which should provide this information to the front end architecture.

Various HTTP requests can be performed to [endpoints](/endpoints.json) for
articles, comments and users.

A hosted version of the API can be found on
[Heroku.com](https://student-coders-news.herokuapp.com/).

The front-end repository of the "NorthCoders News" project [https://github.com/petrovainbritain22/nc-news](https://github.com/petrovainbritain22/nc-news).

**The published website you can find on [https://ncews.netlify.app](https://ncews.netlify.app).**

# About the project

It is created as a part of studying at
[Northcoders Bootcamp](https://northcoders.com/) in July-October 2022.

## Technologies

```
const featuresOfProject = {

    programming_language:   "Javascript",
    runtime_environment:    "Node.js",
    database:               "PostgreSQL",
    web_app_framework:      "Express.js",
    programming_style:      "Test Driven Development"

}
```

## Instructions

To be able to use the repository on your local computer do the following steps:

### 1. Clone the repository

Detailed instructions how to clone read [here](/instructions/how-clone.md)

### 2. Install

Run `npm install` - this will install all the dependencies and devDependencies
in your `package.json` file.

#### Packages used in the project:

**Node Package Manager** is a registry of open source JavaScript libraries

- `npm init -y` Initialise NPM in a project

**Tests**

- `npm i -D jest` Unit testing
- `npm i -D supertest` Integration testing

**Database**

if you use node >= 14.x, you will need to install pg@8.2.x or later.

- `npm i pg` Install porstgreSQL.

- `npm i pg-format` Literals for operating with multiple data in sql queries.

**Server**

- `npm i express`
- `npm i -D nodemon` Will ensure that the server gets restarted any time a
  JavaScript file is changed and saved. Use `npm run dev` to start the server.

**Environmental Variables**

- `npm i dotenv` Loads environment variables from a .env file into process.env.

**Husky**

Husky will ensure that only working code is committed. It will run the tests
before each commit.

- `npm i -D husky`
- `npm set-script prepare "husky install"` Enter this commend if there isn't
  "prepare script" in the package.json.
- `npm run prepare`

### 3. Seed local database.

We have two databases in this project. One for real looking dev data and another
for simpler test data. Test and development database structures are exact copies
of each other.

You will need to create two `.env` files for the project. Enter in terminal

- `echo "PGDATABASE=nc_news" > .env.development`
- `echo "PGDATABASE=nc_news_test" > .env.test`

For creating the databases and seeding the databases (A seed function is one
that will remove any existing data from a database, recreate the tables and
repopulate it dynamically) you use the npm scripts that are in the
`package.json`.

- `npm run seed` and `npm run setup-dbs`

## Diagrams

To have an image of the future website have a look at the diagrams

**Use case diagram** demonstrates the different ways that a user might interact
with a system (["draw io"](https://app.diagrams.net/) is a tool for drawing
diagrams)

![use_case_diagram](/images/development/use_case_diagram.png)

**Entity relationship diagram** is a visual representation of a system’s data

![entity_relationship_diagram](/images/development/entity_relationship_diagram.png)
