   Accounts.onCreateUser(function(options, user){
    var firstName, lastName, fbLink, email;
    if(user.services.facebook)
    {
      console.log(user.services.facebook);
      firstName = user.services.facebook.first_name;
      lastName = user.services.facebook.last_name;
      email = user.services.facebook.email;
      fbLink = user.services.facebook.link;
      fbPicture = "http://graph.facebook.com/v2.0/" + user.services.facebook.id + "/picture/?width=100&height=100";
      //graph request for picture
    }
    /*if(user.services.twitter)
    {
      console.log(user.services.twitter);
    }*/
    else{
      console.log("Error");
    }
    var name = firstName+" "+lastName;
    var profile ={
                      url:null,
                      name:name,
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
                    }
    user.profile = profile;
    return user;
  });