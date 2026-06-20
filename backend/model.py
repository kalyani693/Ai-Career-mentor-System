from pydantic import BaseModel,field_validator, model_validator,Field
from typing import Annotated
from fastapi import HTTPException


class _registration(BaseModel):
    Full_Name:str
    Username:Annotated[str,Field(min_length=5,max_length=8)]
    Email:str
    Password:Annotated[str,Field(min_length=8,max_length=8)]
    Highest_Class:str
    Career_goal:str
    University:str
    CGPA:float

    @field_validator("Email",mode="after",check_fields=True)
    @classmethod
    def validate_email(cls,Email:str):
        if Email:
           try: 
            email_split=Email.split('@')
            if email_split[1] not in ['gmail.com','yahoo.com','outlook.com','hotmail.com']:
               raise HTTPException(status_code=429,detail="Please Enter a valid email. example:['gmail.com','yahoo.com','outlook.com','hotmail.com']")
            else:
               return Email 
           except Exception as e:
              raise HTTPException(status_code=429,detail=f"Email should be valid/seperated with '@'. error={str(e)}") 
    