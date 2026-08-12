from fastapi import APIRouter,UploadFile,File,Depends,HTTPException,Form,status
from database.schemas import getdb,users_resume
from model import user_profile,editDetails
from sqlalchemy.orm import session
from typing import Annotated,Optional,Any
from database.schemas import getdb
from service.registration import authentication,check_user
from pydantic import Field
from service.Userprofile_ import editprofile,updateResume,updatePic

auth=authentication()
dependancy=Annotated[session,Depends(getdb)]
router=APIRouter()


@router.get("/getUserProfile", response_model=dict[str,user_profile])
async def userprofile(user=Depends(check_user)):
    return {"user":user}

@router.patch("/EditProfile")
async def edit(db:dependancy,what_to_edit:editDetails,changed_value:str,user=Depends(check_user)):
    return await editprofile(what_to_edit,changed_value,db,user)

@router.put("/EditResume")
async def editresume(db:dependancy,newResume=File(...),user=Depends(check_user)):
    return await updateResume(db,newResume,user)

@router.put("/EditprofilePic")
async def editprofile_Pic(db:dependancy,newPicture=File(...),user=Depends(check_user)):
    return await updatePic(db,newPicture,user)