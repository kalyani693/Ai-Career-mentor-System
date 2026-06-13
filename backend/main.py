from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.api import router


app=FastAPI(title="AI CAREER MENTOR SYSTEM")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, you might want to restrict this in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


app.include_router(router)