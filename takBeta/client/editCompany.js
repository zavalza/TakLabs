Template.editCompany.events({
'change #type' : function(evt, tmpl){
  var value = tmpl.find('#type').value;
  //alert(this._id);
  Meteor.call('pushCompanyType', this._id, value);
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
    Meteor.call('updateCompanyText', Session.get('currentCompanyId'), targetId, value);
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
  Meteor.call('updateCompanyLink', Session.get('currentCompanyId'), targetId, link);
}
},
'click .pullCompanyType': function(evt, tmpl){
  //alert(this);
  Meteor.call('pullCompanyType', Session.get('currentCompanyId'), this.toString());
},

'keyup #City' : function(evt, tmpl){
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
      Meteor.call('updateCompanyText', Session.get('currentCompanyId'), 'city', this.name);
      document.getElementById(targetClass+'Options').style.display='none';
      return true;
    }
  });

    Template.editCompany.helpers ({
        cityOptions : function()
        {
          return Tags.find({type:'City'});
        },

        company: function()
        {
          return Companies.find({_id:Session.get('currentCompanyId')});
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