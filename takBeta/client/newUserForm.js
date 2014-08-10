Template.newUserForm.events({
    'click .tryFacebookLogin': function(evt, tmpl){
        if(Accounts.loginServicesConfigured()){
        Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'user_friends', 'email']
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            Router.go('editProfile');
          }
        }); 
        }
        else{
          alert("Error en inicio de sesión");
      }
      
    }
  });