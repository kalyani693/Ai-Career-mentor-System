from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from routes.user_dashboard import router
from routes.admin_dashboard import router as adminrouter
from routes.Userprofile_ import router as Uprofrouter

from database.configuration import base,engine
import database.schemas
from mangum import Mangum



app=FastAPI(title="AI CAREER MENTOR SYSTEM")
app_admin=FastAPI(title="Admin Dashboard")

base.metadata.create_all(bind=engine)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://aicareermentorfrontend.vercel.app","http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

#for now
from sqlalchemy import text
from database.configuration import engine

@app.get("/debug-db")
def debug_db():
    with engine.connect() as connection:
        result=connection.execute(text("""
         SELECT current_database(), current_schema(), current_user, to_regclass('public.registered_users')""")).fetchone()

        return{
            "database":result[0],
            "schema":result[1],
            "user":result[2],
            "registered_users":str(result[3]) if result[3] else None
        }
    

#to seperate admin dashboard and user dashboard I have seperated admin dashboard on admin-pannel server and mount on main app
app.include_router(router,tags=["user endpoints"] )#prefix="/router",tags=["endpoints"] direct docs vr diste mindmitra sarkha
app.include_router(Uprofrouter,tags=["user Profile"] )


app_admin.include_router(adminrouter,tags=["admin endpoints"])
app.mount("/admin-pannel",app_admin)


if __name__== "__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)


handler=Mangum(app)



