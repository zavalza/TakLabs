
Jobs = new Meteor.Collection("jobs");
Companies = new Meteor.Collection("companies");
Tags = new Meteor.Collection("tags");

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
  this.route('loginForm', {path: '/entrar'});
  this.route('newUserForm', {path: '/registro'});
  this.route('news', {path: '/noticias'});
  this.route('startups', {path: '/startups'});
  this.route('people', {path: '/personas'});
  this.route('editCompany', {path: '/editarCompania'});
  this.route('editProfile', {path: '/editarPerfil'});
  this.route('userProfile', {path: '/algo'})
});


if (Meteor.isClient) {

  Meteor.startup(function () {
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

  Template.editProfile.events({
    'change #firstName,#lastName,#email' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert (targetId);
      //verificar formato email
      var newValue = tmpl.find('#'+targetId).value.trim();
      Meteor.call('updateTextField', Meteor.userId(), targetId, newValue);
    },

    'click .pullTag' : function(evt, tmpl){
      var targetName = evt.target.name;
      //alert (targetName)
      if(Meteor.userId())
      {
        var sucess = Meteor.call('pullTag', Meteor.userId(), this._id);
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
                  type: targetName,
                  name:value,
                  referrer: document.referrer, 
                  timestamp: new Date(),
                }
        var tagId = Meteor.call('saveTag', doc);
        tmpl.find('#'+targetName).value = "";
        tmpl.find('#'+targetName).blur();
        document.getElementById(targetName+'options').style.display='none';
      }
      else
      {
        alert("Error al guardar etiqueta");
      }
    },

'keyup #City,#Skill,#College,#Role,#Company' : function(evt, tmpl){
      //busca todo el string y no palabra por palabra
      var targetId = evt.target.id;
      //alert(targetId)
      filter = tmpl.find('#'+targetId).value.trim().toUpperCase();
      var re = /([a-zA-Z]+)/g;
      var options = document.getElementsByClassName(targetId);
      for (var i = 0; i < options.length; i++) {

        if (filter.match(re)){
          var name = options[i].innerHTML;
          //alert(name);
          if (name.toUpperCase().indexOf(filter) == 0)
              {
                document.getElementById(targetId+'Options').style.display='inline';
                options[i].style.display = 'list-item';
              }
              
          else
              {
                options[i].style.display = 'none';
              }
              
        }
        else
        {
          document.getElementById(targetId+'Options').style.display='none';
          options[i].style.display = 'none';
        }
          
      }
    },

    'click .City,.Skill,.College,.Role' : function (evt, tmpl){
      //alert(this._id);
      var targetClass = evt.target.getAttribute('class');
      //alert (targetClass);
      Meteor.call('pushTag', Meteor.userId(), this._id);
      tmpl.find('#'+targetClass).value = "";
      tmpl.find('#'+targetClass).blur();
      document.getElementById(targetClass+'Options').style.display='none';
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
  };

  Template.experienceInput.events({
    'change #title,#startedAt,#endedAt': function(evt, tmpl){
      //alert(this.company_id);
      var field = evt.target.id;
      //alert(field);
      var value = evt.target.value.trim();
      //alert(value);
      Meteor.call('updateExperience', Meteor.userId(),this.company_id, field, value);
    },

    'click .Company': function(evt, tmpl){
      var companyName = evt.target.id.trim();
      //alert (this._id);
      var typeOfExperience = tmpl.find('#Experience').value.trim();
      if (typeOfExperience != "")
      {
        var personDoc = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    user_id: Meteor.userId()
                  };
        var companyDoc = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    company_id: this._id
        };
      Meteor.call('pushExperience', Meteor.userId(), this._id, companyDoc, personDoc);
      tmpl.find('#Company').value = "";
      tmpl.find('#Company').blur();
      document.getElementById('CompanyOptions').style.display='none';
      }
      else
      {
        alert ("Selecciona un tipo de experiencia");
      }
    },

    'click .deleteExperience': function(evt, tmpl){
       //alert(this.company_id);
       Meteor.call('deleteExperience', Meteor.userId(), this.company_id)
    },

    'click .addExperience' : function(evt, tmpl){
      var typeOfExperience = tmpl.find('#Experience').value.trim();
      var companyName = tmpl.find('#Company').value.trim()
      var re = /([a-zA-Z]+)/g;
      if (typeOfExperience != "" && companyName.match(re))
      {
        var newCompany={
                  type: "", //specify if it is a startup or incubator
                  name:companyName,
                  logo_url:"companyLogo.png", //path to default image
                  description:"",
                  highConcept:"",
                  company_url:"",
                  fb_url:"",
                  twitter_url:"",
                  tag_ids:[],
                  video_url:"",
                  screenshots:[],
                  team:[{
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    user_id: Meteor.userId()
                  }],
                  followers:{count:0, user_ids:[]},
                  referrer: document.referrer, 
                  timestamp: new Date(),
                }
          Meteor.call('addExperience', Meteor.userId(), typeOfExperience, newCompany);
      }
      else
      {
        alert ("Selecciona un tipo de experiencia y escribe una compañía");
      }
    }
  });

    Template.locationInput.helpers ({
        cityOptions : function()
        {
          return Tags.find({type:'City'});
        },

        location: function(tagId)
        {
          return Tags.find({_id:tagId, type:'City'});
        }

        
    });

    Template.skillsInput.helpers({
       skillOptions : function()
        {
          return Tags.find({type:'Skill'});
        },

      skill: function(tagId)
        {
          return Tags.find({_id:tagId, type:'Skill'});
        }
    });

    Template.collegesInput.helpers({
       collegeOptions : function()
        {
          return Tags.find({type:'College'});
        },

      college: function(tagId)
        {
          return Tags.find({_id:tagId, type:'College'});
        }
    });

    Template.rolesInput.helpers({
       roleOptions : function()
        {
          return Tags.find({type:'Role'});
        },

      role: function(tagId)
        {
          return Tags.find({_id:tagId, type:'Role'});
        }
    });

    Template.experienceInput.helpers ({
        companyOptions : function()
        {
          return Companies.find();
        },

        company: function(companyId)
        {
          return Companies.find({_id:companyId});
        }

        
    });

    Template.editCompany.helpers ({
        company: function()
        {
          return Companies.find({_id:"ygfidGRhcEvcSNRWw"});
        }
    });

    Template.userProfile.helpers({
       user: function()
       {
        return Meteor.users.find({_id: Meteor.userId()})
       },

       company: function(companyId)
       {
        return Companies.find({_id:companyId});
       },

       role: function(tagsArray)
       {
          return Tags.find({_id:{$in:tagsArray}, type: 'Role'}); 
       },

      city: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'City'});
      },

      college: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'College'});
      },

      skill: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'Skill'});
      }
    });

  Template.headerwrap.peopleAmount = function(){
    return 25;
  }

  Template.headerwrap.startupsAmount = function(){
    return 10;
  }


  Template.experienceInput.selectedExperience = function(){
    return Session.get('selectedExperience');
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
                      tag_ids:[],
                      portafolio_urls:[],
                      experience:[], //current and past jobs with title, started, ended and id of the company
                      //github_url:
                      //twitter_url:
                      //linkedin_url:
                      //behance_url
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

      updateTextField: function(userId, field, value){
          console.log('Updating field '+ field +' of user '+userId);
          switch(field){
            case ('firstName'):
            Meteor.users.update({_id: userId},
            {$set: {'profile.firstName':value}});
            break;
            case ('lastName'):
            Meteor.users.update({_id: userId},
            {$set: {'profile.lastName':value}});
            break;
            case('email'):
            Meteor.users.update({_id: userId},
            {$set: {'profile.email':value}});
            break;
            default: break;
          }
          
      },

      updateExperience: function(userId, companyId, field, value){
          console.log('Updating field '+ field +' of user '+userId + ' and company '+ companyId);
          switch(field){
            case ('title'):
            Meteor.users.update({_id: userId,'profile.experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'profile.experience.$.title':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'user_id': userId}}},
             {$set: {'team.$.title':value}});
            break;
            case ('startedAt'):
            Meteor.users.update({_id: userId,'profile.experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'profile.experience.$.startedAt':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'user_id': userId}}},
             {$set: {'team.$.startedAt':value}});
            break;
            case('endedAt'):
            Meteor.users.update({_id: userId,'profile.experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'profile.experience.$.endedAt':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'user_id': userId}}},
             {$set: {'team.$.endedAt':value}});
            break;
            default: break;
          }
          
      },

      pushExperience: function(userId, companyId, companyDoc, personDoc){
          console.log('Pushing experience to both '+userId+' and '+companyId);
          Meteor.users.update({_id: userId},
          {$push:{'profile.experience': companyDoc}});

          Companies.update({_id: companyId},
          {$push:{'team': personDoc}});
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

      addExperience: function(userId, typeOfExperience, companyDoc){
        console.log("Creating a new company")
        //Validar nombre no repetido?
        var companyId = Companies.insert(companyDoc);
        console.log('Adding experience to '+ userId);
        var experience = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    company_id: companyId
                  }
        Meteor.users.update({_id: userId},
          {$push:{'profile.experience': experience}});

      },

      deleteExperience: function(userId, companyId){
         Meteor.users.update({_id: userId},
             {$pull: {'profile.experience':{'company_id':companyId}}});
         Companies.update({_id: companyId},
             {$pull: {'team':{'user_id':userId}}});
      },



      pushTag: function(userId, tagId){
          console.log('Pushing tag with id '+ tagId +' to user ' + userId);
          Meteor.users.update({_id: userId},
            {$push: {'profile.tag_ids': tagId}});
          return true
      },

    
      pullTag: function (userId, tagId){
          console.log('Unlink tag with id '+ tagId +' from user '+ userId);
          Meteor.users.update({_id: userId},
            {$pull: {'profile.tag_ids': tagId}});
          return true
      },

    
      saveTag: function(doc){
        //some protection method against duplication
        console.log('addingTag');
        tagId = Tags.insert(doc);
        console.log('new tag has id '+ tagId);
        Meteor.call('pushTag', Meteor.userId(), tagId);
        return tagId;
      },
      
    });
}
