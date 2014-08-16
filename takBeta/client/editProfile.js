Template.editProfile.rendered=function() {
    $('.input-group.date').datepicker({
      format: "M-yyyy",
      minViewMode: 1, 
      language: "es",
      autoclose: true
      });
  };

Template.editProfile.events({
    'change #name' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert (Session.get('userToShow'));
      var newValue = tmpl.find('#'+targetId).value.trim();
      Meteor.call('updateTextField', Session.get('userToShow'), targetId, newValue);
    },

    'change #url': function(evt, tmpl){
      var newUrl = tmpl.find('#url').value.trim();
      Meteor.call('validatePersonUrl', Session.get('userToShow'), newUrl, 
        function(error, result)
        {
          if(error)
          {
             alert('La url ya está siendo usada');
          }
        });
    },

    'click .pullTag' : function(evt, tmpl){
      var targetName = evt.target.name;
      //alert (targetName)
      if(Meteor.userId())
      {
        var sucess = Meteor.call('pullTag', Session.get('userToShow'), this._id);
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
        var tagId = Meteor.call('saveTag', Session.get('userToShow'), doc);
        tmpl.find('#'+targetName).value = "";
        tmpl.find('#'+targetName).blur();
        document.getElementById(targetName+'options').style.display='none';
      }
      else
      {
        alert("Error al guardar etiqueta");
      }
    },

    'click .deleteLink' : function (evt, tmpl){
      //alert(this.toString());
      Meteor.call('deleteLink', Session.get('userToShow'), this.toString());
      return true;
    },

    'click .deleteExperience': function(evt, tmpl){
       //alert(this.company_id);
       Meteor.call('deleteExperience', Session.get('userToShow'), this.company_id)
    },

    'change #title,#startedAt,#endedAt': function(evt, tmpl){
      //alert(this.company_id);
      var field = evt.target.id;
      //alert(field);
      var value = evt.target.value.trim();
      //alert(value);
      Meteor.call('updateExperience', Session.get('userToShow'),this.company_id, field, value);
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
      Meteor.call('pushTag', Session.get('userToShow'), this._id);
      tmpl.find('#'+targetClass).value = "";
      tmpl.find('#'+targetClass).blur();
      document.getElementById(targetClass+'Options').style.display='none';
      return true;
    }
  });

Template.editProfile.helpers({
  person: function(personId){
          Session.set('userToShow', personId);
          Meteor.subscribe('person', personId);
    return People.find({_id:personId});
  },

  city: function(tagId)
  {
    return Tags.find({_id:tagId, type:'City'});
  },

  role: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Role'});
  },

  skill: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Skill'});
  },

  company: function(companyId)
  {
    return Companies.find({_id:companyId});
  },

 college: function(tagId)
  {
    return Tags.find({_id:tagId, type:'College'});
  }
})