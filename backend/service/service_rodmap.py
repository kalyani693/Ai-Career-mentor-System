from fastapi import HTTPException
from dotenv import load_dotenv
from service.service_ra import client
load_dotenv()

async def generate_roadmap(job_type):
    model="gemini-2.5-flash"
    prompt=f"""context: using job type create a detailed roadmap, roadmap should start from 
    basic skills to ultimate end goal. also include average time required to complete each step/course of roadmap.
    role: act as a roadmap generator. 
    format: return the response in json format like {
         'step1':[skill_name,average_time_required],
         'step2':[skill_name,average_time_required],
         'etc...':[]
    }
    return the response in structured json format without any additional text.
     job_type={job_type}
""" 
    try:
            response=client.models.generate_content(model=model,contents=prompt)
            data=response.to_json_dict()
            if data:
              return {"Roadmap":data.get("candidates")[0].get("content").get("parts")[0]}
            else:
                 raise ValueError("Response not generated from gemini")
    except Exception as e:
            raise HTTPException(status_code=404, detail=f"{e}") 
            