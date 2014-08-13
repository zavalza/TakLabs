//MongoDB
Jobs = new Meteor.Collection("jobs");
Companies = new Meteor.Collection("companies");
Tags = new Meteor.Collection("tags");

//File Storage in MongoDb using FS
var imageStore = new FS.Store.GridFS("images");
Images = new FS.Collection("images", {
  stores: [imageStore],
  filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});

//Iron Router configuration, specify which templates are loaded under which path
Router.map(function() {
  this.route('welcome', {path: '/'});
  this.route('loginForm', {path: '/entrar'});
  this.route('newUserForm', {path: '/registro'});
  this.route('news', {path: '/noticias'});
  this.route('companies', {path: '/startups'});
  this.route('people', {path: '/personas'});
  this.route('editCompany', {path: '/editarCompania'});
  this.route('editProfile', {path: '/editarPerfil'});
  this.route('userProfile', {path: '/user'});
  this.route('companyProfile', {path: '/algomas'})
});
