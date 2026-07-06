// this will allow us to use express in our app
const express = require ('express'); 

// this will create an instance of express
const app = express(); 

app.use(express.static('public'));

const db = require ('./db.js');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT); 
});

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}
));

app.get('/', function(req,res){
    res.sendFile(__dirname + '/add.html')
})

app.post('/adder',function(req,res){
    console.log(req.body);
    let sql = 'INSERT INTO users(first,last,email,password) VALUES (?,?,?,?)';
    db.run(sql, [req.body['first'],req.body['last'],req.body['email'],req.body['password']]
        , function(err,row){
            if(err){
                throw err;
            }
            res.json({'data':this.lastID})
        })

});
   


app.get('/users/:id', function(req,res){
    const query = "SELECT * from users where id =?";
    console.log(req.params.id);
    const params = [req.params.id];
    db.all(query,params, function(err,row){
        if(err){
        throw err;
    }
    res.json({'status' : row})
    })
})

app.get('/users', function(req,res){
    const query = "SELECT * from users";
db.all(query, function(err,rows){
    if(err){
        throw err;
    }
    res.json({'status' : rows})
    })

})


//      this will create a route for the root of our app and
//      send a response of 'ready' when that route is accessed

app.get('/', function (req,res){
    res.json( {'status' : 'ready'})
} )   



    