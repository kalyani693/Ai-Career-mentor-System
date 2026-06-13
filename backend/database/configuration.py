
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base

url="postgresql+psycopg2://postgres:Kal123@localhost:5432/Ai_career_mentor_system"  
engine=create_engine(url)
sessionlocal=sessionmaker(autoflush=False,bind=engine,autocommit=False)
base=declarative_base()