# lambda-api-workshop
A workshop to learn how to build secure APIs using AWS lambdas, JWT and the serverless framework

## Step 0: Setup

```
npm i -g serverless
sls create -t aws-nodejs -p auth-api
ls auth-api // Inspect your files here
npm install --save bcryptjs bcryptjs-then jsonwebtoken //authentication/authorization methods & password encryption
npm install --save-dev serverless-offline // development setup
```

## Step 1: Adding our database

1. Create a db and obtain a url like `mongodb://<dbuser>:<dbpassword>@ds119160.mlab.com:19160/<dbname>`
2. `npm i mongodb --save`
3. `cat db.js`
4. `cat secrets.json`
5. `cat serverless.yml`
6. `git checkout step-2`

## Step 2: Adding users functions

1. `cat serverless.yml`
2. `ls ./user`
3. `git checkout step-3`

## Step 3: Adding authentication

1. `ls ./auth`
2. `git checkout step-4`

## Step 4: Adding authorisation

1. `cat serverless.yml`
2. `cat ./auth/AuthHandler`
3. `cat ./auth/controller`
4. `git checkout step-5`

## Step 5: Using authorisation

1. `cat ./auth/AuthHandler`
2. `cat ./auth/controller`
3. `git checkout step-6`
