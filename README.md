<b />
<p align="center">

<h3 align="center"> 
    E-learning API with NestJS and TypeORM, using Postgres as database
</h3>
</p>


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Features](#features)
- [Project setup](#project-setup)
- [Installation & Setup](#installation--setup)
- [Setup Environment Variables](#Setup Environment Variables)
- [API Documentation](#api-documentation)

## Description

This is the backend for an advanced **E-Learning Platform**, built using **NestJS** and **PostgreSQL**, with additional
support for **MongoDB** (for blogs). The system provides authentication, course management, payments, chats, and various
other features for users and instructors.

## Features

- **Authentication**:
    - JWT-based authentication system with support for roles and permissions.
    - OAuth2 integration for social login (Google, Facebook, ...etc.).
    - Role-based access control (Admin, Instructor, User).
- **Course Management**:
    - Instructors can create courses with sections and lectures.
    - Students can enroll in courses and view them.
    - Tagging system for better course categorization.
- **Tags & Categories:**
    - Multi-level categorization (category, subcategory, tags), filter and search courses based on tags.
- **Analytics**:
    - Track user engagement, ratings, and feedback.
    - Identify trends in course participation and success.
- **Payments & Subscriptions**:
    - Payment gateway integration for course purchases and subscriptions by using **Stripe** and **PayPal**.
    - Subscription-based plans (monthly, yearly, special offers, ...etc.).
- **Blogs**:
    - Create and manage blogs with support for comments and likes.
    - MongoDB integration for storing blogs and comments.
- **Chats & Notifications**:
    - **Real-time chat system** using **WebSockets**.
    - **Groups Chat** for students and instructors.
    - Notifications for new courses, comments, likes, and messages.
    - **Redis** integration for caching and pub/sub.

## Tech Stack

- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL & MongoDB
- **Cache:** Redis
- **Payments:** PayPal & Stripe
- **Authentication:** JWT & OAuth
- **WebSockets:** Socket.io

## Installation & Setup

### Prerequisites

* Node.js (v18+)
* PostgreSQL (Latest Version)
* MongoDB (For Blogs)
* Redis (For Caching & WebSockets
* SMTP Server (For Sending Emails)
* WebSockets Server (Socket.io)
* Payment Gateway (Stripe & PayPal)
* OAuth2 Credentials (Google, Facebook, ...etc.)

### Installation
```bash
# Clone the repository
git clone https://github.com/ahmedhany14/e-learn-API.git

# Install dependencies
cd e-learn-API
npm install

# Set up environment variables
cp .development.env 

# Run database migrations
npm run migration:run

# Start the server
npm run start:dev
```
## Setup Environment Variables

```markdown
# Environment Variables

## Server Configuration

PORT=3000
NODE_ENV="development"
API_VERSION="v1"

## Database Configuration

DATABASE_NAME="your_database_name"
DATABASE_USER="postgres"
DATABASE_PASSWORD="your_database_password"
DATABASE_PORT=5432
DATABASE_HOST="localhost"
DATABASE_SYNCHRONIZE="false"
DATABASE_AUTO_LOAD_ENTITIES="true"

## JWT Authentication

JWT_SECRET="your_jwt_secret"
JWT_REFRESH_SECRET="your_refresh_secret"
JWT_EXPIRES_IN=3600 # Token expiry in seconds (1 hour)
JWT_REFRESH_EXPIRES_IN=86400 # Refresh token expiry (1 day)
JWT_TOKEN_AUDIENCE="localhost:3000"
JWT_TOKEN_ISSUER="localhost:3000"

## Mailer Configuration

MAILER_HOST="your_mailer_host"
MAILER_PORT="your_mailer_port"
MAILER_USER="your_mailer_user"
MAILER_PASSWORD="your_mailer_password"

## Password Reset Tokens

RESET_TOKEN_SECRET="your_reset_token_secret"
RESET_TOKEN_EXPIRES_IN=300 # Token expiry in seconds (5 minutes)

## Redis Configuration

REDIS_HOST="your_redis_host"
REDIS_PORT="your_redis_port"
REDIS_PASSWORD="your_redis_password"
REDIS_ACTIVE_TOKEN_EXPIRATION=300 # Expiry time for active tokens (5 minutes)
```

## API Documentation

- The API is documented using **Swagger**.
- After running the server, visit:

```
  http://localhost:3000/api
```