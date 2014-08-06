
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
      //verificar formato email
    },

    'click .pullTag' : function(evt, tmpl){
      var targetName = evt.target.name;
      //alert (targetName)
      if(Meteor.userId())
      {
        var sucess = Meteor.call('pull'+targetName, Meteor.userId(), this._id);
      }
      else
      {
        alert("Error al borrar etiqueta");
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
        tmpl.find('#'+targetName).value = "";
        tmpl.find('#'+targetName).blur();
        document.getElementById(targetName+'options').style.display='none';
      }
      else
      {
        alert("Error al guardar etiqueta");
      }
    }
  })

  Template.locationInput.events({
'keyup #City' : function(evt, tmpl){
      //busca todo el string y no palabra por palabra
      filter = tmpl.find('#City').value.trim().toUpperCase();
      var re = /([a-zA-Z]+)/g;
      var options = document.getElementsByClassName('city');
      for (var i = 0; i < options.length; i++) {

        if (filter.match(re)){
          var name = options[i].innerHTML;
          //alert(name);
          if (name.toUpperCase().indexOf(filter) == 0)
              {
                document.getElementById('CityOptions').style.display='inline';
                options[i].style.display = 'list-item';
              }
              
          else
              {
                options[i].style.display = 'none';
              }
              
        }
        else
        {
          document.getElementById('CityOptions').style.display='none';
          options[i].style.display = 'none';
        }
          
      }
    },

    'click .city' : function (evt, tmpl){
      //alert(this._id);
      Meteor.call('pushCity', Meteor.userId(), this._id);
      tmpl.find('#City').value = "";
      tmpl.find('#City').blur();
      document.getElementById('CityOptions').style.display='none';
      return true;
    }
  });

  Template.skillsInput.events({
    'keyup #Skill' : function(evt, tmpl){
      filter = tmpl.find('#Skill').value.trim().toUpperCase();
      var re = /([a-zA-Z]+)/g;
      var options = document.getElementsByClassName('skill');
      for (var i = 0; i < options.length; i++) {

        if (filter.match(re)){
          var name = options[i].innerHTML;
          //alert(name);
          if (name.toUpperCase().indexOf(filter) == 0)
              {
                document.getElementById('SkillOptions').style.display='inline';
                options[i].style.display = 'list-item';
              }
              
          else
              {
                options[i].style.display = 'none';
              }
              
        }
        else
        {
          document.getElementById('SkillOptions').style.display='none';
          options[i].style.display = 'none';
        }
          
      }
    },

    'click .skill' : function (evt, tmpl){
      //alert(this._id);
      Meteor.call('pushSkill', Meteor.userId(), this._id);
      tmpl.find('#Skill').value = "";
      tmpl.find('#Skill').blur();
      document.getElementById('SkillOptions').style.display='none';
      return true;
    }

  });

