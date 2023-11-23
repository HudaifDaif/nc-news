# Northcoders News API

Currently hosted at: https://newsit-2qbt.onrender.com
## Summary
This project aims to mimic a service similar to Reddit ( a network where articles can receive both positive and negative votes). 

## Installation

### Cloning the repository 

Run the following command in your terminal to clone the repository in the current directory: 

```git clone https://github.com/HudaifDaif/nc-news.git```

### Creating environment variables

In order to be able to run this project locally, you will need to create the environment variables required to connect to the correct postgres database. This will be achieved by utilising the npm dotenv package. The steps are as follows:

- Create two files in the root directory: `.env.development` and `.env.test`
- Within each file create the corresponding `PGDATABASE` environment variable (please see `.env-example`). The variables required are:
    - `.env.development` - For connecting to our development database.
        - `PGDATABASE=nc_news`
    - `.env.test` - For connecting to our testing database.
        - `PGDATABASE=nc_news_test`

### Installing dependencies

Once these steps are completed, run `npm install` to install all of the required packages for this project.

### Developer notes

In order to run test, you will need to install jest, jest-extended, jest-sorted and supertest as devDependencies. We also recommend installing husky to take advantage of the git hooks, ensuring you are not committing failing code. This can be achieved by running the following:

```npm install jest jest-extended jest-sorted supertest -D```

## Minimum requirements
- Node - v20.8.1
- Postgres v15.4