from fastapi import HTTPException
from service.core_services import ask_llm
from dotenv import load_dotenv
import json
from database.schemas import users_resume
from sqlalchemy import select

#object
load_dotenv()


async def extract_summary_from_Resumetext(resume_text:str):
    prompt=f"""Extract the following information from the  provided resume text. 
    do not ask any follow up questions.
    Resume Text:{resume_text}
    response format should be strictly json like 
    {{
    "Name":extracted_name,
    "Contact Information":{{"Email":extracted_email,
                            "Phone Number":extracted_emailextracted_phone no}},
    "Summary or Objective" :Summary or Objective ,
    "Work Experience":{{Company Name, Job Title, Duration, Responsibilities}} ,
    "Education":{{Degree, Institution, Graduation Year}} ,
    "skills":[],
    "Certifications" :[],
    "Projects":[]  ,
    "languages":[],
    "Any other relevant information" :information                
    }}
    """
                       
    try:
      response=ask_llm(prompt)
      info=response.strip()
      
      if info.startswith("```json") or info.endswith('```'):
                lines=info.split('\n')
                op=lines[1:-1]
        
                return json.dumps(op) 
      return info  #["Information"]
    except Exception as e:
            raise HTTPException(status_code=404, detail=f"Error in generating response:{e}")                     
            
        
async def generate_resume_report(extracted_info,job_type):
    #openai models

    prompt=f"""context: I am a student, I am searching for jobs and internships. i want detailed analysis of my resume.
    role: act as a senior report generator. You are expert report generator.
    action: Based on the extracted information from the resume and the job type, generate a comprehensive report that includes:\n\n
    response format should same as
      {{
        "Summary":your answer(string),\n
        "ATS_Score":score(in percentage),\n
        "Strengths":[your answer],\n
        "Weaknesses":[your answer],\n
        "Missing_skills":[your answer],\n
        "Recommendations":your answer
        }}
        summary of the candidate's qualifications and suitability for the specified job type. in 1 to 2 sentence.
       strength and  weaknesses(of the candidate in relation to the job requirements.) comma seperated in a list \n
       Recommendations for improving the resume to better align with the job type.\n
       

    if the resume data matches 40% or above with job type then provide detailed summary. else
      just answer in a simple way like your resume is not applicable for this role, with the detailed reason of why not matches.\n\n 
      like ->{{"Summary":your answer}}
    
    do not hallucinate and dont ask any follow up questions.  
    Extracted Information:{extracted_info}\n Job Type:{job_type}\n\n
    """

    try:
      response=ask_llm(prompt)
      return response
    except Exception as e:
            raise HTTPException(status_code=404, detail=f"Error in generating response:{e}") 
    
def resume_report(db,user): #get from database
    user_file=db.scalars(select(users_resume).where(users_resume.Username==user.Username)).first()
    if user_file:
        if user_file.Resume_report:
            return user_file.Resume_report
        else:
            return None
    else:
        raise HTTPException(status_code=500,detail="Error in fetching users_file_info")
    
def extracted_res_data(db,user):  # get from database
    user_file=db.scalars(select(users_resume).where(users_resume.Username==user.Username)).first()
    if user_file:
        if user_file.Extracted_text:
            return user_file.Extracted_text
        else:
            return None
    else:
        raise HTTPException(status_code=500,detail="Error in fetching users_file_info")
