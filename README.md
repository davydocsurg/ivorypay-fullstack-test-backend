# IvoryPay Test Backend

Welcome to the IvoryPay Test Backend repository! This README provides an overview of the project, its features, setup instructions, and more.

## Table of Contents

-   [Project Overview](#project-overview)
-   [Personas](#personas)
-   [Features](#features)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Configuration](#configuration)
-   [API Documentation](#api-documentation)
-   [Database](#database)

## Project Overview

This is a Node.js TypeScript application that serves as the backend for the [IvoryPay Test Frontend](https://github.com/davydocsurg/ivorypay-test-frontend). It provides endpoints and functionalities required for both User and Admin personas to interact with the application.

## Personas

### User

A regular user with an account and a wallet can:

-   Accept invitations from their email.
-   Log in using their registered credentials.
-   Deposit funds into their wallet.
-   Transfer funds to other users.
-   Withdraw funds from their wallet.
-   Log out securely.

### Admin

An admin can:

-   Accept invitations, as an admin.
-   Log in using their admin credentials.
-   Manage users and admins by:
    -   Listing all users and admins.
    -   Inviting new users as regular users or admins.
    -   Disabling and enabling users and admins based on their status.

## Features

-   User Registration: Register as a new user with a unique email.
-   User Authentication: Log in using registered credentials.
-   Invitation Acceptance: Accept invitations sent to your email.
-   Wallet Management: Deposit, transfer, and withdraw funds from your wallet.
-   Admin Controls: Manage users and admins with administrative privileges.

## Getting Started

Follow these steps to set up and run the IvoryPay Test Backend on your local machine.

### Prerequisites

-   Node.js and npm (Node Package Manager) installed on your system.
-   PostgreSQL database configured and running.

### Installation

1. Clone the repository:

```bash
git clone https://github.com/davydocsurg/ivorypay-test-backend.git
```

2. Navigate to the project directory:

```bash
cd ivorypay-test-backend
```

3. Install dependencies

```bash
npm install
```

> OR

```bash
yarn install
```

### Configuration

-   Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env
```

> Update .env with your environment-specific configuration, such as database credentials, API keys, and other settings.

-   Set up the PostgreSQL database according to your configuration.

### Running with Docker

Alternatively, you can run the IvoryPay Test Backend using Docker. Here are the steps:

Run this command to get started:

```bash
yarn docker:dev
```

## API Documentation

The API documentation for the IvoryPay Test Backend is available in the Swagger format. To access the documentation, run the backend server and visit the `/api/v1/docs` endpoint in your web browser or here at: [https://ivorypay-test-backend.onrender.com/api/v1/docs](https://ivorypay-test-backend.onrender.com/api/v1/docs).

## Database

The IvoryPay Test Backend utilizes a PostgreSQL database to store user and transaction data. The database schema and entities are defined using the TypeORM library.
