
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base,DeclarativeBase
import os
from dotenv import load_dotenv
load_dotenv()


url=os.getenv("postgresql_url_POSTGRES_URL") #   postgresql_url
engine=create_engine(url)
sessionlocal=sessionmaker(autoflush=False,bind=engine,autocommit=False)
base=declarative_base()

class Base(DeclarativeBase):
    pass

Base.metadata.create_all(engine)