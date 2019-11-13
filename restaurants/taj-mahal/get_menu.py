from urllib import request
from bs4 import BeautifulSoup
import json
import datetime

from os import path
directory = path.dirname(path.realpath(__file__))


def main():
    html = request.urlopen("https://www.tajmahalgbg.se/lunch-meny/").read().decode()

    html_tree = BeautifulSoup(html, features="html.parser")

    relevant_html = html_tree.find_all(class_="elementor-widget-wrap")[0].find_all(["h4", "p"])


    now = datetime.datetime.now().isocalendar()

    menu = {
        "year": now[0],
        "week": now[1],
        "days": {}
    }

    for day in range(0, 5):
        i = day * 12

        dishes = []
        
        for dish_index in range(5):
            try:
                title = relevant_html[i + dish_index * 2].string.strip()
                description = relevant_html[i + dish_index * 2 + 1].string.strip()
                dish = {
                    "title": title,
                    "description": description
                }

                dishes.append(dish)


            except IndexError:
                pass
        
        if len(dishes) == 0:
            dishes = ["N/A"]

        menu["days"][day] = dishes
    
    fp = open(directory + "/menu.json", "w", encoding="utf-8")

    json.dump(menu, fp, ensure_ascii=False)

    
main()



