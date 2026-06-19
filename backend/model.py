from pydantic import BaseModel


class _registration(BaseModel):
    Full_Name:str
    Username:str
    Email:str
    Password:str
    Highest_Class:str
    Career_goal:str
    University:str
    CGPA:float


class login(BaseModel):
    Username:str
    Password:str
