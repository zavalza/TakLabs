Template.people.events({
  'change #roles': function(evt, tmpl){
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

    'click .pullFilter': function(evt, tmpl){
      var filtersArray = Session.get('filters');
      var pos= filtersArray.indexOf(evt.target.id);
      filtersArray.splice(pos, 1);
      Session.set('filters', filtersArray);
    }
});


Template.people.helpers({
  roleOption: function()
        {
            return Tags.find({"type": "Role","counter.people":{$gt:1}});
        },

  skillOptions : function()
        {
          return Tags.find({type:'Skill', "counter.people":{$gt:0}});
        },

  skill: function(tagId)
  {
    return Tags.find({_id:tagId, type:'Skill'});
  },

	person: function()
        {
           if (Session.get('filters').length == 0)
            return People.find ({user_id:{$ne:null}});
           else
            return People.find({user_id:{$ne:null}, tag_ids:{$all:Session.get('filters')}});
        },
    company: function(companyId)
        {
          if(companyId)
            return Companies.find({_id:companyId});
          else
            return Companies.find({_id:Session.get('currentCompanyId')});
        },
    tags: function(tagIds)
        {
          return Tags.find({_id:{$in:tagIds}});
        },
        
	miniCV: function(experience)
        {
          var CV = [];
          for(var i = 0; i < experience.length; i++)
          { 
            var text;
            if(experience[i].title)
            {
              text = experience[i].title;
            }
            else
            {
              text = experience[i].type;
            }
            var doc= {string: text,
                      company_id: experience[i].company_id}
            if(experience[i].company_id == Session.get('currentCompanyId'))
            {
              CV.splice(0,0,doc);
            }
            else
            {

              CV.push(doc);
            }
              
          }
          //alert(EJSON.stringify(CV))
          return CV;
        }
})

Template.people.filters = function(){
  return Session.get('filters');
};