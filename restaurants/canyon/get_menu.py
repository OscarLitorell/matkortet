from urllib import request
from bs4 import BeautifulSoup
import json
import datetime

from os import path
directory = path.dirname(path.realpath(__file__))


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
            for html_dish in html_dishes:
                dish = html_dish.string
                if dish != None:
                    dish = dish.strip()
                    if dish != "":
                        dishes.append({
                            "title": "",
                            "description": dish
                        })  
        except:
            dishes = ["N/A"]

        menu["days"][day] = dishes
    
    print(json.dumps(menu, ensure_ascii=False))
main()



