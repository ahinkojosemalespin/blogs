// BLOGS AND TAGS
/**
 * Module dependencies.
 */
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals')
var pg = require('pg');
var conString = "postgres://postgres:root@192.168.2.150:5432/Blogs";
var app = express();

//All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', engine);
app.set('view engine', 'ejs');


//Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/blogs', routes.blogs);
app.get('/tags', routes.tags);
app.get('/authors', routes.authors);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/***********************************************************/
//Functions to bring the data from the DB

//Testing function at the begining. If it shows 1, the conection was successfull
pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT $1::int AS numbor', ['1'], function(err, result) {
    done();
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].numbor);
  });
});

//BLOGS
//Function to get all the blogs
app.get('/blogs/get', function (req, res){	
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT "blogs"."idblog","blogs"."dateblog","blogs"."urlblog","blogs"."blogtitle","authors"."idauthor","authors"."firstname","authors"."lastname","authors"."email" FROM public."authors" INNER JOIN public."blogs" ON "blogs"."idauthor" =  "authors"."idauthor"', function(err, result) {
	    done();

	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.json(result);
	  });
	});
});

//Function to insert a new blog
app.post('/blogs/new', function (req, res){
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('INSERT INTO public."blogs" ("idauthor", "blogtitle", "dateblog", "urlblog") VALUES ($1,$2,$3,$4)',[req.body.idauthor,req.body.blogtitle,req.body.dateblog,req.body.urlblog], function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.json(result);
	  });
	});
});

//Function to get tags of a blog
app.get('/blogs/getTagsByBlog', function (req, res){	
	console.log(req.query);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT tagsbyblog.idtag, blogs.blogtitle, tags.idtag, tags.texttag, tags.urltag, blogs.idblog FROM public.tags, public.blogs, public.tagsbyblog WHERE tags.idtag = tagsbyblog.idtag AND blogs.idblog = tagsbyblog.idblog AND blogs.idblog = $1;',[req.query.idblog], function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.json(result);
	  });
	});
});

//Function to modify the author and the tags of a blog
app.post('/blogs/update', function (req, res){	
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	    if(err) {
	     return console.error('error fetching client from pool', err);
	    }
	    //First the author is modified
	    client.query('UPDATE "blogs" SET "idauthor" = $1 WHERE "idblog" = $2',[req.body.idauthor,req.body.idblog], function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
        console.log(result);
	    res.json(result);
	  });
	});
});

//AUTHORS
//Function to get all the authors
app.get('/authors/get', function (req, res){	
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT "authors"."idauthor","authors"."firstname", "authors"."lastname","authors".email FROM public."authors"', function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.json(result);
	  });
	});
});

//Function to insert a new author
app.post('/authors/new', function (req, res){	
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('INSERT INTO public."authors" ("firstname", "lastname", "email") VALUES ($1,$2,$3)',[req.body.firstname,req.body.lastname,req.body.email], function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.json(result);
	  });
	});
});

//TAGS
//Function to get all the tags
app.get('/tags/get', function (req, res){	
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT "tags"."idtag","tags"."texttag","tags"."urltag" FROM public."tags"', function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.json(result);
	  });
	});
});

//Function to insert a new tag
app.post('/tags/new', function (req, res){	
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('INSERT INTO public."tags" ("texttag", "urltag") VALUES ($1,$2)',[req.body.texttag,req.body.urltag], function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.json(result);
	  });
	});
});

//Function to delete all the relationship of the blog and tags
app.post('/tags/detelerel', function (req, res){	
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  	client.query('DELETE from "tagsbyblog" WHERE "idblog" = $1',[req.body.idblog], function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	    console.log(result);
	    res.json(result);
	  });
	});
});

//Function to assing tags to blogs
app.post('/tags/assing', function (req, res){	
	console.log(req.body);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('INSERT INTO "tagsbyblog" ("idtag","idblog") VALUES ($1,$2)',[req.body.idtag,req.body.idblog], function(err, result) {
	    done();
	    if(err) {
	      return console.error('error running query', err);
	    }
	    res.json(result);
	  });
	});
});