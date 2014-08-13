 Meteor.publish('allCompanies', function(){
 	return Companies.find({});
 })

 Meteor.publish('allTags', function(){
 	return Tags.find({});
 })

 Meteor.publish('allImages', function(){
 	return Images.find({});
 })

  Meteor.publish("userProfile", function (userId) {
  console.log("publishing user with id: " +userId);
    return Meteor.users.find({_id: userId});
    //limitar campos a los que sean públicos para seguridad
  });

  Meteor.publish('manyUserProfiles', function(idsToFind){
 	return Meteor.users.find({_id:{$in:idsToFind}});
 })

 Meteor.publish('allUserProfiles', function(){
 	return Meteor.users.find({});
 })