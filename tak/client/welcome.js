
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