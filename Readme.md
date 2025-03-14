# MediVault

MediVault is a secure cloud-based medical report management system. It allows hospitals and users to store, access, and manage medical records efficiently.

## Features

- User authentication with JWT
- Secure medical report uploads (PDFs stored in Cloudinary)
- Fetch and view reports sorted by date
- Search and filter reports by disease name
- React Native mobile application for easy access

## Tech Stack

### Backend:

- Node.js with Express.js
- MongoDB with Mongoose
- Cloudinary for file storage
- JSON Web Token (JWT) authentication
- Multer for handling file uploads
- Bcrypt for password hashing

### Frontend:

- React Native
- Expo
- Axios for API requests
- React Navigation

## Installation and Setup

### Clone the Repository

```sh
git clone https://github.com/RaidenOM/MediVault.git
cd MediVault
```

### Install Dependencies

```sh
cd MediVault
npm install
```

### Run the project

```sh
expo start
```

## API Endpoints

| Method | Endpoint    | Description                          | Auth Required |
| ------ | ----------- | ------------------------------------ | ------------- |
| POST   | `/register` | Register a new hospital              | No            |
| POST   | `/login`    | Authenticate user and return a token | No            |
| GET    | `/profile`  | Get logged-in user's details         | Yes           |
| GET    | `/reports`  | Get all medical reports of user      | Yes           |
| POST   | `/reports`  | Upload a new medical report (PDF)    | Yes           |
