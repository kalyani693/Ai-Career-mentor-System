from fastapi import HTTPException,Depends
from database.schemas import getdb,registered_users
import database.schemas as model
from sqlalchemy.orm import session
from pwdlib import PasswordHash
from typing import Annotated
from jose import jwt
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

from service.service_resume_analysis import extract_text_from_pdf,generate_resume_report
from datetime import datetime

load_dotenv()
password_hash=PasswordHash.recommended()
dependancy=Annotated[session,Depends(getdb)]
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# add modular coding


class authentication():
 def __init__(self):
    return


 async def registation(self,info,db,file):
    user=db.query(registered_users).filter(registered_users.Username==info.Username).first()# ya username cha purn data
    email=db.query(registered_users).filter(registered_users.Email==info.Email).first()
    if user:
        raise HTTPException(status_code=400,detail="Account with this Username is Already Present")
    if email:
        raise HTTPException(status_code=400,detail="Account with This Email Id Is already Present")
    hashpassword=password_hash.hash(info.Password)
    try:
        #store user information into database
        user_data=model.registered_users(Full_Name=info.Full_Name,Username=info.Username,Email=info.Email,hashed_Password=hashpassword,
                                         Highest_Class=info.Highest_Class,Career_goal=info.Career_goal,University=info.University,CGPA=info.CGPA,Resume_file_path=file.filename if file else None)
        db.add(user_data)


        # store  file extracted data into database
        resume_data= await extract_text_from_pdf(file) if file else None
        if resume_data:
            resume_report=await generate_resume_report(resume_data,info.Career_goal)
        
        if file:
          data=model.users_resume(Username=info.Username,File_Name=file.filename,Extension=file.content_type,File_Size=file.size,
                                  Extracted_text=resume_data,Resume_report=resume_report,Uploaded_at=datetime.now(),File_path="--")#resume_data.get("Information")[0].get("text")[0]
          db.add(data)
    
        db.commit()
        return {"Result":f"Congratulations! Registration done.\nData saved successfully!!"}
    except Exception as e:
        raise HTTPException(status_code=500,detail={"Error in Data Saving":str(e)})
    
 async def user_login(self,credential,db):
    #add->only 3 times retry otherwise stop login for 10 min
  try:  
    user=db.query(registered_users).filter(registered_users.Username==credential.username).first()
    if user:
        if password_hash.verify(credential.password,user.hashed_Password):
            secret_key=os.getenv('SECRET_KEY')
            token=jwt.encode(claims={'_username':credential.username,'password':credential.password},
                              key=secret_key,algorithm=os.getenv('ALGORITHM'))
            return{'access_token':token,"token_type":"bearer"}  # important formating
        else:
            raise HTTPException(status_code=422,detail="password is wronge")
    else:
        raise HTTPException(status_code=400,detail="Account with this Username is not Available")
  except Exception as e:
      raise HTTPException(status_code=500, detail={"error":str(e)})  
    

async def check_user(db:dependancy, token:str=Depends(oauth2_scheme)):
    try:
        secret_key=os.getenv('SECRET_KEY')
        algo=os.getenv('ALGORITHM')
        payload=jwt.decode(token,key=secret_key,algorithms=algo)
        username=payload.get('_username')
        password=payload.get('password')
        user=db.query(registered_users).filter(registered_users.Username==username).first()
        if user and password_hash.verify(password,user.hashed_Password):
            return user
        else:
            raise HTTPException(status_code=401,detail="Invalid Token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401,detail="Token Expired")
    #except jwt.InvalidTokenError:
        raise HTTPException(status_code=401,detail="Invalid Token")


