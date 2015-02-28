Template.newProject.rendered = function () {
  if(Meteor.userId() == null)
  {
    alert('Debes iniciar sesión antes');
    Session.set('hasIdea', true);
    Router.go('loginForm');
  }
}

Template.newProject.events({
    'keyup #Market,#Industry,#Tag' : function(evt, tmpl){
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
          //alert('Enter')
          if(targetId == 'Tag') //tags of profile the idea is looking for
          {
            var personTags = Session.get('personTags');
            personTags.push(matches[selection].getAttribute('name'));
            Session.set('personTags', personTags);
          }
          else
          {
            var tagsArray = Session.get("selectedTags");
          tagsArray.push(matches[selection].getAttribute('name'));
          Session.set('selectedTags', tagsArray);
          }
          
          //alert(Session.get('selectedTags'));
          //alert(EJSON.stringify(Session.get('selectedTags')));
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

    'blur #Market,#Industry,#Tag' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert(evt.currentTarget.id);
      Session.set('keyControl', -1);
      tmpl.find('#'+targetId).value = "";
      document.getElementById(targetId+'Options').style.display='none';
      
    },

    'mousedown .Market,.Industry,.Tag' : function (evt, tmpl){
      //alert(this._id);
      var targetClass = evt.target.getAttribute('class');
      //alert(targetClass);
      if(targetClass.lastIndexOf('Tag') != -1)
      {
        var personTags = Session.get('personTags');
            personTags.push(evt.target.getAttribute('name'));
            Session.set('personTags', personTags);
      }
      else
      {

      var tagsArray = Session.get("selectedTags");
      //alert(evt.target.getAttribute('name'));
      tagsArray.push(evt.target.getAttribute('name'));
      Session.set('selectedTags', tagsArray);
      }
      //blur event is called after mousedown
    },
    'click .pullTag' : function(evt, tmpl){
      //alert (targetName)
      var tagsArray = Session.get('selectedTags');
      var pos= tagsArray.indexOf(evt.target.getAttribute('name'));/////ESTO y pullprojectTag
      tagsArray.splice(pos, 1);
      Session.set('selectedTags', tagsArray);
      
    },

    'click .pullPersonTag' : function(evt, tmpl){
      //alert (targetName)
      var personTags = Session.get('personTags');
      var pos= personTags.indexOf(evt.target.getAttribute('name'));
      personTags.splice(pos, 1);
      Session.set('personTags', personTags);
      
    },



    'change #logo' : function(evt, tmpl) {
    var error = false;
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
       Session.set('logo', im._id);
        //var encontrada = Images.findOne({_id : im._id});
        //alert(encontrada._id)
      }   
    });
  },
'change .working': function(evt, tmpl){
  if(evt.target.checked && evt.target.value=='true')
  {
    Session.set('working', true);
  }
  else
  {
    Session.set('working', false);
  }

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
        var screenshots = Session.get('screenshots');
        screenshots.push(im._id);
        Session.set('screenshots', screenshots);
        //var encontrada = Images.findOne({_id : im._id});
        //alert(encontrada._id)
      }   
    });
  },
    'change #video_url': function (evt, tmpl){
    var targetId = evt.target.id;
    var link = tmpl.find('#'+targetId).value;
    var re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if(!link.match(re))
    {
      alert("No es una liga válida");
    }
    else
    {
     Session.set('video_url', link);
    }
    },
    'click .cancel':function(evt, tmpl)
    {
      window.history.back();
    },
    'click .saveProject': function(evt, tmpl)
    {
      //alert('salvar');
      var name= tmpl.find('#name').value;
      var purpose = tmpl.find('#problem').value;
      var area = tmpl.find('#area').value;
      var description = tmpl.find('#solution').value;

      var video_url = Session.get('video_url');
      var logo = Session.get('logo');
      
      var screenshots = Session.get('screenshots');
      
     
      if(name.length==0 || description.length == 0 || purpose.length ==0 || area.length == 0)
      {
        alert ('Por favor llena todos los campos');
        return false;
      }
      var personTags = Session.get('personTags');
      if(personTags.length == 0)
      {
        alert('Selecciona al menos un tag para el perfil');
        return false;
      }

      var tags = Session.get('selectedTags');
      tags.push(area);

      //var projectDoc = Projects.findOne({'url': Session.get('url')});
      var projectDoc = {
        //project_id: will be added on server side
        name:name,
        purpose:purpose,
        description:description,
        video_url: video_url,
        logo:logo, 
        screenshots: screenshots,
        person_tags:personTags,
        tag_ids: tags,
        team:[{
          person_id: Meteor.user().person_id,
          //hoursPerWeek:hoursPerWeek
        }]
          
      }
      Session.set('logo', null);
      Session.set('screenshots', []);
      Session.set('selectedTags', []);
      Session.set('personTags', []);
      Meteor.call('insertProject', Meteor.user().person_id, projectDoc);
      //go to new idea profile
      //alert(EJSON.stringify(impulseDoc));
      window.history.back();
    }
  });

  Template.newProject.tag_ids = function()
  {
    return Session.get('selectedTags');
  }

  Template.newProject.personTags = function()
  {
    return Session.get('personTags');
  }

  Template.newProject.video_url = function()
  {
    return Session.get('video_url');
  }

  Template.newProject.screenshots = function()
  {
    return Session.get('screenshots');
  }

  Template.newProject.logo = function()
  {
    return Session.get('logo');
  }

  Template.newProject.working = function()
  {
    return Session.get('working');
  }

    Template.newProject.helpers ({
        cityOptions : function()
        {
          return Tags.find({type:'City'});
        },

        tag: function(tagsArray)
        {
          return Tags.find({_id:{$in:tagsArray}});
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
        },
        area: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Area'});
  },

  areaOptions : function()
        {
          return Tags.find({type:'Area'});
        },



    });