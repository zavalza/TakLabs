Template.editCompany.events({
'change #type' : function(evt, tmpl){
  var value = tmpl.find('#type').value;
  //alert(this._id);
  Meteor.call('pushCompanyType', Session.get('url'), value);
},

'change #logo' : function(evt, tmpl) {
    var error = false;
    if(this.logo){
      //alert('Ya tenía un logo');
      Meteor.call('deleteCompanyLogo', Session.get('url'), this.logo)
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
        Meteor.call("updateCompanyLogo", Session.get('url'), im._id);
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

'change #name,#highConcept,#City,#description' :function (evt, tmpl){
  var targetId = evt.target.id;
  var value= tmpl.find('#'+targetId).value;
  var re = /([a-zA-Z]+)/g;

  if(value.match(re))
  { if (targetId=='City')
    {
      targetId = targetId.toLowerCase();
    }
    Meteor.call('updateCompanyText', Session.get('url'), targetId, value);
  }
},

'change #company_url,#fb_url,#twitter_url,#video_url': function (evt, tmpl){
var targetId = evt.target.id;
var link = tmpl.find('#'+targetId).value;
var re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
if(!link.match(re))
{
  alert("No es una liga válida");
}
else
{
  Meteor.call('updateCompanyLink', Session.get('url'), targetId, link);
}
},

'change #title,#startedAt,#endedAt': function(evt, tmpl){
      //alert(this.company_id);
      var field = evt.target.id;
      //alert(field);
      var value = evt.target.value.trim();
      //alert(value);
      Meteor.call('updateExperience', this.person_id, Session.get('currentCompanyId'), field, value);
  },

 'click .deleteExperience': function(evt, tmpl){
     //alert(this.company_id);
     Meteor.call('deleteExperience', this.person_id, Session.get('currentCompanyId'));
  },
'click .pullCompanyType': function(evt, tmpl){
  //alert(this);
  Meteor.call('pullCompanyType', Session.get('url'), this.toString());
},

'click .deleteScreenshot': function(evt, tmpl){
  //alert(this._id)

  Meteor.call('deleteScreenshot', Session.get('url'), this._id);
},

'click .deleteLogo': function(evt, tmpl){
  //alert(this._id)

  Meteor.call('deleteCompanyLogo', Session.get('url'), this._id);
},

'keyup #City,#User' : function(evt, tmpl){
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

    'click .City' : function (evt, tmpl){
      //alert(this._id);
      var targetClass = evt.target.getAttribute('class');
      //alert (targetClass);
      //Meteor.call('pushTag', Meteor.userId(), this._id);
      tmpl.find('#'+targetClass).value = this.name;
      Meteor.call('updateCompanyText', Session.get('url'), 'city', this.name);
      document.getElementById(targetClass+'Options').style.display='none';
      return true;
    }
  });

  Template.addMember.events({
    'click .addMember' : function(evt, tmpl){
      //alert("click")
    var typeOfExperience = tmpl.find('#Experience').value.trim();
    var name = tmpl.find('#User').value.trim()
    var re = /([a-zA-Z]+)/g;
    if (typeOfExperience != "" && name.match(re))
    {
    alert (name);
     Meteor.call('addMember', Session.get('url'), typeOfExperience, name);
    }
    else
    {
    alert ("Selecciona un tipo de experiencia y escribe un nombre");
    }
    },

    'click .User': function(evt, tmpl){
    var personId = evt.target.id.trim();
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
    person_id: personId
    };
    var companyDoc = {
    type:typeOfExperience,
    title:null,
    startedAt:null,
    endedAt:null,
    confirmed:false,
    company_id: Session.get('currentCompanyId')
    };
    Meteor.call('pushExperience', personId, Session.get('currentCompanyId'), companyDoc, personDoc);
    tmpl.find('#User').value = "";
    tmpl.find('#User').blur();
    document.getElementById('UserOptions').style.display='none';
    }
    else
    {
    alert ("Selecciona un tipo de experiencia");
    }
    },
})

Template.addMember.helpers({
    userOptions : function()
    {
      Meteor.subscribe('people');
    return People.find({});
    }
})
Template.member.helpers({
  user: function(userId)
  {
  Meteor.subscribe("userProfile", userId);
  return Meteor.users.find({_id: userId});
  },

  person: function(personId)
  {
  Meteor.subscribe("person", personId);
  return People.find({_id: personId});
  }
})


    Template.editCompany.helpers ({
        cityOptions : function()
        {
          return Tags.find({type:'City'});
        },

        company: function()
        {
          return Companies.find({url:Session.get('url')});
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