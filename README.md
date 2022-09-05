You will need to create two .env files for your project: .env.test and
.env.development. Into each, add PGDATABASE=<database_name_here>, with the
correct database name for that environment (see /db/setup.sql for the database
names). Double check that these .env files are .gitignored.

We'll have two databases in this project. One for real looking dev data and
another for simpler test data. Test and development database structures are
exact copies of each other.

A seed function is one that will remove any existing data from a database,
recreate the tables and repopulate it dynamically.
