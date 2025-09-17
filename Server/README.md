# BookLet.AI Server

A powerful backend server for BookLet.AI that handles web scraping, AI summarization, and slide generation.

## Project Structure

```
├── src/
│   ├── app.js                 # Express app configuration
│   ├── controllers/           # Request handlers
│   ├── Db/                   # Database configuration
│   ├── middlewear/           # Custom middleware functions
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── services/             # Business logic services
│   ├── template/             # HTML templates
│   └── utils/                # Utility functions
├── exports/                  # Generated export files
├── outputs/                  # Generated slide outputs
└── server.js                # Server entry point
```

## Features

- Web scraping functionality for content extraction
- AI-powered text summarization
- Automatic slide generation
- PDF export capability
- User management system
- Booklet creation and management

## Main Components

### Controllers
- `bookletController.js` - Handles booklet creation and management
- `exportController.js` - Manages PDF and other export formats
- `scrapeController.js` - Controls web content scraping
- `slideController.js` - Manages slide generation
- `summarizeController.js` - Handles text summarization

### Services
- `AiSummary.js` - AI-powered text summarization service
- `scrapeService.js` - Web scraping service
- `slideService.js` - Slide generation service

### Models
- `bookletModel.js` - Booklet data model
- `UserModel.js` - User data model

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory with necessary environment variables.

3. **Start the Server**
   ```bash
   npm start
   ```

## API Routes

- `/api/booklet` - Booklet management
- `/api/export` - Export functionality
- `/api/scrape` - Web scraping endpoints
- `/api/slides` - Slide generation
- `/api/summarize` - Text summarization

## Output Directories

- `exports/` - Contains exported files with unique UUIDs
- `outputs/` - Stores generated slide images

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
