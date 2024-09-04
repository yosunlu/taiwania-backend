from bs4 import BeautifulSoup
import requests
import pandas as pd

# function to scrap one page
def scrapSinglePage(page):
    pageNum = str(page)
    url = 'https://sutian.moe.edu.tw/zh-hant/huliok/106/?iahbe=' + pageNum # concat the URL and page number
    curPage = requests.get(url)
    soup = BeautifulSoup(curPage.text, 'html')
    table = soup.find_all('table')

    
    for row in table[:-1]:
        # last row of table is not a valid row 
        row_data = row.find_all('td')
        a_tag  = row.find('a')
        href_value = a_tag['href']
        individual_row_data = []
        for data in row_data:
            # Strip and clean the text
            cleaned_text = data.text.strip().replace('\n', '').replace('\t', '').replace('\r', '')
            # Find the first period and keep everything up to and including it
            period_index = cleaned_text.find('.')
            
            if period_index != -1:
                cleaned_text = cleaned_text[:period_index + 1]
            
        
            individual_row_data.append(cleaned_text)

        # The URL for audio
        individual_row_data.append("https://sutian.moe.edu.tw/" + href_value)
        length = len(df)
        df.loc[length] = individual_row_data



# Get the column names
# the official website for Taiwanese Dictionary
url = 'https://sutian.moe.edu.tw/zh-hant/huliok/106/'
page = requests.get(url)
soup = BeautifulSoup(page.text, 'html.parser') 
table = soup.find_all('table')

# Find all <th> elements (table headers)
titles = soup.find_all('th')  

# Extract text from the <th> elements
table_titles = [title.text.strip() for title in titles]

# Create a DataFrame with the first four titles as headers
headers = table_titles[:4]
df = pd.DataFrame(columns=headers)

# Add an additional 'href' column for audio URL
df['href'] = None

# Scrap all 20 pages
for i in range(20):
    scrapSinglePage(i)

# Update header to English
df.columns = ['id', 'phrases', 'pronounciation', 'definition', 'audiourl']

# Add columns 
df.insert(4, 'tags', "")
df.insert(4, 'usage', "Proverb")

# Loop through the data frame, call API for translation of definition
for i in range(len(df)):
    chinese = df.at[i, 'definition']
    
    response = requests.post(
        "http://localhost:8000/translate/invoke",
        json = {
            'input': {'Definition' : chinese}}
    )
    translated_def = response.json()['output']['content']
    df.at[i, 'definition'] = translated_def



# Loop through the data frame, call API for adding tags
for i in range(len(df)):
    phrase = df.at[i, 'usage'] + ": " + df.at[i, 'phrase']
    # print(phrase)
    
    response = requests.post(
        "http://localhost:8000/categorize/invoke",
        json = {
            'input': {'phrase' : phrase}}
    )
    tags = response.json()['output']['content']
    # print(tags)
    df.at[i, 'tags'] = tags


# Add a mandarin column
df.insert(3, "mandarin", "")

# Add mandarin translation 
for i in range(len(df)):
    phrase = df.at[i, 'phrase']
    definition = df.at[i, 'definition']
    response = requests.post(
        "http://localhost:8000/translate-to-mandarin/invoke",
        json = {
            'input': {'phrase' : phrase, 'definition': definition}}
    )
    df.at[i, 'mandarin'] = response.json()['output']['content']


# format the tag to import to psql column text[]
for i in range(len(df)):
    tags_string = df.at[i, "tags"]
    tags_array = tags_string.split(",")
    new_tags_string = "\"{"
    for j in range(len(tags_array)):
        tags_array[j] = tags_array[j].lstrip(' ')
        new_tags_string += tags_array[j] + ","
    tags_string = new_tags_string[:-1] + "}\""
    df.at[i, "tags"] = tags_string


df.to_csv('/Users/yushanlu/Desktop/yushan-says/backend/scripts/data.csv', sep='|', index=False)