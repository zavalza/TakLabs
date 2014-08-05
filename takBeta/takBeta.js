
Companies = new Meteor.Collection("companies");
Skills = new Meteor.Collection("skills");
Cities = new Meteor.Collection("cities");
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
  this.route('editProfile', {path: '/'});
  this.route('loginForm', {path: '/entrar'});
  this.route('newUserForm', {path: '/registro'});
  this.route('news', {path: '/noticias'});
  this.route('projects', {path: '/proyectos'});
  this.route('editProfile', {path: '/editarPerfil'});
});


if (Meteor.isClient) {

  Meteor.startup(function () {
    //store roles in new user form
    Session.set("management", false);
    Session.set("development", true);
    Session.set("design", false);
    Session.set("investment", false);
    Session.set("marketing", false);
    Session.set("mentor", false);
    Session.set("sales", false);
    Session.set("selectedSkills", ['Javascript', 'MeteorJS']);
    Session.set("selectedLinks", ['https://github.com/zavalza']);
    Session.set("selectedExperience", []); //[{title: "Fundador"}]
    //Session.set('cityOptions', ['Monterrey', 'Guadalajara'])
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
        alert("Error en inicio de sesión");
      }
    }
  });

  Template.newUserForm.events({
    'click .tryFacebookLogin': function(evt, tmpl){
      if(!(Session.get('management')|| Session.get('development') || Session.get('design')|| Session.get('marketing')
        || Session.get('mentor') || Session.get('investment') || Session.get('sales')))
      {
        alert("Selecciona un rol");
        return false;
      }
      else
      {
        if(Accounts.loginServicesConfigured()){
        Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'user_friends', 'email']
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            //Success
            var roles={//roles to show in profile
                management: Session.get('management'),
                development: Session.get('development'), 
                design : Session.get('design'),
                marketing: Session.get('marketing'),
                mentor: Session.get('mentor'),
                investment: Session.get('investment'),
                sales: Session.get('sales')
            }
            Meteor.call('updateRoles', Meteor.userId(), roles);
            Router.go('editProfile');
          }
        }); 
        }
        else{
          alert("Error en inicio de sesión");
      }
      }
      
    }
  });
  Template.rolesImages.events({
  'click a' : function (evt, tmpl){
      var sourceName = evt.target.src;
      var variable = sourceName.slice(sourceName.lastIndexOf("/")+1, sourceName.lastIndexOf("."));
      //alert(variable);
       Session.set(variable, !Session.get(variable));
    },     
  });

  Template.editProfile.events({
    'change form' : function(evt, tmpl){
      var targetName = evt.target.id;
      //alert (targetName);
    },

    'keyup #City' : function(evt, tmpl){
      filter = tmpl.find('#City').value.trim().toUpperCase();
      var re = /([a-zA-Z]+)/g;
      var options = document.getElementsByClassName('city');
      for (var i = 0; i < options.length; i++) {

        if (filter.match(re)){
          var name = options[i].innerHTML;
          //alert(name);
          if (name.toUpperCase().indexOf(filter) == 0)
              {
                document.getElementById('cityOptions').style.display='inline';
                options[i].style.display = 'list-item';
              }
              
          else
              {
                options[i].style.display = 'none';
              }
              
        }
        else
        {
          document.getElementById('cityOptions').style.display='none';
          options[i].style.display = 'none';
        }
          
      }
    },

    'click .saveTag' : function(evt, tmpl){
      var targetName = evt.target.name;
      //alert (targetName)
      var value = tmpl.find('#'+targetName).value.trim();
       var re = /([a-zA-Z]+)/g;
      if(Meteor.userId() && value.match(re))
      {
        var doc={
                  name:value,
                  referrer: document.referrer, 
                  timestamp: new Date(),
                }
        var tagId = Meteor.call('save'+targetName, doc);
        tmpl.find('#'+targetName).blur();
      }
      else
      {
        alert("Error al guardar nombre");
      }
    }
  })

  Template.experienceInput.rendered=function() {
    $('.input-group.date').datepicker({
      format: "M-yyyy",
      minViewMode: 1, 
      language: "es",
      autoclose: true
      });
}
    Template.editProfile.helpers ({
        cityOptions : function()
        {
          return Cities.find();
        }
    });

  /*Template.editProfile.cityOptions = function(){
    return Session.get('cityOptions');
  }*/

  Template.skillsInput.selectedSkills = function(){
    return Session.get('selectedSkills');
  }

  Template.skillsInput.selectedLinks = function(){
    return Session.get('selectedLinks');
  }

  Template.experienceInput.selectedExperience = function(){
    return Session.get('selectedExperience');
  }

  Template.rolesImages.management = function(){
    return Session.get("management");
  }

  Template.rolesImages.development= function(){
    return Session.get("development");
  }
  Template.rolesImages.design = function(){
    return Session.get("design");
  }
  Template.rolesImages.investment = function(){
    return Session.get("investment");
  }
  Template.rolesImages.marketing = function(){
    return Session.get("marketing");
  }
  Template.rolesImages.mentor = function(){
    return Session.get("mentor");
  }
  Template.rolesImages.sales = function(){
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
    var firstName, lastName, fbLink, email;
    if(user.services.facebook)
    {
      console.log(user.services.facebook);
      firstName = user.services.facebook.first_name;
      lastName = user.services.facebook.last_name;
      email = user.services.facebook.email;
      fbLink = user.services.facebook.link;
      fbPicture = "http://graph.facebook.com/v2.0/" + user.services.facebook.id + "/picture/?type=large";
      //graph request for picture
    }
    else{
      console.log("Error");
    }
    var profile ={
                      firstName:firstName,
                      lastName:lastName,
                      email:email,
                      picture:fbPicture, //url of picture
                      facebook_url:fbLink,
                      location_ids:[], // ids of location, show just the last one
                      roles:{}, //roles to show in profile 
                      skill_ids:[],
                      portafolio_urls:[],
                      experience:{}, //current and past jobs with title, started, endend and id of the company
                      //github_url:
                      //twitter_url:
                      //linkedin_url:
                      //behance_url
                      colleges_ids:[],
                      followers:{count:0, user_ids:[]},
                      following:{count: 0, user_ids:[], company_ids:[]}
                    }
    //console.log(location);
    user.profile = profile;
    return user;
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
      updateRoles: function(userId, rolesDoc) {
          console.log('Updating roles of user ' + userId);
          Meteor.users.update({_id: userId},
          {$set: {'profile.roles':rolesDoc}});
      },

      pushCity: function(userId, cityId){
          console.log('Pushing city with id '+ cityId +' to user ' + userId);
          Meteor.users.update({_id: userId},
            {$push: {'profile.location_ids': cityId}});
          return true
      },

      saveCity: function(doc){
        //some protection method against duplication
        console.log('addingCity');
        cityId = Cities.insert(doc);
        console.log('new City has id '+ cityId);
        Meteor.call('pushCity', Meteor.userId(), cityId);
        return cityId;
      }
    });
}
