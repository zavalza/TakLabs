

  Template.portafolioInput.events({
    'click .addLink' : function (evt, tmpl){
      //alert(this._id);
      var link = tmpl.find('#newLink').value;
      var re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (link.match(re))
      {
        Meteor.call('addLink', Session.get('userToShow'), link);
        tmpl.find('#newLink').value = "";
      }
      else
      {
        alert("No parece una liga válida, revisa que no haya ningún signo '?'");
      }
      //document.getElementById('SkillOptions').style.display='none';
      return true;
    },
  });

  Template.experienceInput.events({
    'mousedown .Project': function(evt, tmpl){
      var projectName = evt.target.id.trim();
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
                    person_id: Session.get('userToShow')
                  };
        var projectDoc = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    project_id: this._id
        };
      Meteor.call('pushExperience', Session.get('userToShow'), this._id, projectDoc, personDoc);
      }
      else
      {
        alert ("Selecciona un tipo de experiencia");
      }
    },

    'mousedown .addExperience' : function(evt, tmpl){
      var typeOfExperience = tmpl.find('#Experience').value.trim();
      var projectName = tmpl.find('#Project').value.trim()
      var re = /([a-zA-Z]+)/g;
      if (typeOfExperience != "" && projectName.match(re))
      {
        var newProject={
                  types: [], //startup, incubator, accelerator, cowork etc.
                  name:projectName,
                  url:null,
                  logo:"", //id of logo image
                  description:"",
                  highConcept:"",
                  project_url:"",
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
                    person_id: Session.get('userToShow')
                  }],
                  followers:{count:0, user_ids:[]},
                  referrer: document.referrer, 
                  timestamp: new Date(),
                  isPublic:true
                }
          Meteor.call('addExperience', Session.get('userToShow'), typeOfExperience, newProject);
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

    Template.marketInput.helpers({
       marketOptions: function()
       {
        return Tags.find({type:'Market'});
       }
    });

    Template.industryInput.helpers({
        industryOptions: function()
       {
        return Tags.find({type:'Industrie'});
       }
     });


    Template.skillsInput.helpers({
       skillOptions : function()
        {
          return Tags.find({type:'Skill'});
        },
    });

    Template.collegesInput.helpers({
       collegeOptions : function()
        {
          return Tags.find({type:'College'});
        },
    });

    Template.rolesInput.helpers({
       roleOptions : function()
        {
          return Tags.find({type:'Role'});
        }
    });

    Template.experienceInput.helpers ({
        projectOptions : function()
        {
          return Projects.find();
        }
    });
