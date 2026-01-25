from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from analysis import analyze_year


app= FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all origins
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if file.content_type !="text/csv":
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")
    
    try:
        df = pd.read_csv(file.file)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid CSV file.")
    results = analyze_year(df)
    return results

@app.get("/")
def home():
    return{"message": "Goodreads Wrapped API is running"}

