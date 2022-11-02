

"""
This parsing loop is junk, but it gets the job done
It grabs all the data from the table and formats it
instead of just grabbing necessary data and taking each
column case by case.

If I were to do it again, I'd definitely have similar strategies
to how the artParse.py file implements parsing the .csv.

But that being said, this parsing loop looks at every row, every column,
formats the database, and sends it to our postgres database with the 
python module psycopg2.
"""


import psycopg2
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
            if (count > 1001):
                break
            values = '\''
            attribCount = 0
            for x in row:
                x = x.replace('\'', '\'\'')
                attribCount += 1
                if (attribCount == 22):
                    x = x[0:1]
                if (attribCount == 24):
                    break
                if (attribCount < 6):
                    values += x + '\', \''
                elif (attribCount == 6):
                    values += x + '\', '
                elif (attribCount < 23):
                    if (attribCount == 14):
                        if (x == 1):
                            x = 'True'
                        else:
                            x = 'False'
                        values += x + ', '
                    else:
                        values += x + ', '
                else:
                    values += x
            if (row[0] != 'id'):
                id = 'INSERT INTO public."Songs" VALUES (' + values + ');'
                cur.execute(id)

        
    cur.execute('SELECT * FROM public."Songs"')

    for x in range(999):
        print(cur.fetchone())
        print()

    con.commit()
    """
    sql = 'INSERT INTO public."Songs" ("id") VALUES (\'3zm2xw2tuKzCio7wgrd1zO\')'
    cur.execute(sql)
    cur.execute('SELECT * FROM public."Songs"')
    cur.fetchall()
    """


except psycopg2.DatabaseError as e:

    print(f'Error {e}')
    sys.exit(1)

finally:

    if con:
        con.close()
