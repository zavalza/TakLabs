Meteor.startup(function () {
//Redirect www to ROOT URL in meteor
if(window.location.hostname.search('www') != -1)
  window.location.assign("http://tak.mx");
Session.set('currentProjectId',"");
Session.set('userToShow',"");
Session.set('typeToShow',"");
Session.set('claimProfile', false);
Session.set('hasIdea', false);
Session.set('working', false);
Session.set('waiting', false);
Session.set('personTags', []);
Session.set('screenshots', []);
Session.set('filters',[]);
Session.set('selectedTags',[]);
Session.set("desireImg", 1);
Session.set('keyControl',-1);
Session.set('screenshotToShow',"");
Session.set('message', "Convertimos ideas en startups");
Session.set('callToAction', "Inspírate");
Session.set('action', "hasIdea");
Meteor.subscribe("allProjects");
Meteor.subscribe("allImpulses");
Meteor.subscribe("allTags");
Meteor.subscribe("allImages");
Meteor.subscribe("userData");
});

Deps.autorun(function () {
  Meteor.subscribe("peopleToShow", Session.get('filters'));
});


Meteor.setInterval( function(){
    //alert('clock is working');
    var messages=["Convertimos ideas en startups", "Trabaja en un problema que te apasione", "Colabora con otros innovadores hacia la mejor solución"];
    var callsToAction=["Inspírate", "Descubre tu causa", "Comienza ahora"];
    var actions=["findChallenges", "findChallenges", "help"]; //el inspirate debe mandar a la seccion de resultados de los retos
    var currentImage=Session.get("desireImg");
    currentImage+=1;
    if(currentImage==4)
      currentImage =1;
    Session.set("desireImg", currentImage);
    Session.set("message", messages[currentImage-1]);
    Session.set('action', actions[currentImage-1]);
    Session.set("callToAction", callsToAction[currentImage-1]);
    //alert(addthis_config.pubid)
 }, 8000 );

Template.profile.helpers({
	user: function()
       {
       		Meteor.subscribe('personUrl', Session.get('url'));
             return People.find({url:Session.get('url')});
        },
    project: function()
       {
       	     Meteor.call('getProjectId',Session.get('url'), function(error, result){
       	     	if(!error)
       	     		Session.set('currentProjectId', result)
       	     } );
             return Projects.find({url:Session.get('url')});
     	}
})
 