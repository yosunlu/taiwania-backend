from fastapi import FastAPI, Request
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI(
    title="Manual LLM Server",
    version="1.0",
    description="Taiwania Manual GPT API"
)

@app.post("/translate")
async def translate(request: Request):
    data = await request.json()
    definition = data.get("Definition", "")

    prompt = (
        'Translate the text to English. Return nothing but the translation. '
        'Example translation for "指鴨子聽到雷聲，並不知道是怎麼回事。比喻一個人對所接收的訊息無法理解。" '
        'would be "Refers to a duck hearing thunder, not knowing what it is. A metaphor for a person who cannot understand the information they receive.". '
        f'{definition}'
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return {"result": response["choices"][0]["message"]["content"].strip()}
    except Exception as e:
        return {"error": str(e)}