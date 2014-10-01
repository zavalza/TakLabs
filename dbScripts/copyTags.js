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
db.auth( "xxxx", "xxxx" );

//roles, city, skill, college
db.tags.find({}).forEach(function(doc){
	if(doc.type == 'Market')
	{
		print(">"+doc.name);
		var oid = new ObjectId();
				var newTag = {
					_id: oid.str,
					type: 'Industry',
	                  name: doc.name,
	                  counter:{
	                    people: 0,
	                    companies: 0,
	                  },
	                  timestamp: new Date(),
				};
		db.tags.insert(newTag);
		/*
		for(var i = 0; i <doc.types.length; i++)
		{
			if(doc.types[i])
			{

			var tagDoc = db.tags.findOne({name:doc.types[i], type:"TypeOfCompany"});
			if(tagDoc)
			{
				print(tagDoc._id);
				db.companies.update({_id: doc._id}, {$addToSet:{tag_ids:tagDoc._id}});
			}
			else
			{
			    var oid = new ObjectId();
				var newTag = {
					_id: oid.str,
					type: 'TypeOfCompany',
	                  name: doc.types[i],
	                  counter:{
	                    people: 0,
	                    companies: 0,
	                  },
	                  timestamp: new Date(),
				};
				db.tags.insert(newTag);
				db.companies.update({_id: doc._id}, {$addToSet:{tag_ids:oid.str}});
				print("new tag");
			}
		}
		}
		*/
	}
})
 
print( "> Tags successfuly copied" );