from urllib import request
from bs4 import BeautifulSoup
import json
import datetime

from os import path
directory = path.dirname(path.realpath(__file__))

titles = [
    "KÖTT",
    "FISK",
    "VEGETARISKT",
    "ASIATISKT",
    "TACOS"
]

def main():
    html = request.urlopen("http://restaurang-einstein.se").read().decode()

    html_tree = BeautifulSoup(html, features="html.parser")

    relevant_html = html_tree.find_all(class_="content-wrapper")[3].contents

    now = datetime.datetime.now().isocalendar()

    menu = {
        "restaurant": "Café Canyon",
        "year": now[0],
        "week": now[1],
        "days": {}
    }

    for day in range(0, 5):
        i = day * 4 + 3

        dishes = []
        
        try:
            html_dishes = relevant_html[i].contents[1].contents[0].contents
            i = 0
            for html_dish in html_dishes:
                dish = html_dish.string
                if dish != None:
                    dish = dish.strip()
                    if dish != "":
                        title = ""
                        if i < len(titles):
                            title = titles[i]
                        dishes.append({
                            "title": title,
                            "description": dish
                        })
                i += 1
        except:
            dishes = ["N/A"]

        menu["days"][day] = dishes
    
    print(json.dumps(menu, ensure_ascii=False))
main()



