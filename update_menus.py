from os import walk, system

def main():
    
    dirs = next(walk("restaurants"))[1]

    for directory in dirs:
        system("python restaurants/" + directory + "/get_menu.py")

main()


