Meteor.startup(function () {

Session.set('currentCompanyId',"");
Session.set('userToShow',"");
Session.set('screenshotToShow',"");
Meteor.subscribe("allCompanies");
Meteor.subscribe("allTags");
Meteor.subscribe("allImages");
});
