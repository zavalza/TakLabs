#!/bin/bash

#global variables
collections=('tags')

#number of collections
amount=${#collections[@]}

# echo each element in array 
# for loop
for (( i=0;i<$amount;i++)); do
    echo ${collections[${i}]}
    cat ${collections[${i}]}.json | sed 's/companies/projects/g' > New/${collections[${i}]}.json
done
