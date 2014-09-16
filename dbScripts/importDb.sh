#!/bin/bash

#global variables
testHost=ds059509.mongolab.com:59509
testDB=meteor_test
collections=('tags')

#number of collections
amount=${#collections[@]}

# echo each element in array 
# for loop
for (( i=0;i<$amount;i++)); do
    echo ${collections[${i}]}
    mongoimport -h $testHost -d $testDB -c ${collections[${i}]} -u xxxx -p xxxx --file ${collections[${i}]}.json
done
