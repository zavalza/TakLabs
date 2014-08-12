 Template.companies.helpers({
 	company: function()
 	{
 		return Companies.find({});
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
          
        }

 })

 