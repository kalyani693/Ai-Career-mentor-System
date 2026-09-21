from fastapi import HTTPException
from dotenv import load_dotenv
from service.core_services import ask_llm
load_dotenv()

async def generate_roadmap(resume_data,job_type):
    prompt=f"""action: using job type and resume_data, create a personalised detailed roadmap, roadmap should start from 
    basic skills to ultimate end goal. also include average time required to complete each step/course of roadmap.
    role: act as a roadmap generator. 
    format: return the response in List[json] format like-> 
         [
            {{
               "step":int,
               "Topic":"",
               "Why_this_topic_is_required":"",
               "Prerequisites":"",
               "Recommended_learning_areas":"",
               "Estimated_completion_time":""
               }},

          etc....     ]
    return the response in structured json format without any additional text.
    dont ask any follow up questions.
    resume_data={resume_data}
     job_type={job_type}
""" 
    try:
         response=ask_llm(prompt)
         return response
    except Exception as e:
            raise HTTPException(status_code=404, detail=f"{e}") 
            