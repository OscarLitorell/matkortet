from os import walk
import subprocess

def write(fp, data):
    f = open(fp, "w", encoding="utf-8")
    f.write(data)
    f.close()

def main():
    
    dirs = next(walk("restaurants"))[1]

    menus = "["

    for directory in dirs:
        print(directory)
        completed = subprocess.run(
            ["python", "restaurants/" + directory + "/get_menu.py"],
            capture_output=True,
            text=True)
        text = completed.stdout
        menus += text + ","
    menus = menus[:-1] + "]"

    menus = "".join(menus.split("\n"))

    write("public/restaurants.json", menus)

main()


