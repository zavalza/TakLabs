 Template.companies.events({
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
      //not sure what is better (more secure). To obtain id using target or this._id
      //alert(evt.target.id);
      var targetClass = evt.target.getAttribute('class');
      var filtersArray = Session.get("filters");
      filtersArray.push(evt.target.id);
      Session.set('filters', filtersArray);
      tmpl.find('#'+targetClass).value = "";
      tmpl.find('#'+targetClass).blur();
      document.getElementById(targetClass+'Options').style.display='none';
      return true;
    },

    'click .tag'  : function (evt, tmpl){
      var filtersArray = Session.get("filters");
      filtersArray.push(evt.target.id);
      Session.set('filters', filtersArray);
      return true;
    },

    'click .pullFilter': function(evt, tmpl){
      var filtersArray = Session.get('filters');
      var pos= filtersArray.indexOf(evt.target.id);
      filtersArray.splice(pos, 1);
      Session.set('filters', filtersArray);
    }
 })

 Template.companies.helpers({
 	company: function()
 	{
 		    if (Session.get('filters').length == 0)
            return Companies.find ({});
           else
            return Companies.find({tag_ids:{$all:Session.get('filters')}});
 	},

 	cities: function(tagsArray)
	  {
	  		 return Tags.find({_id:{$in:tagsArray}, type:'City'});
	  },
  city: function(tagId)
  {
    return Tags.find({_id:tagId, type:'City'});
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
    cityOption: function()
        {
            return Tags.find({"type": "City","counter.companies":{$gt:0}});
        },

 })

Template.companies.filters = function(){
  return Session.get('filters');
};
 