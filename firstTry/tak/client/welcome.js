
  Template.slider.desireImg = function() {
    return Session.get("desireImg");
  };

  Template.slider.message = function(){
    return Session.get('message');
  };

  Template.slider.callToAction = function(){
    return Session.get('callToAction');
  }

  Template.slider.action = function(){
    return Session.get('action');
  }

  Template.featuredProjects.helpers({
    project : function()
    {
      return Projects.find({},{limit:3});
    }
  })

  Template.featuredChallenges.helpers({
    fbLeft: function()
    {
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var deadline = new Date(2014,9,28);
      var currentDay = new Date();

      var diffDays = Math.round(Math.abs((deadline.getTime() - currentDay.getTime())/(oneDay)));
      return diffDays;
    }
  })

  Template.welcome.events({
    'click .hasIdea': function(evt, tmpl)
  {
      if(Meteor.userId())
      {
          Router.go('newProject');
      }
      else{
          Session.set('hasIdea', true);
          alert("Inicia sesión para publicar tu idea");
          Router.go('loginForm');
      }
    },

    'click .findChallenges':function(evt, tmpl)
    {
      Router.go('projects');
    },

    'click .help':function(evt, tmpl)
    {
      Router.go('newUserForm');
    }
  });