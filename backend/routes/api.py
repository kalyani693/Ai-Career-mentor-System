from fastapi import APIRouter,UploadFile,File,Depends,HTTPException,Form
from database.schemas import getdb,users_resume
from model import _registration
from service.service_resume_analysis import extract_text_from_pdf,generate_resume_report
from service.service_rodmap import generate_roadmap
from sqlalchemy.orm import session
from typing import Annotated,Optional
from database.schemas import getdb
from security.registration import authentication,check_user
from fastapi.security import OAuth2PasswordRequestForm

auth=authentication()
dependancy=Annotated[session,Depends(getdb)]
router=APIRouter()

@router.get("/health")
def health_check():
    return

@router.get("/")
def home():
    return "Wellcome to AI CAREER MENTOR SYSTEM"



info_description='''
  Enter information in json format. all fields are compulsory!! \n
  example:\n
    {
    "Full_Name":"str",
    "Username":"str",
    "Email":"str",
    "Password":"str" (#8 charaters),
    "Highest_Class":"str",
    "Career_goal":"str",
    "University":"str",
    "CGPA":float
    }

'''


@router.post("/registration")
async def user_registration(db:dependancy,info:str=Form(...,description=info_description),file:Annotated[Optional[UploadFile], None] = File(None)): #'...' in File means required
    #we are unable to take two differant types of data in one request so we are taking info as string and convert it to pydantic
    #  model mannually
    #convert mannually info to pydantic model
    try:
      user_info=_registration.model_validate_json(info)
    except Exception as e:
        raise HTTPException(status_code=422,detail=f"Validation error:{str(e)}")
    return await auth.registation(user_info,db,file)

@router.post("/login")
async def login_user(db:dependancy,credential:OAuth2PasswordRequestForm=Depends()):
        return await auth.user_login(credential,db)
    
@router.post("/resume_analyzer")
async def resume_analyzer(user=Depends(check_user), file: UploadFile = File(...)):
    Career_goal=user.Career_goal
    extracted_information= await extract_text_from_pdf(file)
    report=await generate_resume_report(extracted_information.get("Information"),Career_goal)
    return {"Resume Analysis Report":report.get("Report")}


@router.post("/Roadmap_Generator")
async def roadmap_generator(user=Depends(check_user), file: UploadFile = File(...)): 
    extracted_information= await extract_text_from_pdf(file)
    roadmap=await generate_roadmap(extracted_information.get("Information"),user.Career_goal)
    return {"Roadmap":roadmap.get("Roadmap")}
            
    