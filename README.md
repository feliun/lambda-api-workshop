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