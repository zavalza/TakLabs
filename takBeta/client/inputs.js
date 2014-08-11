

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
                  types: [], //startup, incubator, accelerator, cowork etc.
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
