
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
import os
from dotenv import load_dotenv
load_dotenv()


url=os.getenv("postgresql_url")  
engine=create_engine(url)
sessionlocal=sessionmaker(autoflush=False,bind=engine,autocommit=False)
base=declarative_base()