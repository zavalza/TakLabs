Template.projectProfile.rendered = function()
{
  document.body.scrollTop = document.documentElement.scrollTop = 0;
}

Template.profileThumbnail.rendered = function()
{
  var maxHeight = 0;
  $('.cvText').each(function(){
        var h = $(this).height();
        if(h > maxHeight)
        {
          //alert(h);
          maxHeight = h;
        }
    });
  $('.cvText').each(function(){
        $(this).css('height',maxHeight+1);
    });
}

Template.projectProfile.events({
  'mouseenter .screenshot':function(evt, tmpl){
    Session.set("screenshotToShow",this._id);
  },

  'click .deleteImpulse': function(evt, tmpl)
  {
    //alert(evt.target.id)
    //alert(this._id);
    Meteor.call('deleteImpulse', Session.get('url'), evt.target.id);
  },

  'click .giveInterest': function(evt, tmpl)
  {
    //alert(evt.target.id)
    //alert(this._id);
    Meteor.call('giveInterest', evt.target.id, Meteor.user().person_id);
    alert('Le enviaremos tú información al líder del equipo, espera a que te contacten');
  },


  'click .follow': function(evt, tmpl)
  {
    //alert(evt.target.id)
    //alert(this._id);
    Meteor.call('pushFollower', evt.target.id, Meteor.user().person_id);
  },

 'click .unfollow': function(evt, tmpl)
  {
    //alert(evt.target.id)
    //alert(this._id);
    Meteor.call('pullFollower', evt.target.id, Meteor.user().person_id);
  },

  'click .saveComment': function(evt, tmpl)
  {
    //alert(evt.target.id)
    //alert(this._id);
    var comment = tmpl.find('#newComment').value;
    //alert (comment)
    tmpl.find('#newComment').value = "";
    Meteor.call('saveComment', evt.target.id, comment,  Meteor.user().person_id);
  }, 



});


 Template.projectProfile.screenshotToShow = function() {
    var selection = Session.get("screenshotToShow");
    if(selection)
      return selection
    else
      return this.screenshots[0]
  };

  Template.projectProfile.someDescription = function()
  {
    return (this.description||this.video_url||this.screenshots);
  }

Template.profileThumbnail.helpers({
  project: function(projectId)
        {
            return Projects.find({_id:projectId}); 
        },

    miniCV: function(experience)
  {
    var CV = [];
    for(var i = 0; i < experience.length; i++)
    { 
      var text;
      if(experience[i].title)
      {
        text = experience[i].title;
      }
      else
      {
        text = experience[i].type;
      }
      var doc= {string: text,
                project_id: experience[i].project_id}
      if(experience[i].project_id == Session.get('currentProjectId'))
      {
        CV.splice(0,0,doc);
      }
      else
      {

        CV.push(doc);
      }
        
    }
    //alert(EJSON.stringify(CV))
    return CV.slice(0,4);
  }
})

Template.projectProfile.helpers ({
        canEdit: function(personId)
    {
      //return true;
      return People.find({_id: personId,
        supporting: Session.get('currentProjectId')});
    },

         hadInterest: function(personId)
    {
      //return true;
      return Projects.findOne({_id: Session.get('currentProjectId'), people:personId});
    },


         hadLiked: function(personId)
    {
      //return true;
      return Projects.findOne({_id: Session.get('currentProjectId'), followers:personId});
    },

    person:function(personId)
    {
      return People.find({_id:personId});
    },

      city: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'City'});
      },

      area: function(tagsArray)
      {
      
        return Tags.find({_id:{$in:tagsArray}, type:'Area'});
      },

      industry: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'Industry'});
      },

      market: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'Market'});
      },

      typeOfProject: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'TypeOfProject'});
      },

      impulse: function (impulseIds)
      {
        return Impulses.find({_id:{$in:impulseIds}});
      },
      
       type: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}, type:"ImpulseType"});
      },

      tag: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}});
      },

      reward: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}, type:"RewardType"});
      },

        project: function(projectId)
        {
          if(projectId)
            return Projects.find({_id:projectId});
          else
          {
            //alert(Session.get('currentProjectId'));
             return Projects.find({_id:Session.get('currentProjectId')});
          }
           
        },

          externalLink: function(url)
        {
          var ret=[]
          if(url.search('http') != -1)
            {
              ret.push(url)
            }
          else
          {
            ret.push("http://"+url);
          }

           return ret;
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
              idsToFind.push(teamArray[i].person_id);
            }
          }
          Meteor.subscribe("manyPersons", idsToFind);
          return People.find({_id:{$in:idsToFind}});
        },

        teamMember: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            //alert(teamArray[i].type)
            if (teamArray[i].type=="Miembro del equipo")
            {
              idsToFind.push(teamArray[i].person_id);
            }
          }
          Meteor.subscribe("manyPersons", idsToFind);
          return People.find({_id:{$in:idsToFind}});
        },

        investor: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            if (teamArray[i].type=="Inversionista")
            {
              idsToFind.push(teamArray[i].person_id);
            }
          }
          Meteor.subscribe("manyPersons", idsToFind);
          return People.find({_id:{$in:idsToFind}});
        },
        otherRole: function(teamArray)
        {
          var idsToFind=[];
          for(var i=0; i < teamArray.length; i++)
          {
            if (teamArray[i].type=="Asesor" || teamArray[i].type=="Miembro del consejo" )
            {
              idsToFind.push(teamArray[i].person_id);
            }
          }
          Meteor.subscribe("manyPersons", idsToFind);
          return People.find({_id:{$in:idsToFind}});
        },
    });