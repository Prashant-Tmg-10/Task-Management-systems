from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config=SettingsConfigDict(env_file=".env",extra="ignore")
    
    DB_connection:str = Field(validation_alias=AliasChoices("DB_connection", "DB_CONNECTION", "DATABASE_URL"))
    SECRET_KEY:str
    ALGORITHM:str
    EXP_TIME:int
    FRONTEND_URL:str = "http://localhost:5173"

settings=Settings()

