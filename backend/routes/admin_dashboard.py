from fastapi import HTTPException, APIRouter,Depends,status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated,Any
from sqlalchemy.orm import session
from sqlalchemy import select, update, delete
from database.schemas import getdb,registered_users,registered_admin
from service.registration import check_admin,adminAuthentication
from model import email,adminregistration,credential
from sqlalchemy import text


#to accesss all these endpoints go to /admin-pannel/docs server

router=APIRouter()
dependancy=Annotated[session,Depends(getdb)]
auth=adminAuthentication()


#authentication and registration routes

@router.post("/adminRegistration",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)
async def admin_registration(info:adminregistration,db:dependancy):
    return await auth.admin_registation(info,db)
    
@router.post("/adminLogin",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)
async def admin_login_(db:dependancy,info:OAuth2PasswordRequestForm=Depends()):
    return await auth.admin_login(info,db)

@router.delete("/Logout",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)
async def logout(db:dependancy,admin=Depends(check_admin)):
    return await auth.logout(admin,db)  

@router.delete("/delete_admin_account",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)
async def deleteacc(db:dependancy,admin=Depends(check_admin))  :
    return await auth.deleteaccount(db,admin)

@router.patch("/renew_adminAccount",description="Renew your existing account",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)
async def renew(info:credential,db:dependancy):
    return await auth.renewacc(info,db)


#admin dashboard features routes

@router.get("/all_users_data",description="Get all users detailed information.",response_model= list[dict],status_code=status.HTTP_200_OK)
def all_users_data(db:dependancy,admin=Depends(check_admin)):
    """"Response-> all information of registered users from database"""
    try:
        query=text("select * from registered_users;")
        all_user=db.execute(query).fetchall()
        return [dict(row._mapping) for row in all_user]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in retrieval of users info from database. error:{str(e)}")

#here email is passsing inside request body for security thats why we are using post method
@router.post("/Getuser_by_email",description="Get User information by email.",response_model= dict[str, list],status_code=status.HTTP_200_OK)
def user_by_email(db:dependancy,Email:email,admin=Depends(check_admin)):
    """Response-> return users information from database by matching email """
    try:
        response1=db.query(registered_users).filter(registered_users.Email==Email.Email).first()  

        stmt=(select(registered_admin).where(registered_admin.Email==admin.Email))
        response2=db.execute(stmt)

        return {"user_info":[response1,response2]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in retrieval of users info from database. error:{str(e)}")

@router.get("/stats",description="This route will return all analytical stats of user data",response_model=dict[str, Any],status_code=status.HTTP_200_OK)
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


    
