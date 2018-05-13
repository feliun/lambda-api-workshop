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
