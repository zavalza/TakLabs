Template.loginForm.events({
    'click .tryFacebookLogin': function(evt, tmpl){
      if(Accounts.loginServicesConfigured()){
        Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'user_friends']
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            //Success
            Meteor.call('userToPerson', Meteor.userId(), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Router.go('people');
                }
              });
            
          }
      }); 
      }
      else{
        alert("Error en inicio de sesión");
      }
    },

      'click .tryLinkedinLogin': function(evt, tmpl){
      if(Accounts.loginServicesConfigured()){
        Meteor.loginWithLinkedin({
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            //Success
             Meteor.call('userToPerson', Meteor.userId(), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Router.go('people');
                }
              });
          }
      }); 
      }
      else{
        alert("Error en inicio de sesión");
      }
    }
  });