   Accounts.onCreateUser(function(options, user){
    var firstName, lastName, fbLink, email;
    if(user.services.facebook)
    {
      console.log(user.services.facebook);
      firstName = user.services.facebook.first_name;
      lastName = user.services.facebook.last_name;
      email = user.services.facebook.email;
      fbLink = user.services.facebook.link;
      fbPicture = "http://graph.facebook.com/v2.0/" + user.services.facebook.id + "/picture/?type=large";
      //graph request for picture
    }
    else{
      console.log("Error");
    }
    var profile ={
                      firstName:firstName,
                      lastName:lastName,
                      email:email,
                      picture:fbPicture, //url of picture
                      facebook_url:fbLink,
                      tag_ids:[],
                      portafolio_urls:[],
                      experience:[], //current and past jobs with title, started, ended and id of the company
                      //github_url:
                      //twitter_url:
                      //linkedin_url:
                      //behance_url
                      followers:{count:0, user_ids:[]},
                      following:{count: 0, user_ids:[], company_ids:[]}
                    }
    //console.log(location);
    user.profile = profile;
    return user;
  });