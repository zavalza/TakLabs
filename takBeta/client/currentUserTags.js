    Template.currentUserCities.helpers({
      city: function(tagId)
        {
          return Tags.find({_id:tagId, type:'City'});
        }
    })