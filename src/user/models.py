from sqlalchemy import Column,String,Boolean,DATETIME,Integer
from src.utils.db import Base

class UserModel(Base):
    __tablename__="user_table"


    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username=Column(String)
    email = Column(String, nullable=False)
    hash_password = Column(String, nullable=False)