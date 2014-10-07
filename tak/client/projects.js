
 Template.projectThumbnail.rendered = function()
 {

  var maxHeight = 0;
  $('.thumbText').each(function(){
        var h = $(this).height();
        if(h > maxHeight)
        {
          //alert(h);
          maxHeight = h;
        }
    });
  $('.thumbText').each(function(){
        $(this).css('height',maxHeight+2);
    });
}

Template.projectThumbnail.helpers({
  typeOfProject: function(tagsArray)
      {
        return Tags.find({_id:{$in:tagsArray}, type:'TypeOfProject'});
      },
    person:function(personId)
    {
      return People.find({_id:personId});
    },
     roleTag: function(personTags)
      {
        return Tags.find({_id:{$in:personTags}, type:'Role'});
      },

      skillTag: function(personTags)
      {
        return Tags.find({_id:{$in:personTags}, type:'Skill'});
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
    areas: function(tagsArray)
    {
         return Tags.find({_id:{$in:tagsArray}, type:'Area'});
    },

  cities: function(tagsArray)
    {
         return Tags.find({_id:{$in:tagsArray}, type:'City'});
    },
  markets: function(tagsArray)
    {
         return Tags.find({_id:{$in:tagsArray}, type:'Market'});
    },

})
Template.projectThumbnail.screenshotToShow = function() {
      return this.screenshots[0]
  };
 Template.projects.events({
    'change .area': function(evt, tmpl){
    //alert(evt.target.value);
    var filtersArray = Session.get("filters");
    if (evt.target.checked)
    {
    filtersArray.push(evt.target.value);
    }
    else
    {
      var pos= filtersArray.indexOf(evt.target.value);
      filtersArray.splice(pos, 1);
    }
    Session.set('filters', filtersArray);
  },
  'keyup #City,#Market' : function(evt, tmpl){
      //busca todo el string y no palabra por palabra
      //alert(evt.keyCode);

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

    'blur #City,#Market' : function(evt, tmpl){
      var targetId = evt.target.id;
      //alert(evt.currentTarget.id);
      Session.set('keyControl', -1);
      tmpl.find('#'+targetId).value = "";
      document.getElementById(targetId+'Options').style.display='none';
      
    },

    'mousedown .City,.Market' : function (evt, tmpl){
      //alert(this._id);
      var targetClass = evt.target.getAttribute('class');
      var filtersArray = Session.get("filters");
      filtersArray.push(evt.target.id);
      Session.set('filters', filtersArray);
      //blur event is called after mousedown
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

 Template.projects.helpers({
  project: function()
  {
        if (Session.get('filters').length == 0)
            return Projects.find();
           else
            return Projects.find({tag_ids:{$all:Session.get('filters')}});
  },

  city: function(tagId)
  {
    return Tags.find({_id:tagId, type:'City'});
  },

  area: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Area'});
  },

  market: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Market'});
  },

  areaOption: function()
    {
        return Tags.find({"type": "Area","counter.projects":{$gt:0}});
    },


    cityOption: function()
        {
            return Tags.find({"type": "City","counter.projects":{$gt:0}});
        },

    marketOption: function()
        {
            return Tags.find({"type": "Market","counter.projects":{$gt:0}});
        },

 })

Template.projects.filters = function(){
  return Session.get('filters');
};
 