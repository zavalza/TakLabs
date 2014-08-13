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

  thisUser: function()
  {
    Meteor.subscribe("userProfile", Meteor.userId());
    return Meteor.users.find({_id: Meteor.userId()});
  },

   company: function(companyId)
        {
          return Companies.find({_id:companyId});
        }
});