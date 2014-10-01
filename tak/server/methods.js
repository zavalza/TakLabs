 Meteor.methods({

          userToPerson: function(userId){
          var userDoc = Meteor.users.findOne({_id:userId}, {'profile':1,'_id':0});
          if(userDoc.person_id)
          {
            return userDoc.person_id;
          }
          else
          {
          //console.log(userDoc);
          var emptyProfile={followers:{count:0, user_ids:[]},
                            following:{count: 0, user_ids:[], project_ids:[]}
                            };
          personId = People.insert(userDoc.profile);
          var url = Meteor.call('generateUrl', userDoc.profile.name);
          if(userDoc.services.linkedin)
          {
            var Future = Npm.require('fibers/future');

            for (var i=0; i < userDoc.services.linkedin.skills._total; i++)
            {
              var enString =userDoc.services.linkedin.skills.values[i].skill.name;
               var future = new Future();
                HTTP.get("http://api.mymemory.translated.net/get?q="+enString+"&langpair=en|es&de=paulz_91@hotmail.com",function( error, result ){
                    if(result)
                    {
                      //console.log(result);
                      future.return(result.data.responseData.translatedText);
                    }             
                });
               //formato y verificar que no sea null
               if(future.wait() != null)
              {
                var skillTag = {
                      type: "Skill",
                      name:future.wait()[0].toUpperCase()+future.wait().slice(1),
                      counter:{
                        people: 0,
                        projects: 0,
                      },
                      timestamp: new Date(),
                    }
               

                Meteor.call('saveTag', personId, skillTag);
              }
              
            }
          } 
          People.update({_id:personId}, 
            {$set:{'user_id':Meteor.userId(), 'url':url}});
          Meteor.users.update({_id:Meteor.userId()},
            {$set:{'person_id':personId,'profile':emptyProfile}});
          return personId;
          }
        },

        claimPerson: function(userId, personUrl){
          Meteor.call('userToPerson', userId); //Not so efficient way

          var userDoc = Meteor.users.findOne({_id:userId}, {'profile':1,'_id':0});
          //Do we need an empty profile?
          /*var emptyProfile={followers:{count:0, user_ids:[]},
                            following:{count: 0, user_ids:[], project_ids:[]}
          
                            };*/
          var claimedDoc = People.findOne({url:personUrl});
          var personId = claimedDoc._id; //claimed personId will be updated
         
            //get current object
          var currentDoc = People.findOne({_id: userDoc.person_id});
          
          //what happen to the names?, how do we use this or the email for verification

          console.log('Joint of user '+ userId + " with person "+personId);
          People.update({_id:personId}, 
            {$set:{'user_id':userId, 
                  'picture': currentDoc.picture, 
                  'facebook_url': currentDoc.facebook_url,
                  'linkedin_url': currentDoc.linkedin_url,
                  'email':currentDoc.email}});
          People.update({_id:personId}, 
            {$addToSet:{'tag_ids':{$each:currentDoc.tag_ids}}});
          //Experience is not mixed, just take the claimed one

           People.remove({_id:userDoc.person_id}); //Remove old person doc
          //Asign new person Id
          Meteor.users.update({_id:userId},
            {$set:{'person_id':personId}});
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
             var existing = Projects.find({'url': url}).count()+ People.find({'url': url}).count();
            if(existing !=0)
            {
              url = url + existing.toString();
            }
            return url;
            },

      validatePersonUrl: function(personId, url){

        var newUrl = Meteor.call('generateUrl', url);
        Meteor.call('updateTextField', personId , 'url', newUrl);
      },
      addMember: function(projectUrl, typeOfExperience, name){
      console.log('requesting new url');
      var url = Meteor.call('generateUrl', name);
      var projectDoc = Projects.findOne({url:projectUrl});
      console.log("Creating a new person")
      var person={
                url: url,
                name: name,
                email: null,
                picture:"defaultPic.png", //url of picture
                facebook_url: null,
                tag_ids:[],
                portafolio_urls:[],
                experience:[{
                type:typeOfExperience,
                title:null,
                startedAt:null,
                endedAt:null,
                confirmed:false,
                project_id: projectDoc._id,
                }], 
                followers:{count:0, user_ids:[]},
                following:{count: 0, user_ids:[], project_ids:[]}
                }
      //Validar nombre no repetido?
      var personId= People.insert(person);
      console.log('Adding experience to '+ projectUrl);
      var experience = {
      type:typeOfExperience,
      title:null,
      startedAt:null,
      endedAt:null,
      confirmed:false,
      user_id: null,
      person_id: personId
      }
      Projects.update({url: projectUrl},
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
            case('facebook_url'):
            People.update({_id: personId},
            {$set: {'facebook_url':value}});
            break;
            case('twitter_url'):
            People.update({_id: personId},
            {$set: {'twitter_url':value}});
            break;
             case('linkedin_url'):
            People.update({_id: personId},
            {$set: {'linkedin_url':value}});
            break;
            case('github_url'):
            People.update({_id: personId},
            {$set: {'github_url':value}});
            break;
            case('behance_url'):
            People.update({_id: personId},
            {$set: {'behance_url':value}});
            break;
            case('personal_url'):
            People.update({_id: personId},
            {$set: {'personal_url':value}});
            break;
            case('url'):
            People.update({_id: personId},
            {$set: {'url':value}});
            break;
            default: break;
          }
          
      },

      updateExperience: function(personId, projectId, field, value){
          console.log('Updating field '+ field +' of person '+personId + ' and project '+ projectId);
          switch(field){
            case ('title'):
            People.update({_id: personId,'experience':{$elemMatch:{'project_id': projectId}}},
             {$set: {'experience.$.title':value}});
            Projects.update({_id: projectId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.title':value}});
            break;
            case ('startedAt'):
            People.update({_id: personId,'experience':{$elemMatch:{'project_id': projectId}}},
             {$set: {'experience.$.startedAt':value}});
            Projects.update({_id: projectId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.startedAt':value}});
            break;
            case('endedAt'):
            People.update({_id: personId,'experience':{$elemMatch:{'project_id': projectId}}},
             {$set: {'experience.$.endedAt':value}});
            Projects.update({_id: projectId,'team':{$elemMatch:{'person_id': personId}}},
             {$set: {'team.$.endedAt':value}});
            break;
            default: break;
          }
          
      },

      pushExperience: function(personId, projectId, projectDoc, personDoc){
          console.log('Pushing experience to both '+personId+' and '+projectId);
          People.update({_id: personId},
          {$push:{'experience': projectDoc}});

          Projects.update({_id: projectId},
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

      addArticle: function(projectId, link){
          console.log('Adding an article to project'+ projectId);
          Projects.update({_id: projectId},
          {$push:{'article_urls': link}});
      },

      deleteArticle: function(projectId, link){
          console.log('Deleting the article '+link +' of profile '+ projectId);
          Projects.update({_id: projectId},
          {$pull:{'article_urls': link}});
      },

      addScreenshot: function(projectUrl, imageId)
      {
        console.log('Adding image '+ imageId + ' to '+projectUrl);
        Projects.update({url: projectUrl},
          {$push:{'screenshots':imageId}});
      },

      deleteScreenshot: function(projectUrl, imageId)
      {
        console.log('Deleting image '+ imageId + ' from '+projectUrl);
        Projects.update({url: projectUrl},
          {$pull:{'screenshots':imageId}});
        Images.remove({_id: imageId});
      },

      updateProjectLogo: function(projectUrl, imageId)
      {
        //Borrar el anterior?
        console.log('New logo'+ imageId + ' in '+projectUrl);
        Projects.update({url: projectUrl},
          {$set:{'logo':imageId}});
      },

       deleteProjectLogo: function(projectUrl, imageId)
      {
        console.log('Deleting logo '+ imageId + ' from '+projectUrl);
        Projects.update({url: projectUrl},
          {$set:{'logo':null}});
        Images.remove({_id: imageId});
      },

      addExperience: function(personId, typeOfExperience, projectDoc){
        console.log("Creating a new project")
        //Validar nombre no repetido?
        var projectId = Projects.insert(projectDoc);
        var url = Meteor.call('generateUrl', projectDoc.name);
        Projects.update({_id: projectId},{$set:{'url': url}});
        console.log('Adding experience to '+ personId);
        var experience = {
                    type:typeOfExperience,
                    title:null,
                    startedAt:null,
                    endedAt:null,
                    confirmed:false,
                    project_id: projectId
                  }
        People.update({_id: personId},
          {$push:{'experience': experience}});

      },

      deleteExperience: function(personId, projectId){
         People.update({_id: personId},
             {$pull: {'experience':{'project_id':projectId}}});
         Projects.update({_id: projectId},
             {$pull: {'team':{'person_id':personId}}});
      },

      getProjectId: function(projectUrl){
          var projectDoc = Projects.findOne({url: projectUrl});
          if(projectDoc)
            return projectDoc._id;
          else
            return null;
      },

      pushProjectType: function(projectUrl, type){
          console.log('Pushing type '+ type +' to project ' + projectUrl);
          Projects.update({url: projectUrl},
            {$push: {'types': type}});
          var tag=Tags.findOne({name:type, type:"TypeOfProject"});
          Meteor.call('pushProjectTag', projectUrl, tag._id);
          return true
      },

      pullProjectType: function(projectUrl, type){
          console.log('Pulling type '+ type +' from project ' + projectUrl);
          Projects.update({url: projectUrl},
            {$pull: {'types': type}});
          var tag=Tags.findOne({name:type, type:"TypeOfProject"});
          Meteor.call('pullProjectTag', projectUrl, tag._id);
          return true
      },

      updateProjectLink: function(projectUrl, field, link){
        console.log('Updating field '+ field +' of project '+projectUrl);
          switch(field){
            case ('project_url'):
            Projects.update({url: projectUrl},
            {$set: {'project_url': link}});
            break;
            case ('fb_url'):
            Projects.update({url: projectUrl},
            {$set: {'fb_url': link}});
            break;
            case ('twitter_url'):
             Projects.update({url: projectUrl},
            {$set: {'twitter_url': link}});
            break;
            case ('video_url'):
             Projects.update({url: projectUrl},
            {$set: {'video_url': link}});
            break;
            default:
            break;
          }
      },

      updateProjectText: function(projectUrl, field, value){
        console.log('Updating field '+ field +' of project '+projectUrl);
          switch(field){
            case ('name'):
            Projects.update({url: projectUrl},
            {$set: {'name': value}});
            break;
            case ('city'):
            Projects.update({url: projectUrl},
            {$set: {'city': value}});
            break;
            case ('highConcept'):
             Projects.update({url: projectUrl},
            {$set: {'highConcept': value}});
            break;
            case ('description'):
             Projects.update({url: projectUrl},
            {$set: {'description': value}});
            break;
            default:
            break;
          }
      },

      pushTag: function(personId, tagId){
          console.log('Pushing tag with id '+ tagId +' to person ' + personId);
          var updatedDoc = People.update({_id: personId},
            {$addToSet: {'tag_ids': tagId}});
          
          Tags.update({_id: tagId}, {$inc:{'counter.people':updatedDoc}});
          return true
      },

      pushProjectTag: function(projectUrl, tagId){
          console.log('Pushing tag with id '+ tagId +' to project ' + projectUrl);
          var updatedDoc = Projects.update({url: projectUrl},
            {$addToSet: {'tag_ids': tagId}});
          Tags.update({_id: tagId}, {$inc:{'counter.projects':updatedDoc}});
          return true
      },
    
      pullTag: function (personId, tagId){
          console.log('Unlink tag with id '+ tagId +' from person '+ personId);
          People.update({_id: personId},
            {$pull: {'tag_ids': tagId}});
          Tags.update({_id: tagId}, {$inc:{'counter.people':-1}});
          return true
      },

      pullProjectTag: function (projectUrl, tagId){
          console.log('Unlink tag with id '+ tagId +' from project '+ projectUrl);
          Projects.update({url: projectUrl},
            {$pull: {'tag_ids': tagId}});
          Tags.update({_id: tagId}, {$inc:{'counter.projects':-1}});
          return true
      },

    
      saveTag: function(personId, doc){
        console.log('addingTag');
        //protection method against duplication
        var tagDoc= Tags.findOne({name: doc.name, type: doc.type});
        if(tagDoc != null)
        {
          tagId = tagDoc._id;
          console.log('tag already exist in '+tagId);
        }
        else
        {
          tagId = Tags.insert(doc);
          console.log('new tag has id ' +tagId);
        }
        Meteor.call('pushTag', personId, tagId);
        return tagId;
      },

      saveProjectTag: function(projectUrl, doc){
        console.log('addingTag');
        //protection method against duplication
        var tagDoc= Tags.findOne({name: doc.name, type: doc.type});
        if(tagDoc != null)
        {
          tagId = tagDoc._id;
          console.log('tag already exist in '+tagId);
        }
        else
        {
          tagId = Tags.insert(doc);
          console.log('new tag has id ' +tagId);
        }
        Meteor.call('pushProjectTag', projectUrl, tagId);
        return tagId;
      },

      insertProject: function (personId, projectDoc)
      {
        console.log('creating new Project by '+personId);
        personDoc = People.findOne({_id: personId});
        projectDoc.author_id = personDoc._id;
        //console.log(projectDoc);
        projectId = Projects.insert(projectDoc);
      
        People.update({_id:personId},{$addToSet:{'supporting':projectId}});
            
      },

      giveInterest: function(impulseId, userId)
      {
        console.log('interest from '+userId+' to '+impulseId)
        Impulses.update({_id: impulseId},{$addToSet:{'people':userId}});
      },

      saveImpulse: function (impulseDoc)
      {
       
        
        //console.log(impulseDoc);
         Impulses.update({_id:impulseDoc._id}, impulseDoc);
        for( var i = 0; i < impulseDoc.tag_ids.length; i++)
        {
          /*Falta cambiar los tags que se quitaron al editar*/
          //Meteor.call('pushProjectTag', projectUrl, impulseDoc.tag_ids[i]);
        }
            
      },

      deleteImpulse: function(projectUrl, impulseId)
      {
        console.log('delete Impulse '+impulseId+ ' from '+projectUrl);
        Projects.update({url:projectUrl},{$pull:{impulse_ids:impulseId}});
        Impulses.remove({_id: impulseId});
      },

      getImpulseDoc: function(impulseId)
      {
        impulseDoc = Impulses.findOne({_id:impulseId});
        //console.log(impulseDoc.person_tags);
        return impulseDoc;
      }
      
    });