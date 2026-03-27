
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
import PyPDF2
import docx
import os
import io

# ── Load API key from .env file ──────────────────────────
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

# ── Create the FastAPI app ───────────────────────────────
app = FastAPI()

# ── Allow frontend to communicate with backend ───────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Extract text from PDF ────────────────────────────────
def extract_pdf_text(file_bytes):
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        return ""

# ── Extract text from Word file ──────────────────────────
def extract_docx_text(file_bytes):
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        return ""

# ── Home route to confirm backend is running ────────────
@app.get("/")
def home():
    return {"message": "Document Assistant Backend is running!"}

# ── Main upload endpoint ─────────────────────────────────
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Check file type
    if not file.filename.endswith((".pdf", ".docx")):
        return {
            "error": "Wrong file type. Please upload a PDF or Word (.docx) file only."
        }

    # Read the uploaded file
    file_bytes = await file.read()

    # Extract text based on file type
    if file.filename.endswith(".pdf"):
        text = extract_pdf_text(file_bytes)
    else:
        text = extract_docx_text(file_bytes)

    # Check if text was extracted successfully
    if not text.strip():
        return {
            "error": "Could not extract text from this document. Please try another file."
        }

    # Send extracted text to Gemini API
    prompt = f"""You are a professional document analyst.
Analyse the following document and provide a structured response with these sections:

1. **Title** - The title of the document
2. **Author** - The author name if found, otherwise write "Not found"
3. **Summary** - A clear summary of the main content in 3 to 5 sentences
4. **Key Points** - List the most important points from the document

Document content:
{text[:3000]}"""

    try:
        response = model.generate_content(prompt)
        analysis = response.text
    except Exception as e:
        return {
            "error": f"AI analysis failed. Please try again. Details: {str(e)}"
        }

    # Return results to the frontend
    return {
        "filename": file.filename,
        "analysis": analysis
    }