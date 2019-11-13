from urllib import request
from bs4 import BeautifulSoup
import json
import datetime

from os import path
directory = path.dirname(path.realpath(__file__))


def main():
    html = request.urlopen("http://seaside.kvartersmenyn.se/").read().decode()

    html_tree = BeautifulSoup(html, features="html.parser")

    relevant_html = html_tree.find_all(class_="meny")[0].contents

    now = datetime.datetime.now().isocalendar()

    menu = {
        "year": now[0],
        "week": now[1],
        "days": {}
    }

    for day in range(0, 5):
        i = day * 11 + 2

        dishes = []
        
        for dish_index in range(4):
            try:
                dish = relevant_html[i + dish_index * 2].strip()
                dish_array = dish.split()
                
                dishes.append({
                    "title": dish_array[0],
                    "description": " ".join(dish_array[1:])
                })
            except IndexError:
                pass
        
        if len(dishes) == 0:
            dishes = ["N/A"]

        menu["days"][day] = dishes
    
    fp = open(directory + "/menu.json", "w", encoding="utf-8")

    json.dump(menu, fp, ensure_ascii=False)


main()



