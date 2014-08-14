 Meteor.methods({

      generateUrl: function(name){
        //console.log('creating a url');
        var cNum = Companies.find({'name': name}).count();
        var uNum =  Meteor.users.find({'lastName': name}).count();
        var url = name;
        if(uNum != 0 || cNum !=0)
        {
          url = name + uNum.toString() + cNum.toString();
        }

        return url;
      },

      validateUserUrl: function(userId, url){
        var urls = Companies.find({'url': url}).count() 
        + Meteor.users.find({'profile.url':url}).count();
        console.log(urls);
        if(urls==0)
        {
          Meteor.call('updateTextField', userId , 'url', url);
        } 
        else
          throw "Used";
      },

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
            case('url'):
            Meteor.users.update({_id: userId},
            {$set: {'profile.url':value}});
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

      addScreenshot: function(companyId, imageId)
      {
        console.log('Adding image '+ imageId + ' to '+companyId);
        Companies.update({_id: companyId},
          {$push:{'screenshots':imageId}});
      },

      deleteScreenshot: function(companyId, imageId)
      {
        console.log('Deleting image '+ imageId + ' from '+companyId);
        Companies.update({_id: companyId},
          {$pull:{'screenshots':imageId}});
        Images.remove({_id: imageId});
      },

      updateCompanyLogo: function(companyId, imageId)
      {
        //Borrar el anterior?
        console.log('New logo'+ imageId + ' in '+companyId);
        Companies.update({_id: companyId},
          {$set:{'logo':imageId}});
      },

       deleteCompanyLogo: function(companyId, imageId)
      {
        console.log('Deleting logo '+ imageId + ' from '+companyId);
        Companies.update({_id: companyId},
          {$set:{'logo':null}});
        Images.remove({_id: imageId});
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

      pushCompanyType: function(companyId, type){
          console.log('Pushing type '+ type +' to company ' + companyId);
          Companies.update({_id: companyId},
            {$push: {'types': type}});
          return true
      },

      pullCompanyType: function(companyId, type){
          console.log('Pulling type '+ type +' to company ' + companyId);
          Companies.update({_id: companyId},
            {$pull: {'types': type}});
          return true
      },

      updateCompanyLink: function(companyId, field, link){
        console.log('Updating field '+ field +' of company '+companyId);
          switch(field){
            case ('company_url'):
            Companies.update({_id: companyId},
            {$set: {'company_url': link}});
            break;
            case ('fb_url'):
            Companies.update({_id: companyId},
            {$set: {'fb_url': link}});
            break;
            case ('twitter_url'):
             Companies.update({_id: companyId},
            {$set: {'twitter_url': link}});
            break;
            case ('video_url'):
             Companies.update({_id: companyId},
            {$set: {'video_url': link}});
            break;
            default:
            break;
          }
      },

      updateCompanyText: function(companyId, field, value){
        console.log('Updating field '+ field +' of company '+companyId);
          switch(field){
            case ('name'):
            Companies.update({_id: companyId},
            {$set: {'name': value}});
            break;
            case ('city'):
            Companies.update({_id: companyId},
            {$set: {'city': value}});
            break;
            case ('highConcept'):
             Companies.update({_id: companyId},
            {$set: {'highConcept': value}});
            break;
            case ('description'):
             Companies.update({_id: companyId},
            {$set: {'description': value}});
            break;
            default:
            break;
          }
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