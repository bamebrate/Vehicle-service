# Vehicle Service API

This project is a simple web service that provides CRUD-style API access to vehicle data stored in a PostgreSQL database. It is designed to demonstrate best practices in API development, including validation, testing, and error handling.

---

## Table of Contents
1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [API Endpoints](#api-endpoints)
5. [Testing](#testing)
6. [Architecture Overview](#architecture-overview)
7. [Future Enhancements](#future-enhancements)

---

## Features
- **CRUD Operations**: Create, Read, Update, and Delete vehicle records.
- **Validation**: Ensures all inputs are valid before processing.
- **Error Handling**: Handles invalid JSON, validation errors, and database constraints gracefully.
- **Comprehensive Testing**: Unit and integration tests with Jest and Supertest.
- **PostgreSQL Integration**: Fully utilizes PostgreSQL for persistent storage.

---

## Prerequisites
1. **Node.js**: Version 14 or higher.
2. **PostgreSQL**: Version 13 or higher.
3. **NPM**: Comes with Node.js, used to manage dependencies.

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure the Environment
- Edit the existing `env.json` file in the root directory with your own postgress credentials:

### 4. Setup the Database
Run the SQL script to create the necessary table:
```bash
npm run setup
```

### 5. Start the Application
```bash
npm start
```
The service will run at `http://localhost:3000`.

### 6. Run Tests
```bash
npm test
```

---

## API Endpoints

### 1. Get All Vehicles
- **Endpoint**: `GET /vehicle`
- **Response**: List of all vehicles in the database.

### 2. Get Vehicle by VIN
- **Endpoint**: `GET /vehicle/:vin`
- **Response**: Details of the vehicle with the specified VIN.

### 3. Create a Vehicle
- **Endpoint**: `POST /vehicle`
- **Request Body**:
  ```json
  {
      "manufacturer_name": "Ford",
      "description": "Reliable car",
      "horse_power": 1200,
      "model_name": "retro",
      "model_year": 2020,
      "purchase_price": 200000,
      "fuel_type": "Gasoline"
  }
  ```
- **Response**: The created vehicle.

### 4. Update a Vehicle
- **Endpoint**: `PUT /vehicle/:vin`
- **Request Body**: Same as the Create request.
- **Response**: The updated vehicle.

### 5. Delete a Vehicle
- **Endpoint**: `DELETE /vehicle/:vin`
- **Response**: No content (204 status).

### Error Responses
- `400 Bad Request`: Invalid JSON format.
- `422 Unprocessable Entity`: Validation errors or duplicate VIN.
- `404 Not Found`: VIN does not exist.

---

## Testing
- **Command**: `npm test`
- Tests are written using **Jest** and **Supertest** and cover:
  - CRUD operations
  - Input validation
  - Error handling

---

## Architecture Overview
1. **Backend**: Node.js with Express.
2. **Database**: PostgreSQL with a `Vehicle` table.
3. **Testing**: Jest and Supertest for unit and integration tests.

---

## Future Enhancements
1. **Authentication**: Secure the API with user authentication and authorization.
2. **Pagination**: Add pagination for `GET /vehicle` to handle large datasets.
3. **Search Functionality**: Allow filtering vehicles by attributes like manufacturer or model year.
4. **Docker Support**: Provide a Dockerfile for easy setup and deployment.

---

This README is designed to help both developers and maintainers understand the setup, functionality, and future directions of the project.
