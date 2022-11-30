"""
    parser.py

    Parsing loop for transferring data from teacks_features.csv to our songs table
"""


import psycopg2
import sys
import csv
import os
from dotenv import load_dotenv

load_dotenv()

try:
    # EDIT CONNECTION INFO FOR SETTING UP ON A DIFFERENT SERVER
    con = psycopg2.connect(
        database=os.getenv('db'),
        user=os.getenv('user'),
        password=os.getenv('password'),
        port=os.getenv('port'))

    cur = con.cursor()
    numRows = 1000
    count = -1

    # These lists represent indices of data types in our .csv file
    importantCols = [12, 21, 23, 10, 11, 13, 15, 16, 17, 18, 19, 20, 9]
    strings = [1, 2]

    with open("tracks_features.csv", encoding="utf8") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            count += 1
            values = ""
            if count == 0:
                continue
            if count > numRows:
                break
            attribCount = 0
            for x in row:
                attribCount += 1
                if attribCount in importantCols:
                    values += ", " + x
                elif attribCount in strings:
                    x = x.replace("\'", "\'\'")
                    if attribCount == 2:
                        values += ", "
                    values += "\'" + x + "\'"
                elif (attribCount == 14):
                    if (x == "1"):
                        x = 'TRUE'
                    else:
                        x = 'FALSE'
                    values += ", " + x
            id = 'INSERT INTO public."Songs" VALUES (' + values + ');'
            cur.execute(id)

    con.commit()

except psycopg2.DatabaseError as e:

    print(f'Error {e}')
    sys.exit(1)

finally:

    if con:
        con.close()
