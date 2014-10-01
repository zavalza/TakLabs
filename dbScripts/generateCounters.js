// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.
 
// Connect to the MongoLab database.
//main db host
var connection = new Mongo( "ds059509.mongolab.com:59509" );
 
// Connect to the database.
var db = connection.getDB( "meteor_test" );
 
// Authorize this connection.
//db.auth("user", "password");
db.auth( "rojinegro", "pierrepaul10" );

//roles, city, skill, college
db.tags.find({}).forEach(function(doc){
	print(">"+doc.name);
	var amountPeople = db.people.find({tag_ids:doc._id}).count();
	print(amountPeople);
	var amountProjects = db.projects.find({tag_ids:doc._id}).count();
	print(amountProjects);
	db.tags.update({_id:doc._id}, {$set:{'counter.people':amountPeople, 'counter.projects':amountProjects}});
})
 
print( "> Counters generated." );
