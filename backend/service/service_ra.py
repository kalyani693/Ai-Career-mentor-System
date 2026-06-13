import pdfplumber
from fastapi import HTTPException
import io
import google.genai as genai
import os
from dotenv import load_dotenv
load_dotenv()

client=genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))


async def extract_text_from_pdf(file):

    if file.content_type != "application/pdf":
        raise ValueError("Invalid file type. Please upload a PDF file.")

    pdf_bytes = file.file.read()
    extracted_text=""

    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            text=page.extract_text()

            if text:
                extracted_text+=text+"\n"

        information=await extract_info_from_text(extracted_text)    
    return {"Information":information}           


async def extract_info_from_text(resume_text):
    model="gemini-2.5-flash"
    prompt=f"""Extract the following information from the resume text:\n\n1. Name\n
    2. Contact Information (Email, Phone Number)\n3. Summary or Objective\n
    4. Work Experience (Company Name, Job Title, Duration, Responsibilities)\n
    5. Education (Degree, Institution, Graduation Year)\n6. Skills\n7. Certifications\n
    8. Projects\n9. Languages\n10. Any other relevant information\n\nResume Text:\n{resume_text}\n\n
    Please provide the extracted information in a structured  json format."""

    try:
            response=client.models.generate_content(model=model,contents=prompt)
            data=response.to_json_dict()
            if data:
              return {"Information":data.get("candidates")[0].get("content").get("parts")[0]}
            else:
                 raise ValueError("Response not generated from gemini")
    except Exception as e:
            raise HTTPException(status_code=404, detail=f"{e}") 
            
        
async def generate_resume_report(extracted_info,job_type):
    model="gemini-2.5-flash"
    prompt=f"""Based on the extracted information from the resume and the job type, generate a comprehensive report that includes:\n\n
    1. A summary of the candidate's qualifications and suitability for the specified job type.\n
    2. Strengths and weaknesses of the candidate in relation to the job requirements.\n
    3. Recommendations for improving the resume to better align with the job type.\n
    4. Any potential red flags or concerns that employers might have based on the resume content.\n\n
    Extracted Information:\n{extracted_info}\n\nJob Type:\n{job_type}\n\n
    Please provide the report in a structured json format."""

    try:
            response=client.models.generate_content(model=model,contents=prompt)
            data=response.to_json_dict()
            if data:
              return {"Report":data.get("candidates")[0].get("content").get("parts")[0]}
            else:
                 raise ValueError("Response not generated from gemini")
    except Exception as e:
            raise HTTPException(status_code=404, detail=f"{e}")
    
