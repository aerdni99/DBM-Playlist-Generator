"""
    artParse.py

    Parsing loop for transferring data from teacks_features.csv to our Created_By table
"""

import psycopg2
import sys
import csv
import os
import ast
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
    numRows = 10000000
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
            songID = row[0]
            artists = ast.literal_eval(row[4])
            
            for artist in artists:
                query = 'INSERT INTO public."Created_By" VALUES (%s, %s);'
                cur.execute(query, (artist, songID))

    con.commit()

except psycopg2.DatabaseError as e:

    print(f'Error {e}')
    sys.exit(1)

finally:

    if con:
        con.close()
            
