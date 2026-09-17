from sqlalchemy import text
from fastapi import HTTPException


async def editprofile(what_to_edit,changed_value,db,user_info):
    try:
        if what_to_edit=="Resume":
            return("abhi tak logic likhneka hai")
            pass

        elif what_to_edit=="Profile_Pic":
            return("abhi tak logic likhneka hai")
            pass
        else:
            query=text(f"""update registered_users set {what_to_edit}={changed_value} where "Email"=='{user_info.Email}'""")
            response=db.execute(query)
            if response._soft_closed==True:
                return {"response":f"{what_to_edit} is upadated Successfully!!"}
            else:
                return {"response":"sorry, something went wrong"}
            
        db.commmit() 
                      
    except Exception as e:
        raise HTTPException(status_code=500,detail=f"Error in updating user profile. Error:{str(e)}")        
    
async def uploadResume(db,newResume,user):
    pass  

async def updatePic(db,newResume,user):
    pass