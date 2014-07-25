if (Meteor.isClient) {
  
Meteor.startup(function () {
    Session.set("desireImg", 1);
  });

 Meteor.setInterval( function(){
    var currentImage=Session.get("desireImg");
    currentImage+=1;
    if(currentImage==9)
      currentImage =1;
    Session.set("desireImg", currentImage);
 }, 8000 );

  Template.slider.desireImg = function() {
    return Session.get("desireImg");
  };
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}