from fastapi import APIRouter,UploadFile,File,Depends,HTTPException,Form,status
from database.schemas import getdb,users_resume
from model import _registration,level
from service.service_resume_analysis import extract_text_from_pdf,generate_resume_report,resume_report,extracted_res_data
from service.service_rodmap import generate_roadmap
from service.service_practicequestions import frequently_asked_questions
from sqlalchemy.orm import session
from typing import Annotated,Optional,Any
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
  highest class is previously completed class ex(B.Tech 2nd year etc)
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

@router.post("/registration",response_model=dict[str, str],status_code=status.HTTP_201_CREATED)
async def user_registration(db:dependancy,info:str=Form(...,description=info_description),file:Annotated[Optional[UploadFile], None] = File(None)): #'...' in File means required
    #we are unable to take two differant types of data in one request so we are taking info as string and convert it to pydantic
    #  model mannually
    #convert mannually info to pydantic model
    try:
      user_info=_registration.model_validate_json(info)
    except Exception as e:
        raise HTTPException(status_code=422,detail=f"Validation error:{str(e)}")
    return await auth.registation(user_info,db,file)

@router.post("/login",response_model=dict[str, str],status_code=status.HTTP_200_OK)#post
async def login_user(db:dependancy,credential:OAuth2PasswordRequestForm=Depends()):
        return await auth.user_login(credential,db)

      

@router.post("/resume_analyzer",description="Upload a updated Resume(if not uploaded earlier) For accurate analysis."
             ,response_model=dict[str, str | Any | None],status_code=status.HTTP_200_OK)
async def resume_analyzer(db:dependancy,user=Depends(check_user), file: Annotated[Optional[UploadFile],None] = File(None)):
    Career_goal=user.Career_goal
    res_report=resume_report(db,user)
    if not res_report and not file:
        raise HTTPException(status_code=404,detail="Resume is not Found. Please Upload a updated Resume")
    if not res_report:
      extracted_information= await extract_text_from_pdf(file)
      res_report=await generate_resume_report(extracted_information,Career_goal)
    return {"Resume Analysis Report":res_report}


@router.post("/Roadmap_Generator",description="Generates detailed Roadmap based on Career Goal",
             response_model=dict[str, str | None],status_code=status.HTTP_200_OK)
async def roadmap_generator(db:dependancy,user=Depends(check_user), file: Annotated[Optional[UploadFile],None] = File(None)):

    extracted_data=extracted_res_data(db,user) 
    if not extracted_data:
      extracted_data= await extract_text_from_pdf(file)
    roadmap=await generate_roadmap(extracted_data,user.Career_goal)
    return {"Roadmap":roadmap}
            
    
@router.post("/Practice_questions",description="Provides Top 10 frequently asked questions with personalised answers",
             response_model=dict[str, str | None],status_code=status.HTTP_200_OK) 
async def practiceQuestions(db:dependancy,level:level,user=Depends(check_user)): 
    top_questions=frequently_asked_questions(level,user,db)
    return {"top_questions":top_questions}



