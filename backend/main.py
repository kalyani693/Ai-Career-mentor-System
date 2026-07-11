from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from routes.api import router
from routes.admin_dashboard import router as router2


app=FastAPI(title="AI CAREER MENTOR SYSTEM")
app_admin=FastAPI(title="Admin Dashboard")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you might want to restrict this in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

#to seperate admin dashboard and user dashboard I have seperated admin dashboard on admin-pannel server and mount on main app
app.include_router(router,tags=["user endpoints"] )#prefix="/router",tags=["endpoints"] direct docs vr diste mindmitra sarkha

app_admin.include_router(router2,tags=["admin endpoints"])
app.mount("/admin-pannel",app_admin)


if __name__== "__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)


