from fastapi import APIRouter,UploadFile,File,Depends,HTTPException,Form,status
from database.schemas import getdb
from model import _registration,level,credential
from service.resume_analysis import generate_resume_report,resume_report,extracted_res_data
from service.rodmap import generate_roadmap
from service.core_services import extract_text_from_pdf
from service.practicequestions import frequently_asked_questions
from sqlalchemy.orm import session
from typing import Annotated,Optional,Any
from database.schemas import getdb
from service.registration import authentication,check_user
from fastapi.security import OAuth2PasswordRequestForm

auth=authentication()
dependancy=Annotated[session,Depends(getdb)]
router=APIRouter()

@router.get("/health")
def health_check():
    return None

@router.get("/")
def home():
    return "Wellcome to AI CAREER MENTOR SYSTEM"


#authentication and registration routes

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
    return await auth.registration(user_info,db,file)

@router.post("/login",response_model=dict[str, str],status_code=status.HTTP_200_OK)
async def login_user(db:dependancy,credential:OAuth2PasswordRequestForm=Depends()):
        return await auth.user_login(credential,db)

@router.delete("/Logout", response_model=dict[str, str], status_code=status.HTTP_301_MOVED_PERMANENTLY)#reirected to login page
async def logout(db:dependancy,user=Depends(check_user)):
    return await auth.logout(user,db)

@router.delete("/delete_account",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)#redirected to registration page after  acc deletion
async def delete_account(db:dependancy,user=Depends(check_user)):
    return await auth.deleteacc(user,db)

@router.patch("/renew_userAccount",response_model=dict[str, str], status_code=status.HTTP_301_MOVED_PERMANENTLY)#redirect to login page
async def renewAcc(db:dependancy,info:credential):   
    return await auth.renewacc(info,db)   


#Features for registered users

@router.post("/resume_analyzer",description="Upload a updated Resume(if not uploaded earlier) For accurate analysis."
             ,response_model=dict[str, str | Any | None],status_code=status.HTTP_200_OK)
async def resume_analyzer(db:dependancy,user=Depends(check_user), file: Annotated[Optional[UploadFile],None] = File(None)):
    Career_goal=user.Career_goal
    res_report=resume_report(db,user)
    if not res_report and not file:
        raise HTTPException(status_code=404,detail="Resume is not Found. Please Upload a updated Resume")
    elif file:
      extracted_information= await extract_text_from_pdf(file)
      report=await generate_resume_report(extracted_information,Career_goal)
      return {"response":report}
    else:
        return{"response":res_report}


@router.post("/Roadmap_Generator",description="Generates detailed Roadmap based on Career Goal",
             response_model=dict[str, str | None],status_code=status.HTTP_200_OK)
async def roadmap_generator(db:dependancy,user=Depends(check_user), file: Annotated[Optional[UploadFile],None] = File(None)):

    extracted_data=extracted_res_data(db,user) 
    if not extracted_data:
      extracted_data= await extract_text_from_pdf(file)
    roadmap=await generate_roadmap(extracted_data,user.Career_goal)
    return {"response":roadmap}
            
    
@router.post("/Practice_questions",description="Provides Top 10 frequently asked questions with personalised answers",
             response_model=dict[str, str | None],status_code=status.HTTP_200_OK) 
async def practiceQuestions(db:dependancy,level:level,user=Depends(check_user)): 
    top_questions=frequently_asked_questions(level,user,db)
    return {"response":top_questions}

@router.post("mock_interview")
async def mockinterview():
    pass

@router.Post("/Chat_with_AI",description="Chat with AI mentor for any career related queries",response_model=dict[str, str | None],status_code=status.HTTP_200_OK)
async def chat_with_ai():
    pass

