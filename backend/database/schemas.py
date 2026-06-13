from sqlalchemy import Column,VARCHAR,Integer,FLOAT
from database.configuration import base,sessionlocal

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

def getdb():
    db=sessionlocal() 
    try:
        yield db
    finally:
        db.close()       

