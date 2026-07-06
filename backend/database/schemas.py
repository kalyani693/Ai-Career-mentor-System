from sqlalchemy import Column,VARCHAR,Integer,FLOAT,TIMESTAMP,DATETIME,BOOLEAN
from database.configuration import base,sessionlocal
from datetime import datetime

class registered_users(base):
    __tablename__="registered_users"
    Full_Name=Column(VARCHAR(200))
    Username=Column(VARCHAR(10),primary_key=True)#we allowed only 8 char
    Email=Column(VARCHAR(255),nullable=False,unique=True)
    hashed_Password=Column(VARCHAR(255),nullable=False,unique=True)
    Highest_Class=Column(VARCHAR(50),nullable=False)
    Career_goal=Column(VARCHAR(64),nullable=False)
    University=Column(VARCHAR(255))
    CGPA=Column(FLOAT,nullable=False)
    Resume_file_path=Column(VARCHAR(256))
    is_active=Column(BOOLEAN)

class users_resume(base):
    __tablename__="users_resume" 
    Username=Column(VARCHAR(10))#fk
    File_Name=Column(VARCHAR(128), primary_key=True)
    Extension=Column(VARCHAR(50), nullable=False)
    File_Size=Column(Integer, nullable=False)
    Extracted_text=Column(VARCHAR(10000), nullable=False)
    Resume_report=Column(VARCHAR(10000), nullable=False)
    Uploaded_at=Column(TIMESTAMP, nullable=False, default=datetime.now())
    File_path=Column(VARCHAR(256), nullable=False)

class registered_admin(base):
    __tablename__="registered_admin"
    Full_Name=Column(VARCHAR(200))
    Username=Column(VARCHAR(10),primary_key=True)#update
    Email=Column(VARCHAR(255),nullable=False,unique=True)
    Profession=Column(VARCHAR(60),nullable=False)
    hashed_Password=Column(VARCHAR(255),nullable=False,unique=True)
    is_active=Column(BOOLEAN,nullable=False)  

def getdb():
    db=sessionlocal() 
    try:
        yield db
    finally:
        db.close()       

