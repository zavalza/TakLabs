Template.editProject.events({
'change #type' : function(evt, tmpl){
  var value = tmpl.find('#type').value;
  //alert(this._id);
  if (value != '')
  {
    Meteor.call('pushProjectType', Session.get('url'), value);
    if(Session.get('lastType')!= '')
    {

      Meteor.call('pullProjectType', Session.get('url'), Session.get('lastType'))
    }
  }
  else
  {
    Meteor.call('pullProjectType', Session.get('url'), Session.get('lastType'))
  }
},

'click #type' : function(evt, tmpl){
  var value = tmpl.find('#type').value;
  //alert(this._id);
    Session.set('lastType', value);
},

'click #stage' : function(evt, tmpl){
 var stageId = evt.target.value;
  //alert(this._id);
    Session.set('lastStage', stageId);
},

'change #stage' : function(evt, tmpl){
  var stageId = evt.target.value;
  //alert(this._id);
  if (stageId != '')
  {
    Meteor.call('pushProjectTag', Session.get('url'), stageId);
    if(Session.get('lastStage')!= '')
    {

      Meteor.call('pullProjectTag', Session.get('url'), Session.get('lastStage'))
    }
  }
  else
  {
    Meteor.call('pullProjectTag', Session.get('url'), Session.get('lastStage'))
  }
},

'change #logo' : function(evt, tmpl) {
    var error = false;
    if(this.logo){
      //alert('Ya tenía un logo');
      Meteor.call('deleteProjectLogo', Session.get('url'), this.logo)
    }
    FS.Utility.eachFile(evt, function(file) {
      im = Images.insert(file, function (err, fileObj) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err){
          error = true;
        }
      });
      if(!error)
      {

        //alert(EJSON.stringify(im));
        Meteor.call("updateProjectLogo", Session.get('url'), im._id);
        //var encontrada = Images.findOne({_id : im._id});
        //alert(encontrada._id)
      }   
    });
  },

'change #image' : function(evt, tmpl) {
    var error = false;
    //Esto no debería de ir en el server??
    FS.Utility.eachFile(evt, function(file) {
      im = Images.insert(file, function (err, fileObj) {
        //Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        if(err){
          error = true;
        }
      });
      if(!error)
      {
        Meteor.call("addScreenshot", Session.get('url'), im._id);
        //var encontrada = Images.findOne({_id : im._id});
        //alert(encontrada._id)
      }   
    });
  },

  'mousedown .saveTag' : function(evt, tmpl){
      var targetName = evt.target.name;
      //alert (targetName)
      var value = tmpl.find('#'+targetName).value.trim();
      value = value[0].toUpperCase() + value.slice(1);
       var re = /([a-zA-Z]+)/g;
      if(Meteor.userId() && value.match(re))
      {
        var doc={
                  type: targetName,
                  name:value,
                  counter:{
                    people: 0,
                    projects: 0,
                  },
                  referrer: document.referrer, 
                  timestamp: new Date(),
                }
        var tagId = Meteor.call('saveProjectTag', Session.get('url'), doc);
        tmpl.find('#'+targetName).value = "";
        tmpl.find('#'+targetName).blur();
        document.getElementById(targetName+'options').style.display='none';
      }
      else
      {
        alert("Error al guardar etiqueta");
      }
    },

'change #name,#purpose,#description' :function (evt, tmpl){
  var targetId = evt.target.id;
  var value= tmpl.find('#'+targetId).value;
  var re = /([a-zA-Z]+)/g;

  if(value.match(re))
  { 
    Meteor.call('updateProjectText', Session.get('url'), targetId, value);
  }
},

'change #project_url,#fb_url,#twitter_url,#video_url': function (evt, tmpl){
var targetId = evt.target.id;
var link = tmpl.find('#'+targetId).value;
var re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
if(!link.match(re))
{
  alert("No es una liga válida");
}
else
{
  Meteor.call('updateProjectLink', Session.get('url'), targetId, link);
}
},

  
  'click .pullProjectType': function(evt, tmpl){
  //alert(this);
  Meteor.call('pullProjectType', Session.get('url'), this.toString());
},

'click .deleteScreenshot': function(evt, tmpl){
  //alert(this._id)

  Meteor.call('deleteScreenshot', Session.get('url'), this._id);
},

'click .deleteLogo': function(evt, tmpl){
  //alert(this._id)

  Meteor.call('deleteProjectLogo', Session.get('url'), this._id);
},

