

  Template.headerwrap.peopleAmount = function(){
  	Meteor.subscribe("allUserProfiles");
    return Meteor.users.find({}).count();
  }

  Template.headerwrap.startupsAmount = function(){
    Meteor.subscribe("allCompanies");
    //maybe just type=startup
    return Companies.find({}).count();
  }