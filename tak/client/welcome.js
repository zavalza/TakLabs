Template.headerwrap.takValue = function()
{
	return Session.get('takValue');
}

Template.headerwrap.pathValue = function()
{
	return Session.get('pathValue');
}

  Template.headerwrap.peopleAmount = function(){
  	Meteor.subscribe("allUserProfiles");
    return Meteor.users.find({}).count();
  }

  Template.headerwrap.startupsAmount = function(){
    Meteor.subscribe("allProjects");
    //maybe just type=startup
    return Projects.find({types:'Startup',isPublic:true}).count();
  }
  Template.slider.desireImg = function() {
    return Session.get("desireImg");
  };

  Template.slider.message = function(){
    return Session.get('message');
  };

  Template.slider.callToAction = function(){
    return Session.get('callToAction');
  }