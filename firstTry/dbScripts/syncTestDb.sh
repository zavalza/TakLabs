#!/bin/bash

#global variables
prodHost=ds059509.mongolab.com:59509
testHost=ds041380.mongolab.com:41380
prodDB=meteor_test
testDB=tak
collections=('tags')

#number of collections
amount=${#collections[@]}

# echo each element in array 
# for loop
for (( i=0;i<$amount;i++)); do
    echo ${collections[${i}]}
    mongoexport -h $prodHost -d $prodDB -c ${collections[${i}]} -u rojinegro -p pierrepaul10 -o ${collections[${i}]}.json
done
for (( i=0;i<$amount;i++)); do
    echo ${collections[${i}]}
    mongoimport -h $testHost -d $testDB -c ${collections[${i}]} -u paul -p Rojinegro51 --file ${collections[${i}]}.json
done

