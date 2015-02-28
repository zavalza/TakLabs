Template.navigation.events({
  'click .tryLogout': function (evt, tmpl) {
        Meteor.logout(function(err){
            if (err)
            {
              //To do if logout was not successfull
            }
            else{
                Router.go('loginForm');
              }
            });
        return false
      }
  });

Template.navigation.helpers ({

  thisUser: function(personId)
  {
    Meteor.subscribe("person", personId);
    return People.find({_id: personId});
  },

   project: function(projectId)
        {
          return Projects.find({_id:projectId});
        }
});