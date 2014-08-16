 Meteor.methods({

          newUserToPerson: function(userId){
          var userDoc = Meteor.users.findOne({_id:userId}, {'profile':1,'_id':0});
          //console.log(userDoc);
          var emptyProfile={followers:{count:0, user_ids:[]},
                            following:{count: 0, user_ids:[], company_ids:[]}
                            };
          personId = People.insert(userDoc.profile);
          var url = Meteor.call('generateUrl', userDoc.profile.name); 
          People.update({_id:personId}, 
            {$set:{'user_id':Meteor.userId(), 'url':url}});
          Meteor.users.update({_id:Meteor.userId()},
            {$set:{'person_id':personId,'profile':emptyProfile}});
          return personId;
        },

        generateUrl: function(name){
            //console.log('creating a url');
            var url = name.toLowerCase().replace(' ', '-');
            var notValid = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç";
            var valid = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
            for (var i=0; i<notValid.length; i++) {
            url = url.replace(notValid.charAt(i), valid.charAt(i));
            }
             var existing = Companies.find({'url': url}).count()+ People.find({'url': url}).count();
            if(existing !=0)
            {
              url = url + existing.toString();
            }
            return url;
            },

      validatePersonUrl: function(personId, url){
        var urls = Companies.find({'url': url}).count() 
        + People.find({'url':url}).count();
        console.log(urls);
        if(urls==0)
        {
          Meteor.call('updateTextField', personId , 'url', url);
        } 
        else
          throw "Used";
      },
      addMember: function(companyId, typeOfExperience, userDoc){
      console.log("Creating a new person")
      //Validar nombre no repetido?
      var personId= People.insert(userDoc);
      console.log('Adding experience to '+ companyId);
      var experience = {
      type:typeOfExperience,
      title:null,
      startedAt:null,
      endedAt:null,
      confirmed:false,
      user_id: null,
      person_id: personId
      }
      Companies.update({_id: companyId},
      {$push:{'team': experience}});
      },

      updateTextField: function(personId, field, value){
          console.log('Updating field '+ field +' of person '+personId);
          switch(field){
            case ('name'):
            People.update({_id: personId},
            {$set: {'name':value}});
            break;
            case('email'):
            People.update({_id: personId},
            {$set: {'email':value}});
            break;
            case('url'):
            People.update({_id: personId},
            {$set: {'url':value}});
            break;
            default: break;
          }
          
      },

      updateExperience: function(personId, companyId, field, value){
          console.log('Updating field '+ field +' of person '+personId + ' and company '+ companyId);
          switch(field){
            case ('title'):
            People.update({_id: personId,'experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'experience.$.title':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.title':value}});
            break;
            case ('startedAt'):
            People.update({_id: personId,'experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'experience.$.startedAt':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.startedAt':value}});
            break;
            case('endedAt'):
            People.update({_id: personId,'experience':{$elemMatch:{'company_id': companyId}}},
             {$set: {'experience.$.endedAt':value}});
            Companies.update({_id: companyId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.endedAt':value}});
            break;
            default: break;
          }
          
      },

      pushExperience: function(personId, companyId, companyDoc, personDoc){
          console.log('Pushing experience to both '+personId+' and '+companyId);
          People.update({_id: personId},
          {$push:{'experience': companyDoc}});

          Companies.update({_id: companyId},
          {$push:{'team': personDoc}});
      },

      addLink: function(personId, link){
          console.log('Adding a link to profile '+ personId);
          People.update({_id: personId},
          {$push:{'portafolio_urls': link}});
      },

      deleteLink: function(personId, link){
          console.log('Deleting the link '+link +' of profile '+ personId);
          People.update({_id: personId},
          {$pull:{'portafolio_urls': link}});
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

      addExperience: function(personId, typeOfExperience, companyDoc){
        console.log("Creating a new company")
        //Validar nombre no repetido?
        var companyId = Companies.insert(companyDoc);
        var url = Meteor.call('generateUrl', companyDoc.name);
        Companies.update({_id: companyId},{$set:{'url': url}});
        console.log('Adding experience to '+ personId);
        var experience = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    company_id: companyId
                  }
        People.update({_id: personId},
          {$push:{'experience': experience}});

      },

      deleteExperience: function(personId, companyId){
         People.update({_id: personId},
             {$pull: {'experience':{'company_id':companyId}}});
         Companies.update({_id: companyId},
             {$pull: {'team':{'person_id':personId}}});
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

      pushTag: function(personId, tagId){
          console.log('Pushing tag with id '+ tagId +' to person ' + personId);
          People.update({_id: personId},
            {$push: {'tag_ids': tagId}});
          return true
      },

    
      pullTag: function (personId, tagId){
          console.log('Unlink tag with id '+ tagId +' from person '+ personId);
          People.update({_id: personId},
            {$pull: {'tag_ids': tagId}});
          return true
      },

    
      saveTag: function(personId, doc){
        //some protection method against duplication
        console.log('addingTag');
        tagId = Tags.insert(doc);
        console.log('new tag has id '+ tagId);
        Meteor.call('pushTag', personId, tagId);
        return tagId;
      },
      
    });