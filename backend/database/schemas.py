from sqlalchemy import Column,VARCHAR,Integer,FLOAT,TIMESTAMP,DATETIME
from database.configuration import base,sessionlocal
from datetime import datetime

class registered_users(base):
    __tablename__="registered_users"
    Full_Name=Column(VARCHAR(200))
    Username=Column(VARCHAR(200),primary_key=True)
    Email=Column(VARCHAR(500),nullable=False,unique=True)
    hashed_Password=Column(VARCHAR(500),nullable=False,unique=True)
    Highest_Class=Column(VARCHAR(50),nullable=False)
    Career_goal=Column(VARCHAR(200),nullable=False)
    University=Column(VARCHAR(500))
    CGPA=Column(FLOAT,nullable=False)
    Resume_file_path=Column(VARCHAR(500))

class users_resume(base):
    __tablename__="users_resume" 
    Username=Column(VARCHAR(200))#fk
    File_Name=Column(VARCHAR(500), primary_key=True)
    Extension=Column(VARCHAR(50), nullable=False)
    File_Size=Column(Integer, nullable=False)
    Extracted_text=Column(VARCHAR(10000), nullable=False)
    Uploaded_at=Column(TIMESTAMP, nullable=False, default=datetime.now())
    File_path=Column(VARCHAR(500), nullable=False,unique=True)

def getdb():
    db=sessionlocal() 
    try:
        yield db
    finally:
        db.close()       

