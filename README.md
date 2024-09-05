![image](https://github.com/user-attachments/assets/908ca10b-97bd-4455-8add-903e1d38d07c)  

![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![ECR](https://img.shields.io/badge/ECR-%23FF9900.svg?style=for-the-badge&logo=amazon-ecr&logoColor=white)
![ECS](https://img.shields.io/badge/ECS-%23FF9900.svg?style=for-the-badge&logo=amazon-ecr&logoColor=white)
![ECS](https://img.shields.io/badge/RDS-%23FF9900.svg?style=for-the-badge&logo=amazon-ecr&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![ChatGPT](https://img.shields.io/badge/LangChain-74aa9c?style=for-the-badge&logo=openai&logoColor=white)
![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## Table of Contents

- [About](#about)
- [How to Build](#how-to-build)
- [Credit](#credit)


## 🚀About
Taiwania is a Taiwanese dictionary for proverbs and everyday-language usages. Target users are those who wish to learn Taiwanese
but does not have Mandarin as a second language. Users can search by keyword:
![keyworkd search](https://github.com/user-attachments/assets/04a31bbf-044b-4034-8087-ae476bb0dbc8)

or filter by any of the tag he is interested; in the following case, "praise" is selected:
![filter search](https://github.com/user-attachments/assets/4fc452cb-42be-4f17-9e7a-32179a259ec3)


The data was scrapped from the [official Taiwanese dictionary](https://sutian.moe.edu.tw/zh-hant/) with python's Beautifulsoup and Pandas. The Mandarin 
and the definition were transalted using LangChain APIs with gpt-4 model. Data is stored in postgreSQL on Amazon's RDS.
Queries to the database uses express APIs. Backend is deployed with Amazon's ECR and ECS, using GitHub actions. For simplicty,
frontend is deployed on Vercel, which also supports continuous deployment. 

## 👾How to Build
Building the project include several steps:
1. [Scrap, clean, enhance the data](#Scrap-clean-and-enhance-the-data)
2. [Create postgreSQL on RDS and inject the data](#Create-postgreSQL-on-RDS-and-inject-the-data)
3. [Create AWS ECR](#Create-AWS-ECR-and-ECS)
4. [Create AWS ECS and deploy backend with CI/CD](#Create-AWS-ECS-and-deploy-backend-with-CI/CD)
5. [Run the frontend](#Run-the-frontend)


First clone the repo:

``` bash
git clone https://github.com/yosunlu/taiwania-backend.git
```
### Scrap, clean, and enhance the data
``` bash
# run the LangChain server
node ./llm-server/index.js

# move into the script folder
cd script 

# scrap the data and call LangChain APIs to translate Mandarin to English; a csv file will be generated
python script.py 

```
### Create postgreSQL on RDS and inject the data
1. Create postgreSQL database on AWS, and inbound rule for the security group with port 5432
2. Create a table named "taiwania" with PGadmin or psql
3. Import the data
``` bash
# connect to the database
psql -h taiwania.chakcosmc22q.us-east-1.rds.amazonaws.com -U postgres -d taiwania

# import with psql because pgAdmin does not support imporint with "|" as delimiter 
\copy public.words (id, phrase, pronounciation, definition, tags, audiourl) \
FROM '<link-to-data>/data.csv' DELIMITER '|' CSV QUOTE '"' ESCAPE '''';
```
### Create AWS ECR and ECS
``` bash
# move to express folder
cd express-backend

# Build Docker image
docker build -t taiwania .
```
- Ensure that you are logged into AWS using the CLI (aws sts get-caller-identity to check).
``` bash
# Use the AWS CLI to authenticate your local Docker client with your ECR registry
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/taiwania

# Tag the image to match the ECR repository you created
docker tag taiwania:latest <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/taiwania:latest

# Push the Docker image to your ECR repository
docker push <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/taiwania:latest

```
### Create AWS ECS and deploy backend with CI/CD
1. Create a new ECS cluster
  - Use Fargate as the launch type when creating the cluster.
2. Create a new ECS task definition
  - In the task definition, specify the ECR image URL (e.g., <your-aws-account-id>.dkr.ecr.us-east-1.amazonaws.com/taiwania:latest).
  - Add the required environment variables by copying them from your local environment (postgreSQL keys).
3. Create a new ECS service
  - Link the task definition you just created.
  - Ensure that the security group allows all traffic on port 4000.
    - If necessary, create a new security group that permits inbound traffic from 0.0.0.0/0 on port 4000.
4. Service failure troubleshooting (M1/Mac)
  - If the ECS service fails due to an architecture mismatch (e.g., ECS runs on x86 but the image was built on an M1/ARM-based Mac), update the Dockerfile to specify the target architecture:
dockerfile
``` bash
 FROM --platform=linux/amd64 node:18
```
 - This ensures that the image is compatible with ECS.
  
5. Add gitHub secrets and update deploy.yml for CI/CD

### Run the frontend
``` bash  
# first clone the frontend repo
git clone https://github.com/yosunlu/taiwania-frontend.git
```
Next, go to your ECS service -> tasks -> networking; copy the public IP and paste it to the .env file, then run
  ``` bash
  npm run dev
  ```

## Credit 
[Official Taiwanese dictionary](https://sutian.moe.edu.tw/zh-hant/)
