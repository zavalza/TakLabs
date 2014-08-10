Template.userProfile.helpers({
       user: function()
       {
        return Meteor.users.find({_id: Meteor.userId()})
       },

       company: function(companyId)
       {
        return Companies.find({_id:companyId});
       },

       role: function(tagsArray)
       {
          return Tags.find({_id:{$in:tagsArray}, type: 'Role'}); 
       },

      city: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'City'});
      },

      college: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'College'});
      },

      skill: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'Skill'});
      }
    });