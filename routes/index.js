exports.index = function(req, res){
  res.render('blogs', { title: 'blogs' });
};
exports.blogs = function(req, res){
  res.render('blogs', { title: 'blogs' });
};
exports.authors = function(req, res){
  res.render('authors', { title: 'authors' });
};
exports.tags = function(req, res){
  res.render('tags', { title: 'tags	' });
};