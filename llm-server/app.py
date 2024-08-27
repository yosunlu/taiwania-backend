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


model=ChatOpenAI(model_name="gpt-4-turbo")
prompt = ChatPromptTemplate.from_template(
    "Translate the text to English. This would be used as dictionary. Example translation for \"指鴨子聽到雷聲，並不知道是怎麼回事。比喻一個人對所接收的訊息無法理解。比喻一個人對所接收的訊息無法理解。\" would be \"Refers to a duck hearing thunder, not knowing what it is. A metaphor for a person who cannot understand the information they receive\". {Definition}",
    role="user"
    )

# promt to add tag to the phrases 
prompt1 = ChatPromptTemplate.from_template(
    "Categorize the Taiwanese: \"{phrase}\". If it is a proverb, use the following tags: praise, encourage, relationships, funny, wisdom, success, hardship, perseverance; if it is an everday language, use: greeting, gratitude, question, casual expression, request. A phrase can have 0-2 tags. Only output the tags. If the phrase has more than one, use \",\" as delimiter.",
    role="user"
    )

# promt to translate Taiwanese to Mandarin
prompt2 = ChatPromptTemplate.from_template(
    "\"{phrase}\": This phrase is Taiwanese Mandarin(臺文漢字)。\
        \"{definition}\" : This is its meaning in Mandarin.\
        Translate the phrase to Mandarin (一般漢字). Use Traditional Chinese (繁體中文)\
        Return ONLY the transalated phrase.\
        Do not include the phrase provided. Do not include characters「 and 」. ",

    role="user"
    )

# route to translate a phrase's English definition to Mandarin
add_routes(
    app,
    prompt|model,
    path="/translate"
)

# route to categorize/tag a phrase
add_routes(
    app,
    prompt1|model,
    path="/categorize"
)

# route to translate Taiwanese(臺文漢字) to Mandarin(華文)
add_routes(
    app,
    prompt2|model,
    path="/translate-to-mandarin"
)


if __name__=="__main__":
    uvicorn.run(app, host="localhost", port=8000)
