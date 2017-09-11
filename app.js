var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var index = require('./routes/index');
var resultReport = require('./routes/resultReport');

//===========================================================================
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//========================================================================
//ROUTES and ERROR
app.use('/resultat', index);
app.use('/resultatrapportering', resultReport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.use('/*', function(req, res, next) {
    res.render('error');
});

//==================================================================
//VARIABLES

var parties = {};
var noChange = null;
var latestVote = {};



//======================================================================
//SOCKET


//Whenever someone connects this gets executed
io.on('connection', function(socket){
    console.log('A user connected');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });

    socket.on('sendData', function (data) {
        castVote(data);
        if(noChange !== true){
            io.emit("updateValues",parties);
            console.log(parties);
        }
        noChange=null;

    });

});

//=======================================================================
//FUNCTIONS

function castVote(data){
    let found = false;
    if(parties[data.party] === null || parties[data.party] === undefined){

        parties[data.party] = {
            party:data.party,
            districts:[data.district],
            votes: data.votes,
        };
        latestVote = parties[data.party];

    }else{
        parties[data.party].districts.forEach((district)=>{
            if(district === data.district){
                found = true;
            }
        });

        if(found === true){
            console.log("district has already cast vote");
            noChange = true;
        }else{
            let votes = Number(parties[data.party].votes);
            let newVotes = Number(data.votes);
            console.log(votes);
            console.log(newVotes);

            parties[data.party].districts.push(data.district);
            parties[data.party].votes = (votes+newVotes);
            latestVote = parties[data.party];
        }
        found = false;
    }

}



//======================================================================
http.listen(3000);
module.exports = app;
