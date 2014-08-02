
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
  this.route('projects', {path: '/projects'});
});


if (Meteor.isClient) {

  Meteor.startup(function () {
    Session.set("management", false);
    Session.set("development", false);
    Session.set("design", false);
    Session.set("investment", false);
    Session.set("marketing", false);
    Session.set("mentor", false);
    Session.set("sales", false);
  });
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
  Template.roles.events({
  'click a' : function (evt, tmpl){
      var sourceName = evt.target.src;
      var variable = sourceName.slice(sourceName.lastIndexOf("/")+1, sourceName.lastIndexOf("."));
      //alert(variable);
       Session.set(variable, !Session.get(variable));
    },     
  });

  Template.roles.management = function(){
    return Session.get("management");
  }

  Template.roles.development= function(){
    return Session.get("development");
  }
  Template.roles.design = function(){
    return Session.get("design");
  }
  Template.roles.investment = function(){
    return Session.get("investment");
  }
  Template.roles.marketing = function(){
    return Session.get("marketing");
  }
  Template.roles.mentor = function(){
    return Session.get("mentor");
  }
  Template.roles.sales = function(){
    return Session.get("sales");
  }

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
      fbPicture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";

      //graph request for picture
    }
    else{
      console.log("Error");
    }
    var profile ={
                      firstName:firstName,
                      lastName:lastName,
                      picture:fbPicture, //url of picture
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
