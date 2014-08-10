 Meteor.methods({

      updateTextField: function(userId, field, value){
          console.log('Updating field '+ field +' of user '+userId);
          switch(field){
            case ('firstName'):
            Meteor.users.update({_id: userId},
            {$set: {'profile.firstName':value}});
            break;
            case ('lastName'):
            Meteor.users.update({_id: userId},
            {$set: {'profile.lastName':value}});
            break;
            case('email'):
            Meteor.users.update({_id: userId},
            {$set: {'profile.email':value}});
            break;
            default: break;
          }
          
      },

      updateExperience: function(userId, companyId, field, value){
          console.log('Updating field '+ field +' of user '+userId + ' and company '+ companyId);
          switch(field){
            case ('title'):
            Meteor.users.update({_id: userId,'profile.experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'profile.experience.$.title':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'user_id': userId}}},
             {$set: {'team.$.title':value}});
            break;
            case ('startedAt'):
            Meteor.users.update({_id: userId,'profile.experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'profile.experience.$.startedAt':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'user_id': userId}}},
             {$set: {'team.$.startedAt':value}});
            break;
            case('endedAt'):
            Meteor.users.update({_id: userId,'profile.experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'profile.experience.$.endedAt':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'user_id': userId}}},
             {$set: {'team.$.endedAt':value}});
            break;
            default: break;
          }
          
      },

      pushExperience: function(userId, companyId, companyDoc, personDoc){
          console.log('Pushing experience to both '+userId+' and '+companyId);
          Meteor.users.update({_id: userId},
          {$push:{'profile.experience': companyDoc}});

          Companies.update({_id: companyId},
          {$push:{'team': personDoc}});
      },

      addLink: function(userId, link){
          console.log('Adding a link to profile '+ userId);
          Meteor.users.update({_id: userId},
          {$push:{'profile.portafolio_urls': link}});
      },

      deleteLink: function(userId, link){
          console.log('Deleting the link '+link +' of profile '+ userId);
          Meteor.users.update({_id: userId},
          {$pull:{'profile.portafolio_urls': link}});
      },

      addExperience: function(userId, typeOfExperience, companyDoc){
        console.log("Creating a new company")
        //Validar nombre no repetido?
        var companyId = Companies.insert(companyDoc);
        console.log('Adding experience to '+ userId);
        var experience = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    company_id: companyId
                  }
        Meteor.users.update({_id: userId},
          {$push:{'profile.experience': experience}});

      },

      deleteExperience: function(userId, companyId){
         Meteor.users.update({_id: userId},
             {$pull: {'profile.experience':{'company_id':companyId}}});
         Companies.update({_id: companyId},
             {$pull: {'team':{'user_id':userId}}});
      },



      pushTag: function(userId, tagId){
          console.log('Pushing tag with id '+ tagId +' to user ' + userId);
          Meteor.users.update({_id: userId},
            {$push: {'profile.tag_ids': tagId}});
          return true
      },

    
      pullTag: function (userId, tagId){
          console.log('Unlink tag with id '+ tagId +' from user '+ userId);
          Meteor.users.update({_id: userId},
            {$pull: {'profile.tag_ids': tagId}});
          return true
      },

    
      saveTag: function(doc){
        //some protection method against duplication
        console.log('addingTag');
        tagId = Tags.insert(doc);
        console.log('new tag has id '+ tagId);
        Meteor.call('pushTag', Meteor.userId(), tagId);
        return tagId;
      },
      
    });