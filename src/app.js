const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const logger = require('passport');
const morgan = require('morgan');
const pics = require('multer');

// lets go
const app = express();
require('./database');

// SETTINGS
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
const storage = pics.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(pics({storage}).single('image'));

// Global variables

// Routes
var mainRoutes = require('./routes/index');
var usersRoutes = require('./routes/users');
var filesRoutes = require('./routes/files');
app.use('/', mainRoutes);
app.use(usersRoutes);
app.use(filesRoutes);


// static files
app.use(express.static(path.join(__dirname, 'public')));

// listen
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});
