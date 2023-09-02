# Pinboard - A Stateless Notice Board Application powered by AWS

This project developed using AWS and ReactJS, designed to address the challenge of efficiently disseminating information by providing a cloud-based, serverless solution for posting and accessing notices in real-time. It empowers users to effortlessly post notices while others can search and retrieve relevant notices based on different parameters, thereby enabling real-time notifications to all users, and providing a user-friendly interface for enhanced efficiency.

## Objectives:

The project's primary objectives are:

- To enable real-time information dissemination and notice management for improved communication and productivity.
- To ensure data security, resilience, and cost-efficiency in information handling and retrieval.
- To leverage AWS services and ReactJS to provide a user-friendly, scalable, and fault-tolerant platform for efficient notice posting and retrieval in order to create a seamless and responsive experience for users.

## Goals

Pinboard aims to achieve the following goals:

- Enhance communication and collaboration within the organization or community through efficient notice sharing.
- Increase productivity by enabling quick access to relevant information and real-time updates.
- Ensure data security and resilience by implementing secure authentication and automated backups.
- Reduce operational costs associated with traditional notice board systems.
- Simplify notice management with a user-friendly interface and efficient features for posting and retrieval.
- Attain 100% automation in AWS Cloud infrastructure setup via CloudFormation templates, eliminating manual configuration.

## Built with:

- AWS Services: DynamoDB, Lambda functions, EC2, API Gateway, SNS, Backup
- Frontend: ReactJS

## Pre-requisites:

- Download and install [Node.js](https://nodejs.org/en/download)
- Clone this repository.
  - Backend:
    - Log into your AWS Account.
    - In the given `cloudformation/cloud-formation.yml` update the IAM Role as per your requirement. (Make sure your role has access to given resources.)
    - Create the stack using this template.
  - Frontend:
    - Type the following commands: `npm install` and `npm start`
