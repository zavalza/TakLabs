Template.people.helpers({
	person: function()
        {
            return Meteor.users.find({});
        },
    company: function(companyId)
        {
          if(companyId)
            return Companies.find({_id:companyId});
          else
            return Companies.find({_id:Session.get('currentCompanyId')});
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