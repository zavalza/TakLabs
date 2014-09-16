
	Template.impulses.helpers({
		impulse:function()
		{
			return Impulses.find({});
		},

		project:function(projectId)
		{
			return Projects.find({_id:projectId});
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
          

		tag: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}});
      },

      type: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}, type:"ImpulseType"});
      },

      reward: function (tagIds)
      {
        return Tags.find({_id:{$in:tagIds}, type:"RewardType"});
      },
	})
	