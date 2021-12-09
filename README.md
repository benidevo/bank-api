# Bank API

## Description
A RESTFul API for a bank app that enables users to create a bank account (either savings or current account), deposit and withdraw money from their account and also transfer money to other accounts.

- [Postman API Documentation](https://documenter.getpostman.com/view/15138887/UVR4MUjR)

![Screenshot](bankAPI.png?raw=true "Bank API")
## Technologies 

The following technologies were used in this project:

- [JavaScript](https://www.javascript.com/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [MongoDB](https://www.mongodb.com/)


## Requirements

Before starting, you need to have [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/) installed. Also ensure to create a .env file in the root directory of the project, and provide the following information:

MONGO_URI: The URI of your MongoDB database.
JWT_SECRET: The secret key used to sign the JWT.
USERNAME: Mail server email address.
PASSWORD: Mail server password.

Kindly ensure that you are in the root directory before running the following commands.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run server
