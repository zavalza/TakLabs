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
            var url = name.toLowerCase().split(' ').join('-');
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
      addMember: function(companyUrl, typeOfExperience, name){
      console.log('requesting new url');
      var url = Meteor.call('generateUrl', name);
      var companyDoc = Companies.findOne({url:companyUrl});
      console.log("Creating a new person")
      var person={
                url: url,
                name: name,
                email: null,
                picture:"http://localhost:3000/defaultPic.png", //url of picture
                facebook_url: null,
                tag_ids:[],
                portafolio_urls:[],
                experience:[{
                type:typeOfExperience,
                title:null,
                startedAt:null,
                endedAt:null,
                confirmed:false,
                company_id: companyDoc._id,
                }], 
                followers:{count:0, user_ids:[]},
                following:{count: 0, user_ids:[], company_ids:[]}
                }
      //Validar nombre no repetido?
      var personId= People.insert(person);
      console.log('Adding experience to '+ companyUrl);
      var experience = {
      type:typeOfExperience,
      title:null,
      startedAt:null,
      endedAt:null,
      confirmed:false,
      user_id: null,
      person_id: personId
      }
      Companies.update({url: companyUrl},
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

      addArticle: function(companyId, link){
          console.log('Adding an article to company'+ companyId);
          Companies.update({_id: companyId},
          {$push:{'article_urls': link}});
      },

      deleteArticle: function(companyId, link){
          console.log('Deleting the article '+link +' of profile '+ companyId);
          Companies.update({_id: companyId},
          {$pull:{'article_urls': link}});
      },

      addScreenshot: function(companyUrl, imageId)
      {
        console.log('Adding image '+ imageId + ' to '+companyUrl);
        Companies.update({url: companyUrl},
          {$push:{'screenshots':imageId}});
      },

      deleteScreenshot: function(companyUrl, imageId)
      {
        console.log('Deleting image '+ imageId + ' from '+companyUrl);
        Companies.update({url: companyUrl},
          {$pull:{'screenshots':imageId}});
        Images.remove({_id: imageId});
      },

      updateCompanyLogo: function(companyUrl, imageId)
      {
        //Borrar el anterior?
        console.log('New logo'+ imageId + ' in '+companyUrl);
        Companies.update({url: companyUrl},
          {$set:{'logo':imageId}});
      },

       deleteCompanyLogo: function(companyUrl, imageId)
      {
        console.log('Deleting logo '+ imageId + ' from '+companyUrl);
        Companies.update({url: companyUrl},
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

      getCompanyId: function(companyUrl){
          var companyDoc = Companies.findOne({url: companyUrl});
          if(companyDoc)
            return companyDoc._id;
          else
            return null;
      },

      pushCompanyType: function(companyUrl, type){
          console.log('Pushing type '+ type +' to company ' + companyUrl);
          Companies.update({url: companyUrl},
            {$push: {'types': type}});
          return true
      },

      pullCompanyType: function(companyUrl, type){
          console.log('Pulling type '+ type +' to company ' + companyUrl);
          Companies.update({url: companyUrl},
            {$pull: {'types': type}});
          return true
      },

      updateCompanyLink: function(companyUrl, field, link){
        console.log('Updating field '+ field +' of company '+companyUrl);
          switch(field){
            case ('company_url'):
            Companies.update({url: companyUrl},
            {$set: {'company_url': link}});
            break;
            case ('fb_url'):
            Companies.update({url: companyUrl},
            {$set: {'fb_url': link}});
            break;
            case ('twitter_url'):
             Companies.update({url: companyUrl},
            {$set: {'twitter_url': link}});
            break;
            case ('video_url'):
             Companies.update({url: companyUrl},
            {$set: {'video_url': link}});
            break;
            default:
            break;
          }
      },

      updateCompanyText: function(companyUrl, field, value){
        console.log('Updating field '+ field +' of company '+companyUrl);
          switch(field){
            case ('name'):
            Companies.update({url: companyUrl},
            {$set: {'name': value}});
            break;
            case ('city'):
            Companies.update({url: companyUrl},
            {$set: {'city': value}});
            break;
            case ('highConcept'):
             Companies.update({url: companyUrl},
            {$set: {'highConcept': value}});
            break;
            case ('description'):
             Companies.update({url: companyUrl},
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