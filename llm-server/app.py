from fastapi import FastAPI
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langserve import add_routes
from dotenv import load_dotenv
import uvicorn
import os

load_dotenv()
os.environ['OPENAI_API_KEY']=os.getenv("OPENAI_API_KEY")

app = FastAPI(
    title = "Langchain Server",
    version = "1.0",
    description = "Taiwania LLM API Server"
)


model=ChatOpenAI()
prompt = ChatPromptTemplate.from_template(
    "Translate the text to English. This would be used as dictionary. Example translation for \"指鴨子聽到雷聲，並不知道是怎麼回事。比喻一個人對所接收的訊息無法理解。比喻一個人對所接收的訊息無法理解。\" would be \"Refers to a duck hearing thunder, not knowing what it is. A metaphor for a person who cannot understand the information they receive\". {Definition}",
    role="user")


add_routes(
    app,
    model,
    path="/openAI"
)


add_routes(
    app,
    prompt|model,
    path="/translate"
)

if __name__=="__main__":
    uvicorn.run(app, host="localhost", port=8000)
