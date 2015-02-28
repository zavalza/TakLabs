Template.navigation.events ({
	'click .newFeedthank' : function(evt, tmpl){

		if(Meteor.user())
		{

		var id = Meteor.call('newFeedthank', Meteor.userId(), function(err, result){
			Session.set('currentFeedthank', result);
			Router.go('editFeedthank');
		})
		}
		else
		{
			Meteor.loginWithFacebook({},  function (err) {
          		if (!err)
          		{
          			var id = Meteor.call('newFeedthank', Meteor.userId(), function(err, result){
					Session.set('currentFeedthank', result);
					Router.go('editFeedthank');
          			});
          		}

     			});
		}


	},

	'click .tryLogout' : function(evt, tmpl)
	{
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
      },
})