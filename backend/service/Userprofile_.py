from sqlalchemy import text,select
from fastapi import HTTPException
from database.schemas import registered_users


async def editprofile(what_to_edit,changed_value,db,user_info):
    try: 
        stmt=select(registered_users).where(registered_users.Email==user_info.Email)
        user=db.scalars(stmt).first()

        if user:
            setattr(user,what_to_edit,changed_value)
            db.commit()
            return {"response":f"Updated successfully. {getattr(user,what_to_edit)}"}                     
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error in updating user profile. Error:{str(e)}")        
    
async def uploadResume(db,newResume,user):
    pass  

async def updatePic(db,newResume,user):
    pass