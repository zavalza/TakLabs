#!/bin/bash

#global variables
testHost=ds059509.mongolab.com:59509
testDB=meteor_test
collections=('users' 'people' 'tags' 'impulses' 'projects' 'cfs._tempstore.chunks' 'cfs.images.filerecord' 'cfs_gridfs._tempstore.chunks' 'cfs_gridfs._tempstore.files' 'cfs_gridfs.images.chunks' 'cfs_gridfs.images.files')

#number of collections
amount=${#collections[@]}

# echo each element in array 
# for loop
for (( i=0;i<$amount;i++)); do
    echo ${collections[${i}]}
    mongoexport -h $testHost -d $testDB -c ${collections[${i}]} -u xxxx -p xxxx -o ${collections[${i}]}.json
done

