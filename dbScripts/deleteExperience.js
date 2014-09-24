// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.
 
// Connect to the MongoLab database.
//main db host
var connection = new Mongo( "ds059509.mongolab.com:59509");
 
// Connect to the database.
var db = connection.getDB( "meteor_test" );
 
// Authorize this connection.
//db.auth("user", "password");
db.auth( "xxxx", "xxxx" );

//roles, city, skill, college
db.people.find({}).forEach(function(doc){

	db.people.update({_id:doc._id},{$set:{experience:null}})
		//var tag = db.tags.findOne({name:doc.name});
		print (doc.name);
	//print(amount);
		
});
 
print( "> People experience to null." );