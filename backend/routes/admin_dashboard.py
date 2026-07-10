from fastapi import HTTPException, APIRouter,Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from sqlalchemy.orm import session
from database.schemas import getdb,registered_users
from security.registration import check_admin,adminAuthentication
from model import email,adminregistration,credential
from sqlalchemy import text


router=APIRouter()
dependancy=Annotated[session,Depends(getdb)]
auth=adminAuthentication()

@router.post("/adminRegistration")
async def admin_registration(info:adminregistration,db:dependancy):
    return await auth.admin_registation(info,db)
    
@router.post("/adminLogin")
async def admin_login(db:dependancy,info:OAuth2PasswordRequestForm=Depends()):
    return await auth.admin_login(info,db)

@router.delete("/delete_adminAccount")
async def deleteacc(db:dependancy,admin=Depends(check_admin)):
    return await auth.deleteaccount(admin,db)    

@router.patch("/renew_adminAccount",description="Renew your existing account")
async def renew(info:credential,db:dependancy):
    return await auth.renewacc(info,db)



@router.get("/all_users_data")
def all_users_data(db:dependancy,admin=Depends(check_admin)):
    """"Response-> all information of registered users from database"""
    try:
        query=text("select * from registered_users;")
        all_user=db.execute(query).fetchall()
        return [dict(row._mapping) for row in all_user]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in retrieval of users info from database. error:{str(e)}")

#here email is passsing inside request body for security thats why we are using post endpoint
@router.post("/Getuser_by_email")
def user_by_email(db:dependancy,Email:email,admin=Depends(check_admin)):
    """Response-> return users information from database by matching email """
    try:
        response=db.query(registered_users).filter(registered_users.Email==Email.Email).first()  
        return {"user_info":response}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in retrieval of users info from database. error:{str(e)}")

@router.get("/stats")
def get_stats(db:dependancy,admin=Depends(check_admin)):
    """returns total count of registered user.
    active user and ex users"""
    try:
        query=text(f"""select count(*) from registered_users;""")
        query1=text(f"""select count(*) from registered_users
                    where is_active=True;""")
        query2=text(f"""select count(*) from registered_users
                    where is_active=False;
                    """)
        total_user=db.execute(query).fetchall()
        active_users=db.execute(query1).fetchall()
        existing_users=db.execute(query2).fetchall()
        
        return {"Total users":[dict(row._mapping) for row in total_user][0]["count"],
                "Active Users":[dict(row._mapping) for row in active_users][0]["count"],
                "Exsisting Users":[dict(row._mapping) for row in existing_users][0]["count"]
        }
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error in retrieval of users info from database. error:{str(e)}")


    
