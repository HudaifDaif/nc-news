# Northcoders News API

In order to be able to run this project locally, you will need to create the environment variables required to connect to the correct postgres database. This will be achieved by utilising the npm dotenv package. The steps are as follows:

- Create two files in the root directory: `.env.development` and `.env.test`
- Within each file create the corresponding `PGDATABASE` environment variable (please see `.env-example`). The variables required are:
    - `.env.development` - For connecting to our development database.
        - `PGDATABASE=nc_news`
    - `.env.test` - For connecting to our testing database.
        - `PGDATABASE=nc_news_test`

Once these steps are completed, run npm install to install all of the required packages for this project.