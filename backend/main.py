from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from routes.api import router
from routes.admin_dashboard import router as router2


app=FastAPI(title="AI CAREER MENTOR SYSTEM")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you might want to restrict this in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


app.include_router(router,tags=["user endpoints"] )#prefix="/router",tags=["endpoints"] direct docs vr diste mindmitra sarkha
app.include_router(router2,tags=["admin endpoints"] )


if __name__== "__main__":
    uvicorn.run(app,host="0.0.0.0",port=8000)


