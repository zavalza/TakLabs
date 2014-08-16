Template.userProfile.helpers({
      user: function(personId)
        {
            return People.find({_id:personId}); 
        },

       canEdit: function()
       {
        return Meteor.userId()== this.user_id;
       },

       image: function(ids)
        {
          if (typeof (ids) == 'object')
          {
            //alert(EJSON.stringify(ids));
            return Images.find({_id:{$in: ids}});
          }
          
          else
          {
            //alert(ids);
            //alert(typeof (ids)) string
            return Images.find({_id:ids})
          }
          
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