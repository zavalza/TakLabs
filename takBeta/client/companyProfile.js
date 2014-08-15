Template.companyProfile.events({
  'mouseenter .screenshot':function(evt, tmpl){
    Session.set("screenshotToShow",this._id);
  }
});


 Template.companyProfile.screenshotToShow = function() {
    var selection = Session.get("screenshotToShow");
    if(selection)
      return selection
    else
      return this.screenshots[0]
  };

Template.profileThumbnail.helpers({
  company: function(companyId)
        {
          if(companyId)
            return Companies.find({_id:companyId});
          else
          {
            alert(Session.get('currentCompanyId'));
             return Companies.find({_id:Session.get('currentCompanyId')});
          }
           
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
                company_id: experience[i].company_id}
      if(experience[i].company_id == Session.get('currentCompanyId'))
      {
        CV.splice(0,0,doc);
      }
      else
      {

        CV.push(doc);
      }
        
    }
    //alert(EJSON.stringify(CV))
    return CV;
  }
})

Template.companyProfile.helpers ({
        canEdit: function()
    {
      //return true;
      return (Meteor.users.find({_id: Meteor.userId(),
        'profile.experience':{$elemMatch:{'company_id': Session.get('currentCompanyId'), 'type':'Fundador'}}}).count() > 0);
    },

        company: function(companyId)
        {
          if(companyId)
            return Companies.find({_id:companyId});
          else
          {
            //alert(Session.get('currentCompanyId'));
             return Companies.find({_id:Session.get('currentCompanyId')});
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
              idsToFind.push(teamArray[i].user_id);
            }
          }
          Meteor.subscribe("manyUserProfiles", idsToFind);
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
          Meteor.subscribe("manyUserProfiles", idsToFind);
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
          Meteor.subscribe("manyUserProfiles", idsToFind);
          return Meteor.users.find({_id:{$in:idsToFind}});
        },
    });