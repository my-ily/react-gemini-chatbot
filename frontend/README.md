# Chatbot Application

A smart chatbot application built with React and Node.js using Google Gemini AI. Features a modern UI with conversation history management.

## Technologies Used

### Frontend
- React 19.2.0
- Tailwind CSS 3.4.18
- React Context API

### Backend
- Node.js
- Express 5.1.0
- CORS
- dotenv

### AI
- Google Gemini AI (Gemini 2.5 Flash)

### Development Tools
- Nodemon
- React Scripts

## Features

- Smart conversation with AI bot
- Auto-save conversations to localStorage
- Load saved conversations
- Delete individual or all conversations
- Start new chat while saving current
- Context understanding (uses last 10 messages)
- Light/Dark theme toggle
- Responsive design
- Modern UI with Tailwind CSS
- Message suggestions on new chat
- Loading indicator

## Project Structure

```
07-chatbot/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
│
├── chatbot/
│   ├── src/
│   │   ├── App.js        # Main component
│   │   ├── component/    # Components
│   │   │   ├── ChatbotInput.jsx
│   │   │   ├── ChatMessage.jsx
│   │   │   ├── SidebarContainer.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── hook/
│   │   │       └── useFetch.jsx
│   │   └── context/
│   │       └── ThemeContext.jsx
│   └── package.json      # Frontend dependencies
│
└── README.md
```

## Installation

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../chatbot
npm install
```

### 3. Setup Environment Variables
Create `.env` file in `backend` folder:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

### 4. Run Backend
```bash
cd backend
npm run dev
```
Server runs on: `http://localhost:5009`

### 5. Run Frontend
```bash
cd chatbot
npm start
```
App opens on: `http://localhost:3000`

## API Endpoints

- `GET /` - Check server status
- `GET /check-api` - Verify API key
- `POST /chat` - Send message to bot
- `GET /test-models` - Test available models

## Usage

1. Start new chat: Click "New Chat" button
2. Send message: Type in input field and press "Send"
3. Load conversation: Click any conversation from sidebar
4. Delete conversation: Hover over conversation and click delete button
5. Toggle theme: Use theme toggle button at top

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Google API Key

## Notes

- Conversations are auto-saved to localStorage
- Bot uses last 10 messages as context
- Ensure API key is correct in `.env` file
- Backend must run before Frontend

## License

Open source - free to use.
