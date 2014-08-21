Template.firstLogin.rendered=function() {
    $('.input-group.date').datepicker({
      format: "M-yyyy",
      minViewMode: 1, 
      language: "es",
      autoclose: true
      });
  };

Template.firstLogin.events({
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
      value = value[0].toUpperCase() + value.slice(1);
       var re = /([a-zA-Z]+)/g;
      if(Meteor.userId() && value.match(re))
      {
        var doc={
                  type: targetName,
                  name:value,
                  counter:{
                    people: 0,
                    companies: 0,
                  },
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

  'keyup #Skill,#Role,#Company' : function(evt, tmpl){
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

    'click .Skill,.Role' : function (evt, tmpl){
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

Template.firstLogin.helpers({
  person: function(personId){
          Session.set('userToShow', personId);
          Meteor.subscribe('person', personId);
    return People.find({_id:personId});
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
  }
})