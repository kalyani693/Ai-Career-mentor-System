from fastapi import APIRouter,UploadFile,File,Depends,HTTPException
from database.schemas import getdb
from model import registration,login
from service.service_ra import extract_text_from_pdf,generate_resume_report
from service.service_rodmap import generate_roadmap
from sqlalchemy.orm import session
from typing import Annotated
from database.schemas import getdb
from security.registration import registation,user_login,check_user
from fastapi.security import OAuth2PasswordRequestForm


dependancy=Annotated[session,Depends(getdb)]
router=APIRouter()

@router.get("/health")
def health_check():
    return

@router.get("/")
def home():
    return "Wellcome to AI CAREER MENTOR SYSTEM"


@router.post("/registration")
async def registration(info:registration,db:dependancy):
    return await registation(info,db)

@router.post("/login")
async def login_user(db:dependancy,credential:OAuth2PasswordRequestForm=Depends()):
        return await user_login(credential,db)
    

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
            
    