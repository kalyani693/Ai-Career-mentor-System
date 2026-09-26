
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base,DeclarativeBase
import os
from dotenv import load_dotenv
load_dotenv()


url=os.getenv("postgresql_url_DATABASE_URL") #   postgresql_url_DATABASE_URL

if url:
    if url.startswith("postgres://"):
        url=url.replace("postgres://","postgresql+psycopg2://",1)
    elif url.startswith("postgresql://"):
        url=url.replace("postgresql://","postgresql+psycopg2://",1)    

engine=create_engine(url)
sessionlocal=sessionmaker(autoflush=False,bind=engine,autocommit=False)
base=declarative_base()

#class Base(DeclarativeBase):
#    pass

#base.metadata.create_all(engine)