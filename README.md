# Historical Weather Data

A web application for exploring and analyzing historical weather data. The project consists of a Flask backend API and a modern frontend interface.

## Project Structure

```
.
├── frontend/       # Frontend application
├── backend/        # Flask backend API
├── docker-compose.yml
└── package.json
```

## Technologies Used

### Frontend
- Modern web framework
- TypeScript support
- Autosuggest functionality with highlighting
- Lodash utility library

### Backend
- Flask (Python)
- Development server with debug mode

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js and npm (for local development)

### Installation and Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd historical-weather-data
```

2. Start the application using Docker Compose:
```bash
docker-compose up
```

This will:
- Start the frontend development server on port 8080
- Start the backend Flask server on port 5000
- Set up hot-reloading for both frontend and backend development

### Accessing the Application

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## Development

### Frontend Development
The frontend application is configured with:
- TypeScript support
- Hot module replacement
- Volume mounting for real-time development

### Backend Development
The Flask backend runs in debug mode and supports:
- Auto-reloading on code changes
- Debug mode for detailed error messages
- API endpoints accessible on port 5000

## Docker Configuration

The project uses Docker Compose to manage both frontend and backend services:

- Frontend container:
  - Development-optimized build
  - Volume-mounted for live code updates
  - Node modules persistence

- Backend container:
  - Flask development server
  - Volume-mounted Python code
  - Debug mode enabled

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 