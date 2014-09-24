Template.newIdea.rendered = function () {
  if(Meteor.userId() == null)
  {
    alert('Debes iniciar sesión antes');
    Session.set('hasIdea', true);
    Router.go('loginForm');
  }
}

Template.newIdea.events({
    'keyup #Tag' : function(evt, tmpl){
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
          var tagsArray = Session.get("selectedTags");
          tagsArray.push(matches[selection].id);
          Session.set('selectedTags', tagsArray);
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

    'blur #Tag' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert(evt.currentTarget.id);
      Session.set('keyControl', -1);
      tmpl.find('#'+targetId).value = "";
      document.getElementById(targetId+'Options').style.display='none';
      
    },

    'mousedown .Tag' : function (evt, tmpl){
      //alert(this._id);
      var targetClass = evt.target.getAttribute('class');
      var tagsArray = Session.get("selectedTags");
      tagsArray.push(evt.target.id);
      Session.set('selectedTags', tagsArray);
      //blur event is called after mousedown
    },
    'click .pullTag' : function(evt, tmpl){
      //alert (targetName)
      var tagsArray = Session.get('selectedTags');
      var pos= tagsArray.indexOf(evt.target.id);
      tagsArray.splice(pos, 1);
      Session.set('selectedTags', tagsArray);
      
    },
    'click .saveIdea': function(evt, tmpl)
    {
      //alert('salvar');
      var name= tmpl.find('#name').value;
      var purpose = tmpl.find('#purpose').value;
      var description = tmpl.find('#description').value;
      //var type = tmpl.find('#impulseType').value;
      //var remotes = document.getElementsByName('remote');
      /*for(var i = 0; i < remotes.length; i++)
      {
        if(remotes[i].checked)
           var remote= remotes[i].value;
      }*/
     
      if(name.length==0 || description.length == 0 || purpose.length ==0)
      {
        alert ('Por favor llena todos los campos');
        return false;
      }
      /*var tags = Session.get('selectedTags');
      if(tags.length == 0)
      {
        alert('Selecciona al menos un tag para el perfil');
        return false;
      }
      var reward_ids = [];
      var rewards = document.getElementsByName('reward');
      for (var i = 0; i < rewards.length; i++)
      {
        if(rewards[i].checked)
        {
          //alert(rewards[i].id);
          reward_ids.push(rewards[i].id);
        }
      }
      if(reward_ids.length == 0)
      {
        alert ("Selecciona qué darás a cambio");
        return false;
      }
      reward_ids.push(type);*/

      //var projectDoc = Projects.findOne({'url': Session.get('url')});
      var ideaDoc = {
        //project_id: will be added on server side
        name:name,
        purpose:purpose,
        description:description,
        //person_tags:tags,
        //remote:remote,
        //tag_ids:reward_ids
      }
      Meteor.call('insertIdea', Meteor.user().person_id, ideaDoc);
      //go to new idea profile
      //alert(EJSON.stringify(impulseDoc));
      window.history.back();
    }
  });

    Template.newIdea.helpers ({
        cityOptions : function()
        {
          return Tags.find({type:'City'});
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