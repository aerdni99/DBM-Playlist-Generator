
import psycopg2
import re
import sys
import csv

try:
    
    con = psycopg2.connect("host=ec2-54-163-34-107.compute-1.amazonaws.com dbname=dokaffa4bdtr5 user=aiertbbbpvwith password=97b7d375e7f3a5e77c209f7c3849ce32ca245331c096709e77aab93119ad3b21")

    cur = con.cursor()
    count = 0

    with open("tracks_features.csv") as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            count += 1
            if (count > 1000):
                break
            attribCount = 0
            for x in row:
                attribCount += 1
                if (attribCount == 1):
                    # Handle song ID
                    songID = '\'' + x + '\''
                if (attribCount == 5):
                    # Handle artist names
                    index = x.find('\', \'') + 3
# To be continued...


except psycopg2.DatabaseError as e:

    print(f'Error {e}')
    sys.exit(1)

finally:

    if con:
        con.close()
            

