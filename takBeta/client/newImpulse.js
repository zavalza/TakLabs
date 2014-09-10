Template.newImpulse.events({
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
          var filtersArray = Session.get("filters");
          filtersArray.push(matches[selection].id);
          Session.set('filters', filtersArray);
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
      var filtersArray = Session.get("filters");
      filtersArray.push(evt.target.id);
      Session.set('filters', filtersArray);
      //blur event is called after mousedown
    },

    'click .tryFacebookLogin': function(evt, tmpl){
        if(Accounts.loginServicesConfigured()){
        Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'user_friends', 'email']
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            Meteor.call('userToPerson', Meteor.userId(), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Router.go('firstLogin');
                }
              });
            
          }
        }); 
        }
        else{
          alert("Error en inicio de sesión");
      }
      
    },
    'click .tryLinkedinLogin': function(evt, tmpl){
      if(Accounts.loginServicesConfigured()){
        Meteor.loginWithLinkedin({
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
          else
          {
            //Success
            
           Meteor.call('userToPerson', Meteor.userId(), function(error, result)
              {
                if(!error){
                  Session.set('userToShow', result);
                  //alert(result);
                  Router.go('firstLogin');
                }
              });
          }
      }); 
      }
      else{
        alert("Error en inicio de sesión");
      }
    }
  });

Template.newImpulse.helpers({
  tagOptions : function()
    {
    return Tags.find({'counter.people':{$gt:0}});
    },
  impulseTypeOptions: function()
  {
    return Tags.find({'type': 'ImpulseType'});
  },

  rewardTypeOptions: function()
  {
    return Tags.find({'type': 'RewardType'});
  }
})