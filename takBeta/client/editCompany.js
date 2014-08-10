Template.editCompany.events({

    'click .pullTag' : function(evt, tmpl){
      var targetName = evt.target.name;
      //alert (targetName)
      if(Meteor.userId())
      {
        var sucess = Meteor.call('pullTag', Meteor.userId(), this._id);
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
        var tagId = Meteor.call('saveTag', doc);
        tmpl.find('#'+targetName).value = "";
        tmpl.find('#'+targetName).blur();
        document.getElementById(targetName+'options').style.display='none';
      }
      else
      {
        alert("Error al guardar etiqueta");
      }
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
      Meteor.call('pushTag', Meteor.userId(), this._id);
      tmpl.find('#'+targetClass).value = "";
      tmpl.find('#'+targetClass).blur();
      document.getElementById(targetClass+'Options').style.display='none';
      return true;
    }
  });

    Template.editCompany.helpers ({
        company: function()
        {
          return Companies.find({_id:"ygfidGRhcEvcSNRWw"});
        }
    });