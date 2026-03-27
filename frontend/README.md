 Document Assistant

An AI-powered document analysis web application built for the Feyti Medical Group Software Development Internship Assignment.

 What It Does

- Upload a PDF or Word (.docx) document
- Automatically extracts text from the document
- Uses Google Gemini AI to analyze the document
- Identifies the title, author, summary and key points
- Displays results on a clean, simple web interface
- Shows error messages for unsupported file types

 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Python, FastAPI |
| AI / LLM | Google Gemini API (gemini-1.5-flash) |
| Deployment | Vercel (frontend), Render (backend) |
 
 Project Structure

document-assistant/
├── frontend/          # Next.js frontend application
│   └── app/
│       └── page.tsx   # Main page UI
├── backend/           # Python FastAPI backend
│   ├── main.py        # API endpoints and logic
│   ├── requirements.txt
│   └── .env           # API keys (not included in repo)
└── README.md
```

How to Run Locally
 Backend
bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at: http://127.0.0.1:8000

 Frontend
bash
cd frontend
npm install
npm run dev

Frontend runs at: http://localhost:3000

Environment Variables

Create a `.env` file inside the `backend` folder:
```
GEMINI_API_KEY=your_gemini_api_key_here

Features

- PDF and Word document support
- AI-powered summarisation using Google Gemini
- Clean and responsive UI
- Error handling for wrong file types
- Loading spinner during analysis

 Built By

Mila Samantha Likiya  
Year Two, BSc Computer Science — Makerere University  
samanthamila7@gmail.com