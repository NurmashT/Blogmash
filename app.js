import dotenv from "dotenv";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import mainRoutes from "./server/routes/main.js";
import connectDB from "./server/config/db.js";
import Admin from "./server/routes/admin.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import methodOverride from "method-override";
import isActiveRoute from "./server/helpers/activeRoute.js"

const app = express();
dotenv.config();
const PORT = 3000 || process.env.PORT;

// Connect to DB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: process.env.SESSION_ID,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(express.static('public'));


// Templating Engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.use('/', mainRoutes);
app.use('/', Admin);

app.locals.isActiveRoute = isActiveRoute;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});