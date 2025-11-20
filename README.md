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


