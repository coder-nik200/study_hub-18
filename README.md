# Study Hub

Study Hub is a learning and resource-sharing platform designed to help students organize study materials, collaborate with others, and improve productivity.

## Features

* User authentication and profile management
* Upload and manage study materials
* Notes and document sharing
* Subject-wise resource organization
* Search and filter functionality
* Responsive user interface
* Collaboration and discussion support

## Tech Stack

### Frontend

* HTML
* CSS
* JavaScript
* React.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB

## Project Structure

```bash
study-hub/
│
├── client/             # Frontend files
├── server/             # Backend files
├── database/           # Database configuration
├── public/             # Static assets
├── src/                # Source code
├── package.json
└── README.md
```

## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/study-hub.git
```

### Navigate to the project directory

```bash
cd study-hub
```

### Install dependencies

```bash
npm install
```

## Run the Project

### Start the frontend

```bash
npm start
```

### Start the backend

```bash
npm run server
```

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## API Endpoints

| Method | Endpoint           | Description         |
| ------ | ------------------ | ------------------- |
| GET    | /api/resources     | Get all resources   |
| POST   | /api/resources     | Upload new resource |
| GET    | /api/users         | Get user details    |
| POST   | /api/auth/login    | User login          |
| POST   | /api/auth/register | User registration   |

## Future Improvements

* Real-time chat system
* AI-based study recommendations
* Dark mode support
* Video lecture integration
* Mobile application support

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit your changes
5. Push to your branch
6. Create a pull request

## License

This project is licensed under the MIT License.

## Author

Developed for educational purposes.
