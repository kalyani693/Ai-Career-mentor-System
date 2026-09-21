from fastapi import HTTPException, APIRouter,Depends,status
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated,Any
from sqlalchemy.orm import session
from sqlalchemy import select, update, delete,func
from database.schemas import getdb,registered_users,registered_admin,users_resume
from service.registration import check_admin,adminAuthentication
from model import email,adminregistration,credential,confirmation
from sqlalchemy import text


#to accesss all these endpoints go to /admin-pannel/docs server

router=APIRouter()
dependancy=Annotated[session,Depends(getdb)]
auth=adminAuthentication()


#authentication and registration routes

@router.post("/adminRegistration",description=" example credentials username:yashya, pass: yashya12",response_model=dict[str, str],status_code=status.HTTP_200_OK)
async def admin_registration(info:adminregistration,db:dependancy):
    return await auth.admin_registation(info,db)
    
@router.post("/adminLogin",response_model=dict[str, str],status_code=status.HTTP_200_OK)
async def admin_login_(db:dependancy,info:OAuth2PasswordRequestForm=Depends()):
    return await auth.admin_login(info,db)

@router.delete("/Logout",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)
async def logout(db:dependancy, permision:confirmation,admin=Depends(check_admin)):
    if permision.Confirm_once_again=='Yes':
      return await auth.logout(admin,db)  
    else:
        return {"response":"You are logged in😊 you can explore the application"}

@router.delete("/delete_admin_account",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)
async def deleteacc(db:dependancy ,permision:confirmation,admin=Depends(check_admin))  :
    if permision.Confirm_once_again=='Yes':
          return await auth.deleteaccount(db,admin) 
    else:
        return {"response":"Your account is active 😊 you can explore the application."}
    

@router.patch("/renew_adminAccount",description="Renew your existing account",response_model=dict[str, str],status_code=status.HTTP_301_MOVED_PERMANENTLY)
async def renew(info:credential,db:dependancy):
    return await auth.renewacc(info,db)


#admin dashboard features routes

@router.get("/all_users_data",description="Get all users detailed information.", status_code=status.HTTP_200_OK) #do not write response model
def all_users_data(db:dependancy,admin=Depends(check_admin)):
    """"Response-> all information of registered users from database"""
    try:
        stmt=(select(registered_users))
        all_user=db.scalars(stmt).all()
        return {"response":all_user}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in retrieval of users info from database. error:{str(e)}")

#here email is passsing inside request body for security thats why we are using post method
@router.post("/Getuser_by_email",description="Get User information by email.",status_code=status.HTTP_200_OK)#do not write response model
def user_by_email(db:dependancy,Email:email,admin=Depends(check_admin)):
    """Response-> return users information from database by matching email """
    try:
        stmt=(select(registered_users).where(registered_users.Email==Email.Email))
        res1=db.scalars(stmt).first()
         
        if res1:
            stmt2=(select(users_resume).where(users_resume.Username==res1.Username))
            res2=db.scalars(stmt2).first()

            return {"user_info":res1,
                    "Resume_data":res2}
        else:
            raise HTTPException(status_code=404,detail="User not found")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in retrieval of users info from database. error:{str(e)}")

@router.get("/stats",description="This route will return all analytical stats of user data",status_code=status.HTTP_200_OK)
def get_stats(db:dependancy,admin=Depends(check_admin)):
    """returns total count of registered user.
    active user and ex users"""
    try:
        stmt=(select(func.count(registered_users.Username)))
        stmt2=(select(func.count(registered_users.Username)).where(registered_users.is_active==True))
        stmt3=(select(func.count(registered_users.Username)).where(registered_users.is_active==False))
       
        total_user=db.scalar(stmt)
        active_users=db.scalar(stmt2)
        existing_users=db.scalar(stmt3)
        
        return {"Total users":total_user,
                "Active Users":active_users,
                "Exsisting Users":existing_users
                   }
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error in retrieval of users info from database. error:{str(e)}")


    
