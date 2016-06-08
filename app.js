var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var Product = require('./models/product');
var mongoose   = require('mongoose');
var router = express.Router();
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
//var config = require('./config'); // get our config file
//var path = require('path');
var User   = require('./models/user');
var Message  = require('./models/message'); // get our mongoose model
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use("", express.static(path.join(__dirname, '')));

mongoose.connect('mongodb://localhost/tataMsg');
//app.set('superSecret', config.secret);
//app.use(morgan('dev'));

app.get('/setup', function(req, res) {

  // create a sample user
  var rajat = new User({
    name: 'Rajat',
    password: 'pass'
  });
  var ujjawal = new User({
    name: 'Ujjawal',
    password: 'pass2'
  });

  // save the sample user
  rajat.save(function(err) {
    if (err) throw err;

    console.log('User1 saved successfully');
    res.json({ success: true });
  });
  ujjawal.save(function(err) {
    if (err) throw err;

    console.log('User2 saved successfully');
    res.json({ success: true });
  });
});
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/users')
.get( function(req, res) {
  User.find({}, function(err, users) {
    res.json({Users : users});
  });

})
.post( function(req, res) {
    User.findOne({name:req.body.user_name}, function(err, userN) {
        if (err)
        {
            res.send(err)
        }
    if (userN==null){
        var user = new User();
              user.name = req.body.user_name || 'default',
              user.password = req.body.password || 'default',
        user.save(function(err) {
            if (err){
                res.send(err);
            }

            res.json({ message: 'user created!', user: user});
        });
    }else{
        res.json({message:'user Already exist',user: user});
    }
      //res.json(user);
    });

});

router.route('/find_user')
.post( function(req, res) {

  User.findOne({name:req.body.user_name}, function(err, user) {
      if (err)
      {
          res.send(err)
      }
if(user!=null){
      res.json({user:user});
  }else{
      res.json({message:'user not exist'});
  }
  });
});
router.route('/find_msgs')
.post(function(req, res)
{
    Message.find({ to_name: req.body.user_name },function(err, messages)
    {
        if (err)
        {
            res.send(err)
        }


        res.json({msg: messages});
    });
});
router.route('/mutual_msgs')
.post(function(req, res)
{
    var searchQuery = {
  'to_name': req.body.msg_from ,
  'user_name': req.body.msg_to
};
    Message.find(searchQuery,null, {sort: 'time_readable'},function(err, messages)
    {
        if (err)
        {
            res.send(err)
        }


        res.json({message: messages});
    });
});

router.route('/delete_user')
.post(function(req, res)
{
    User.findOne({name:req.body.user_name,password:req.body.password}, function(err, user) {
        if (err)
        {
            res.send(err)
        }
        if(user!=null){
        user.remove(function(err) {
            if (err) throw err;
        res.json({message:'User successfully deleted!'});
    //console.log('User successfully deleted!');
        });
    }else{
        res.json({message:'Username or password incorrect'});
    }
      //res.json(user);
    });
});

router.route('/delete_msg')
.post(function(req, res)
{
    Message.findOne({_id:req.body._id}, function(err, msg) {
        if (err)
        {
            res.send(err)
        }
        if(msg!=null){
        msg.remove(function(err) {
            if (err) throw err;
        res.json({message:'Message successfully deleted!'});
    //console.log('User successfully deleted!');
        });
    }else{
        res.json({message:'Message id incorrect'});
    }
      //res.json(user);
    });
});
router.route('/msg')

.post( function(req, res) {
    var message = new Message();

          message.msg = req.body.msg || 'default',
          message.user_name=req.body.user_name ||'default',
          message.to_name=req.body.to_name ||'default'

    message.save(function(err) {
        if (err){
            res.send(err);
        }

        res.json({ message: 'message created!', newMsg: message});
    });
});

app.use('/api', router);
app.listen(3000);
console.log('Magic happens on port 3000');
//Rajat
//56c7fd1c5afe4948013fbbaa
//Ujjawal
//56c7fd1c5afe4948013fbbab
//RajatSurana
//56c83306d020fd0854b6313f
/*
router.route('/products')
    .get(function(req, res)
    {
        Product.find(function(err, products)
        {
            if (err)
            {
                res.send(err)
            }


            res.json(products);
        });
    })
    .post(function(req,res)
    {
        var product = new Product();

            product.price =  req.body.price || '0',
            product.quantity = req.body.quantity || '0',
            product.description = req.body.description || 'default'

        product.save(function(err) {
            if (err)
            res.send(err);

            res.json({ message: 'product created!', newProduct: product});
        });
    })
router.route('/update_price')
	.post(function(req, res) {
		Product.findOne({ _id: req.body._id }, function(err, product) {
			product.price=req.body.price || '0';
			product.save(function(err) {
				if (err)
				res.send(err);

				res.json({ message: 'Product price updated!' });
			});

		});
	});
router.route('/change_discount')
	.post(function(req, res) {
		Product.findOne({ _id: req.body._id }, function(err, product) {
			product.discount=req.body.discount || '0';
			product.save(function(err) {
				if (err)
				res.send(err);

				res.json({ message: 'Discount value changed!' });
			});

		});
	});
*/
