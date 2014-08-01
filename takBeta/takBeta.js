
Projects = new Meteor.Collection("projects");
Skills = new Meteor.Collection("skills");
Locations = new Meteor.Collection("locations");
Colleges = new Meteor.Collection("colleges");
Jobs = new Meteor.Collection("jobs");

//File Storage
var imageStore = new FS.Store.GridFS("images");
Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

Router.map(function() {
  this.route('welcome', {path: '/'});
  this.route('loginForm', {path: '/login'});
  this.route('newUserForm', {path: '/newUser'});
  this.route('news', {path: '/news'});
});


if (Meteor.isClient) {

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
            Router.go('news');
          }
      }); 
      }
      else{
        alert("Error")
      }
    }
  });

  Template.newUserForm.events({
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
            Router.go('news');
          }
      }); 
      }
      else{
        alert("Error")
      }
    }
  });
}

if (Meteor.isServer) {
   Accounts.onCreateUser(function(options, user){
    var firstName, lastName, fbLink;
    if(user.services.facebook)
    {
      console.log(user.services.facebook);
      firstName = user.services.facebook.first_name;
      lastName = user.services.facebook.last_name;
      fbLink = user.services.facebook.link;

      //graph request for picture
    }
    else{
      console.log("Error");
    }
    var profile ={
                      firstName:firstName,
                      lastName:lastName,
                      picture:"", //url of picture in mongoDB
                      facebook_url:fbLink,
                      biography:"",
                      //college:"",
                      //locations_id:[] //we can store all the locations and just retrieve the last
                      roles_ids: [], //save past roles 
                      skill_ids:[],
                      projects_id:[],
                      followers:{count:0, users:[]},
                      following:{count: 0, users:[], projects:[]}
                    }
    user.profile = profile;
    return user;
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