Template.collegesInput.events({
    'keyup #College' : function(evt, tmpl){
      filter = tmpl.find('#College').value.trim().toUpperCase();
      var re = /([a-zA-Z]+)/g;
      var options = document.getElementsByClassName('college');
      for (var i = 0; i < options.length; i++) {

        if (filter.match(re)){
          var name = options[i].innerHTML;
          //alert(name);
          if (name.toUpperCase().indexOf(filter) == 0)
              {
                document.getElementById('CollegeOptions').style.display='inline';
                options[i].style.display = 'list-item';
              }
              
          else
              {
                options[i].style.display = 'none';
              }
              
        }
        else
        {
          document.getElementById('CollegeOptions').style.display='none';
          options[i].style.display = 'none';
        }
          
      }
    },

    'click .college' : function (evt, tmpl){
      //alert(this._id);
      Meteor.call('pushCollege', Meteor.userId(), this._id);
      tmpl.find('#College').value = "";
      tmpl.find('#College').blur();
      document.getElementById('CollegeOptions').style.display='none';
      return true;
    }

  });

  Template.portafolioInput.events({
    'click .addLink' : function (evt, tmpl){
      //alert(this._id);
      var link = tmpl.find('#newLink').value;
      var re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (link.match(re))
      {
        Meteor.call('addLink', Meteor.userId(), link);
        tmpl.find('#newLink').value = "";
      }
      else
      {
        alert('No parece una liga válida');
      }
      //document.getElementById('SkillOptions').style.display='none';
      return true;
    },

    'click .deleteLink' : function (evt, tmpl){
      //alert(this.toString());
      Meteor.call('deleteLink', Meteor.userId(), this.toString());
      return true;
    }
  });

  Template.experienceInput.rendered=function() {
    $('.input-group.date').datepicker({
      format: "M-yyyy",
      minViewMode: 1, 
      language: "es",
      autoclose: true
      });
}
    Template.locationInput.helpers ({
        cityOptions : function()
        {
          return Cities.find();
        },

        location: function(locationId)
        {
          return Cities.find({_id:locationId});
        }

        
    });

    Template.skillsInput.helpers({
       skillOptions : function()
        {
          return Skills.find();
        },

      skill: function(skillId)
        {
          return Skills.find({_id:skillId});
        }
    });

    Template.collegesInput.helpers({
       collegeOptions : function()
        {
          return Colleges.find();
        },

      college: function(collegeId)
        {
          return Colleges.find({_id:collegeId});
        }
    });

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
                      college_ids:[],
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

      addLink: function(userId, link){
          console.log('Adding a link to profile '+ userId);
          Meteor.users.update({_id: userId},
          {$push:{'profile.portafolio_urls': link}});
      },

      deleteLink: function(userId, link){
          console.log('Deleting the link '+link +' of profile '+ userId);
          Meteor.users.update({_id: userId},
          {$pull:{'profile.portafolio_urls': link}});
      },


      pushCity: function(userId, cityId){
          console.log('Pushing city with id '+ cityId +' to user ' + userId);
          Meteor.users.update({_id: userId},
            {$push: {'profile.location_ids': cityId}});
          return true
      },

       pushSkill: function(userId, skillId){
          console.log('Pushing skill with id '+ skillId +' to user ' + userId);
          Meteor.users.update({_id: userId},
            {$push: {'profile.skill_ids': skillId}});
          return true
      },

       pushCollege: function(userId, collegeId){
          console.log('Pushing college with id '+ collegeId +' to user ' + userId);
          Meteor.users.update({_id: userId},
            {$push: {'profile.college_ids': collegeId}});
          return true
      },

      pullCity: function (userId, cityId){
          console.log('Unlink city with id '+ cityId +' from user '+ userId);
          Meteor.users.update({_id: userId},
            {$pull: {'profile.location_ids': cityId}});
          return true
      },

      pullSkill: function (userId, skillId){
          console.log('Unlink skill with id '+ skillId +' from user '+ userId);
          Meteor.users.update({_id: userId},
            {$pull: {'profile.skill_ids': skillId}});
          return true
      },

      pullCollege: function (userId, collegeId){
          console.log('Unlink college with id '+ collegeId +' from user '+ userId);
          Meteor.users.update({_id: userId},
            {$pull: {'profile.college_ids': collegeId}});
          return true
      },

      saveCity: function(doc){
        //some protection method against duplication
        console.log('addingCity');
        cityId = Cities.insert(doc);
        console.log('new City has id '+ cityId);
        Meteor.call('pushCity', Meteor.userId(), cityId);
        return cityId;
      },
      saveSkill: function(doc){
        //some protection method against duplication
        console.log('addingSkill');
        skillId = Skills.insert(doc);
        console.log('new Skill has id '+ skillId);
        Meteor.call('pushSkill', Meteor.userId(), skillId);
        return skillId;
      },
      saveCollege: function(doc){
        //some protection method against duplication
        console.log('addingCollege');
        collegeId = Colleges.insert(doc);
        console.log('new College has id '+ collegeId);
        Meteor.call('pushCollege', Meteor.userId(), collegeId);
        return collegeId;
      }
    });
}
