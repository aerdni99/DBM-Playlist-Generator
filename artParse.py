"""
    artParse.py

    Parsing loop for transferring data from teacks_features.csv to our Created_By table
"""

import psycopg2
import sys
import csv

try:
    
    # EDIT CONNECTION INFO FOR SETTING UP ON A DIFFERENT SERVER
    con = psycopg2.connect(
        database="postgres",
        user="postgres",
        password="password")

    cur = con.cursor()
    numRows = 1000
    count = -1

    with open("tracks_features.csv", encoding="utf8") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            count += 1
            if count > numRows:
                break
            values = ""
            if count == 0:
                continue
            attribCount = 0
            for x in row:
                attribCount += 1
                if (attribCount == 1):
                    # Handle song ID
                    songID = "\'" + x + "\'"
                if (attribCount == 5):
                    index = 0
                    for y in range(x.count('\', \'') + 1):
                        # Handle artist names
                        artistName = "\'" + x[(x.find('\'') + 1):(-1 * (len(x) - x.find('\'', x.find('\'') + 1)))] + "\'"
                        x = x[(x.find('\'', x.find('\'') + 1)) + 3:]
                        query = 'INSERT INTO public."Created_By" VALUES (' + artistName + ', ' + songID + ');'
                        cur.execute(query)

    con.commit()

except psycopg2.DatabaseError as e:

    print(f'Error {e}')
    sys.exit(1)

finally:

    if con:
        con.close()
            
