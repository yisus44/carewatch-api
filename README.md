<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Repo for final college proyect

## Installation

```bash
$ npm install
```

## Before running the app in dev mode

1. Rename .env.copy to .env to get the needed environment variables, if you find one missing or its a sensetive data, please send a mail to jesusadrian1953.1@gmail.com

2. Run the database container ready using:

```bash
$ docker compose up -d
```

3. Execute database migrations running

```bash
$ npm run typeorm:run-migrations
```

4. Configure aws credentials to be able to send emails. Double check the steps in this link https://docs.aws.amazon.com/ses/latest/dg/create-shared-credentials-file.html

5. Install the stripe cli to be able to test webhook. Double check the steps in this link https://stripe.com/docs/stripe-cli
   If you need to test webhook, also follow this guide https://stripe.com/docs/webhooks/test then use the webhook secret provided by the cli to fill the environment variable STRIPE_WEBHOOK_SECRET. Take into account the port you are running, preferly running:
   $ stripe listen --forward-to localhost:3000/stripe/webhook

## Running the app

```bash
# development
$ npm run start

# dev
$ npm run dev

# production mode
$ npm run start:prod
```

## Creating migrations

1. Run the command:

```bash
$ sudo npm run typeorm:generate-migration --name=NameOfTheMigration
```

2. Go to the folder /migrations, search for you migration and change the neccesary SQL command.

3. Now you can run

```bash
$ npm run typeorm:run-migrations
```

## Reverting migrations

1. Run the following command to undo the last migration

```bash
$ typeorm:revert-migration
```

Note: You can delete a migration file without running any command on your terminal, the configuration takes care of only running the migrations that are present in the /migration folders

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
