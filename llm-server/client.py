import requests


input_text = "晚餐少吃一口，活到九十九。說明晚餐的食用量少一點，有益身體健康。"

response = requests.post(
    "http://localhost:8000/translate/invoke",
    json = {
        'input': {'Definition' : "晚餐少吃一口，活到九十九。說明晚餐的食用量少一點，有益身體健康。"}}
)

translatedDef = response.json()['output']['content']

print(translatedDef)