'keyup #City,#User,#Market,#Industry,#Tag' : function(evt, tmpl){
      //busca todo el string y no palabra por palabra
      var targetId = evt.target.id;
      //alert(targetId)
      filter = tmpl.find('#'+targetId).value.trim().toUpperCase();
      var re = /([a-zA-Z]+)/g;
      var options = document.getElementsByClassName(targetId);
      var matches = [];
      for (var i = 0; i < options.length; i++) {

        if (filter.match(re)){
          var name = options[i].innerHTML;
          //alert(name);
          if (name.toUpperCase().indexOf(filter) == 0)
              {
                document.getElementById(targetId+'Options').style.display='inline';
                options[i].style.display = 'list-item';
                //options[i].className = targetId;
                matches.push(options[i]);
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

      var key =evt.keyCode;
      //alert(key);
      var selection = Session.get('keyControl');

      switch(key){
        case 40: //Down
          if(selection+1 < matches.length) 
            selection = selection+1;
        break;
        case 38: //Up
          if(selection-1 >= 0)
          selection = selection -1;
        break;
        case 13: //Return
          if(targetId == 'User')
          {

              var typeOfExperience = tmpl.find('#Experience').value.trim();
              var name = tmpl.find('#User').value.trim()
              var re = /([a-zA-Z]+)/g;
              if (typeOfExperience != "" && name.match(re))
              {
                  if(matches.length == 0) //New user name
                  {
                  //alert (name);
                   Meteor.call('addMember', Session.get('url'), typeOfExperience, name);
                  }
                  else
                  {

                    var personId =  matches[selection].id;
                    var personDoc = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    person_id: personId
                    };
                    var projectDoc = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    project_id: Session.get('currentProjectId')
                    };
                    Meteor.call('pushExperience', personId, Session.get('currentProjectId'), projectDoc, personDoc);
              }
            }
            else
            {
            alert ("Selecciona un tipo de experiencia y escribe un nombre");
            }

              
          }
          else
          {
            if(matches.length == 0) //New tag
            {
              var value = tmpl.find('#'+targetId).value.trim();
              value = value[0].toUpperCase() + value.slice(1);
               var re = /([a-zA-Z]+)/g;
              if(Meteor.userId() && value.match(re))
              {
                var doc={
                          type: targetId,
                          name:value,
                          counter:{
                            people: 0,
                            projects: 0,
                          },
                          referrer: document.referrer, 
                          timestamp: new Date(),
                        }
                Meteor.call('saveProjectTag', Session.get('url'), doc);
             }
            } 
            else

            {
              if(targetId == 'Tag') //tags of profile the idea is looking for
          {
             Meteor.call('pushPersonTag', Session.get('url'), matches[selection].getAttribute('name'));
          }
          else
               Meteor.call('pushProjectTag', Session.get('url'), matches[selection].getAttribute('name'));
          }
          }
          tmpl.find('#'+targetId).value = "";
            tmpl.find('#'+targetId).blur();
            document.getElementById(targetId+'Options').style.display='none';
        break;
        default:
          selection = -1;
        break;
      }

      for(var j=0; j < matches.length; j++)
      {
        if(j==selection)
          matches[j].className =targetId+' list-group-item active';
        else
          matches[j].className = targetId+' list-group-item';
      }
      matches = [];
      //Session.set('keyControl', 0);
      Session.set('keyControl', selection);
      //alert(selection);
    },


    'blur #City,#User,#Market,#Industry,#Tag' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert(evt.currentTarget.id);
      Session.set('keyControl', -1);
      tmpl.find('#'+targetId).value = "";
      document.getElementById(targetId+'Options').style.display='none';
      
    },

    'mousedown .City,.Market,.Industry,.Tag' : function (evt, tmpl){
      //alert(this._id);
      //alert (targetClass);
      var targetClass = evt.target.getAttribute('class');
      //alert(targetClass);
      if(targetClass.lastIndexOf('Tag') != -1)
          {
             Meteor.call('pushPersonTag', Session.get('url'),  this._id);
          }
      else
      {

      Meteor.call('pushProjectTag', Session.get('url'), this._id);
      }
      //return true;
    },
    
    'click .pullProjectTag' : function(evt, tmpl){
       Meteor.call('pullProjectTag', Session.get('url'), this._id);
    },

    'click .pullPersonTag' : function(evt, tmpl){
       Meteor.call('pullPersonTag', Session.get('url'), this._id);
    }
  });

  

    Template.editProject.helpers ({
        cityOptions : function()
        {
          return Tags.find({type:'City'});
        },

        areaOptions : function()
        {
          return Tags.find({type:'Area'});
        },

        selected:function()
        {
          return Projects.findOne({url:Session.get('url'), tag_ids:this._id});
        },

        city: function(tagId)
        {
          return Tags.find({_id:tagId, type:'City'});
        },

        market: function(tagId)
        {
          return Tags.find({_id:tagId, type:'Market'});
        },

        industry: function(tagId)
        {
          return Tags.find({_id:tagId, type:'Industry'});
        },

        tag: function(personTags)
        {
          return Tags.find({_id:{$in:personTags}});
        },



        project: function()
        {
          return Projects.find({url:Session.get('url')});
        },

        typeOfProjectOptions: function()
        {
          return Tags.find({type:'TypeOfProject'});
        },

         projectStageOptions: function()
        {
          return Tags.find({type:'ProjectStage'});
        },

        image: function(ids)
        {
          if (typeof (ids) == 'object')
          return Images.find({_id:{$in: ids}});
          else
          {
            //alert(typeof (ids)) string
            return Images.find({_id:ids})
          }
          
        },

         videoCode: function(video_url)
        {
          var array=[];

          var videoCode = video_url.substr(video_url.lastIndexOf('/')+1);
          array.push(videoCode);
          //alert(videoCode)
          return array;
        },

        isYoutube: function(video_url)
        {
          return (video_url.search('youtu') != -1);
        },

        isVimeo: function(video_url)
        {
          return (video_url.search('vimeo') != -1);
        },

        founder: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            if (teamArray[i].type=="Fundador")
            {
              idsToFind.push(teamArray[i].user_id);
            }
          }
          return Meteor.users.find({_id:{$in:idsToFind}});
        },

        teamMember: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            //alert(teamArray[i].type)
            if (teamArray[i].type=="Miembro del equipo")
            {
              idsToFind.push(teamArray[i].user_id);
            }
          }
          return Meteor.users.find({_id:{$in:idsToFind}});
        },

        investor: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            if (teamArray[i].type=="Inversionista")
            {
              idsToFind.push(teamArray[i].user_id);
            }
          }
          return Meteor.users.find({_id:{$in:idsToFind}});
        }
    });