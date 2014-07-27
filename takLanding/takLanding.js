//DB Connnection
Desires = new Meteor.Collection("desires")
Messages = new Meteor.Collection("messages")
Taks = new Meteor.Collection("tak") //message to tak
Emails = new Meteor.Collection('emails')

Router.map(function() {
  this.route('welcome', {path: '/'});
  this.route('desires', {path: '/results'});
});

if (Meteor.isClient) {
var addthis_config

Meteor.startup(function () {
    Session.set("desireImg", 1);
    Session.set('desire', " ");
    Session.set('numberOfDesires', 3);
    Session.set('idsToSearch', []);
    Session.set('showToTak', false);
    Session.set('showAboutTak', false);
  addthis_config = {"data_track_addressbar": true,
                    pubid: 'ra-53d405157d4cf334' };

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
    //alert(addthis_config.pubid)
 }, 8000 );

 Meteor.setInterval( function(){
    var desiresNum=Session.get("numberOfDesires");
    if(desiresNum==0)
    { 
      googleAnalytics(function(settings, path, ga) {
          //                    categoria accion    etiqueta    valor
          //ga('send', 'event', 'button', 'click', 'nav buttons', 4);
          ga('send', 'event', 'pages', 'goToResults');
        });
      Router.go('desires'); //show desires page
      //alert("Hecho");
    }
   
 }, 1500 );

 Template.welcome.events({
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
                amount: 1, //amount of people with that desire
                lastScore: 0,
                referrer: document.referrer, timestamp: new Date()
                };
       Meteor.call("insertDesire", doc, function(error, result){
          var ids = Session.get('idsToSearch');
          ids.push(result)
          Session.set('idsToSearch', ids);
      });
      
      var desiresNum = Session.get('numberOfDesires');
      if(desiresNum > 0){
        console.log('adding desire num' + desiresNum);
        Session.set('desire'+String(desiresNum), description);
        Session.set('numberOfDesires', desiresNum-1);
      }
      document.getElementById("userDesire").value = "";
      Session.set('desire', "");
      googleAnalytics(function(settings, path, ga) {
          //                    categoria accion    etiqueta    valor
          //ga('send', 'event', 'button', 'click', 'nav buttons', 4);
          ga('send', 'event', 'wish', 'save');
      });

      return false;
   },

   'click .option': function (evt, tmpl){
     //alert(this._id);
     
     var description = document.getElementById("userDesire");
     description.value = this.description;
     Meteor.call("increaseCounter", this._id);
    var desiresNum = Session.get('numberOfDesires');
     if(desiresNum > 0){
        console.log('adding desire num' + desiresNum);
        Session.set('desire'+String(desiresNum), this.description);
        Session.set('numberOfDesires', desiresNum-1);
      }
      var ids = Session.get('idsToSearch');
      ids.push(this._id)
      Session.set('idsToSearch', ids);
      description.value = "";
      Session.set('desire', "");

      googleAnalytics(function(settings, path, ga) {
          //                    categoria accion    etiqueta    valor
          //ga('send', 'event', 'button', 'click', 'nav buttons', 4);
          ga('send', 'event', 'wish', 'select');
      });
      return false;
   }

 });

Template.navbar.events({
  'keypress #searchDesire': function (evt, tmpl){
      var desire = document.getElementById("searchDesire").value;
      //alert(desire);
      var re = /([a-zA-Z]+)/g;
      if(desire.match(re))
      {
        Session.set('idsToSearch', []);
        Session.set('desire', desire);
      }
      return true;
  },

  'click .showAllDesires': function(evt, tmpl){
    Session.set('idsToSearch', ['all']);
  },

  'click .toTak': function(evt, tmpl){
    Session.set('idsToSearch', []);
    Session.set('showToTak', true);
    
  },
  'click .aboutTak': function(evt, tmpl){
    Session.set('idsToSearch', []);
    Session.set('showAboutTak', true);
  }
});

  Template.desires.events({
    'click .sendMessage': function(evt, tmpl){
      var text = tmpl.find('#messageToTak').value;
      if(text ="")
      {
        alert("Por favor escribe tu mensaje");
        return false;
      }
       var doc = {
                text: text,
                referrer: document.referrer, timestamp: new Date()
                };
      Meteor.call('insertTak', doc);
      alert("Gracias por comunicarte con nosotros");
    },
    'click .sendInterest': function(evt, tmpl){
      var email = tmpl.find('#email').value;
      if(!email.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/))      
        {
          alert("El correo electrónico no es válido");
          return false;
        }
       var doc = {
                address: email,
                referrer: document.referrer, timestamp: new Date()
                };
      Meteor.call('insertEmail', doc);
      alert ("Cuando este lista la siguiente versión, nos comunicaremos contigo");
    }
  });

  Template.newMessage.events({
    'click .saveMessage': function (evt, tmpl) {
      evt.preventDefault();
       var text = tmpl.find('#newMessage').value;

      if(text=="")
      {
        alert("Por favor escribe tu mensaje");
        return false;
      }
      //alert(text);
      var doc = {
                text: text,
                desire_id: this._id,
                points: 0,
                referrer: document.referrer, timestamp: new Date()
                };
      Meteor.call("insertMessage", doc);
      tmpl.find('#newMessage').value = ""
      return false;
   }
  });

  Template.desiresOptions.helpers({
    matchingDesire: function(){
    return Desires.find();
    }
  });

  Template.desires.helpers({
    desiresToShow: function(){
    Meteor.subscribe("findDesires", Session.get('idsToSearch'));
    //var idsToSearch = Session.get("idsToSearch");
    //alert(idsToSearch.length);
    return Desires.find();
    },

    messages:function(){
      var desireId =  this._id;
      Meteor.subscribe("findMessages", desireId);
      return Messages.find({desire_id: desireId});
    }
  });

  Template.desires.showToTak = function(){
    return Session.get('showToTak');
  }

  Template.desires.showAboutTak = function(){
    return Session.get('showAboutTak');
  }
  Template.userDesires.desire1= function(){
    return Session.get("desire1");
  };

  Template.userDesires.desire2= function(){
    return Session.get("desire2");
  };

  Template.userDesires.desire3= function(){
    return Session.get("desire3");
  };

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

 Meteor.publish('findDesires', function(idsToSearch){
    if(idsToSearch.length > 0)
        if(idsToSearch[0] == 'all')
          return Desires.find({}, {sort:{amount:-1}});
        else
          return Desires.find({_id: {$in: idsToSearch}});
    else
        this.stop();
 });

 Meteor.publish("findMessages", function(desireId){
  console.log("finding messages of desire"+ desireId);
  return Messages.find({desire_id : desireId});
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
          return desireId;
      },
      insertMessage: function(doc) {
          console.log('Adding message with doc');
          console.log(doc);
          var messageId = Messages.insert(doc);
          return messageId;
      },
      insertTak: function(doc) {
          console.log('Adding message to tak with doc');
          console.log(doc);
          var takId = Taks.insert(doc);
          return takId;
      },
      insertEmail: function(doc) {
          console.log('Adding email with doc');
          console.log(doc);
          var emialId = Emails.insert(doc);
          return emailId;
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

      increaseCounter: function(desireId) {
        console.log("One more person wants" + desireId);
          Desires.update({_id: desireId},
          {$inc: {'amount':1}});
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
              if(score >= searchText.split(" ").length*0.7*0.6){
                ids.push(id);
              }
              
          }
          console.log(ids);
          return ids;
      }
      }
    });


}