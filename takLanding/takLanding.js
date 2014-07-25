//DB Connnection
Desires = new Meteor.Collection("desires")

if (Meteor.isClient) {
var desires;
Meteor.startup(function () {
    Session.set("desireImg", 1);
    Session.set('desire', " ");
  });

Deps.autorun(function () {
  Meteor.subscribe("similarDesires", Session.get('desire'));
});

 
 Meteor.setInterval( function(){
    var currentImage=Session.get("desireImg");
    currentImage+=1;
    if(currentImage==4)
      currentImage =1;
    Session.set("desireImg", currentImage);
 }, 8000 );

 Template.content.events({
  'keypress #userDesire': function (evt, tmpl){
      var desire = document.getElementById("userDesire").value;
      //alert(desire);
      var re = /([a-zA-Z]+)/g;
      if(desire.match(re))
      {
        Session.set('desire', desire);
      }
      
      return true;
  },

 'click .saveDesire': function (evt, tmpl) {
  evt.preventDefault();
      var description = document.getElementById("userDesire").value;

      if(description=="")
      {
        alert("Por favor escribe tu deseo");
        return false;
      }
      var doc = {
                description: description, 
                lastScore: 0,
                referrer: document.referrer, timestamp: new Date()
                };
      Meteor.call("insertDesire", doc);
      return false;
   }

 });

  Template.desiresOptions.helpers({
    matchingDesire: function(){
    //var tagsOfIdea = Session.get("tagsOfIdea");
    return Desires.find();
    }
  });

  Template.slider.desireImg = function() {
    return Session.get("desireImg");
  };
}
if (Meteor.isServer) {
 Meteor.startup(function () {
    // code to run on server at startup
    //Comment this line the first time, so Meteor can find the index_name afterwards
   search_index_name = 'desiresFinder'
    // Remove old indexes as you can only have one text index and if you add 
    // more fields to your index then you will need to recreate it.
    //Desires._dropIndex(search_index_name);

    //text
    Desires._ensureIndex({
        description: 'text',
    }, {
        name: 'desiresFinder'
    });
  });

 Meteor.publish('similarDesires', function(searchText) {

         var doc = {};

    var desiresIds = Meteor.call("search",searchText);
   
    console.log(desiresIds)
    if(desiresIds.length > 0)
   {
        doc._id = {
            $in: desiresIds
        };

      var similarDesires = Desires.find(doc,{sort:{lastScore:-1}});
      return similarDesires;
    }
    /*else
    {
      console.log("subscription has no results back");
      return Desires.find({});
    }*/

  });

 Meteor.methods({
      insertDesire: function(doc) {
          console.log('Adding desire with doc');
          console.log(doc);
          var desireId = Desires.insert(doc);
      },
      _searchDesires: function (searchText) {
      console.log(typeof(searchText));
      console.log(searchText);
      
      var Future = Npm.require('fibers/future');
      var future = new Future();
      MongoInternals.defaultRemoteCollectionDriver().mongo.db.executeDbCommand({
          text:'desires', //Collection
          search: searchText, //String to search
          //limit:3
          // project: { //No funciona en nuestra base de datos
          // id: 1 // Only take the ids
          // }
          }, function(error, results) {
        console.log(results)
        if (results.documents[0].results[0] && results.documents[0].ok === 1) {
          future.return(results.documents[0].results);
          //console.log(results.documents[0].results[0].obj)
          }
          else {
              future.return('');
              console.log("No results in text search")
          }
      });
      return future.wait();
      },

      // Helper that extracts the users ids from the search results
      search: function (searchText) {
        console.log(searchText)
      if (searchText && searchText !== '') {
          console.log('Searching Desires...');
          var searchResults = Meteor.call("_searchDesires", searchText);
          console.log('Matches back');
          var ids=[]
          for (var i = 0; i < searchResults.length; i++) {
              var id = searchResults[i].obj._id;
              var score = searchResults[i].score;
              console.log(score);
              Desires.update({_id: id}, {$set: {'lastScore':score}});
              if(score >= searchText.split(" ").length*0.6){
                ids.push(id);
              }
              
          }
          console.log(ids);
          return ids;
      }
      }
    });


}