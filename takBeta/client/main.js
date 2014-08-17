Meteor.startup(function () {

Session.set('currentCompanyId',"");
Session.set('userToShow',"");
Session.set('screenshotToShow',"");
Meteor.subscribe("allCompanies");
Meteor.subscribe("allTags");
Meteor.subscribe("allImages");
Meteor.subscribe("userData");
});

Template.profile.helpers({
	user: function()
       {
       		Meteor.subscribe('personUrl', Session.get('url'));
             return People.find({url:Session.get('url')});
        },
    company: function()
       {
       	     Meteor.call('getCompanyId',Session.get('url'), function(error, result){
       	     	if(!error)
       	     		Session.set('currentCompanyId', result)
       	     } );
             return Companies.find({url:Session.get('url')});
     	}
})
 