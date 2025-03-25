# Phoenix Roleplay Scripts

This directory contains utility scripts for database management, testing, and project diagnostics.

## Database Scripts

- **setup-db.ts** - Initial database setup and configuration
- **init-db.ts** - Initialize the database with required tables and schema
- **seed-db.ts** - Populate the database with initial data
- **test-db.ts** - Test the database connection and configuration
- **test-db-simple.js** - Simple Node.js version of database test

## Admin Scripts

- **create-admin.ts** - Create an admin user in the database

## Diagnostics & Utilities

- **diagnose.bat** - Batch file to run the diagnostic tool
- **diagnose-build.js** - JavaScript diagnostic tool to check for common issues
- **fix-now.bat** - Quick fixes for common development environment issues
- **start-phoenix.bat** - Start the Phoenix Roleplay development server

## Usage

Most TypeScript scripts can be run using:

```bash
npx tsx scripts/script-name.ts
```

Or using the npm scripts defined in package.json:

```bash
npm run test:db
npm run create:admin
npm run seed:db
npm run init:db
```

Batch files can be executed directly from Windows Explorer or command prompt.
