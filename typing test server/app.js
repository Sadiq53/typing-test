const express = require('express')
const app = express();
const cors = require('cors');
const routes = require('./config/AllRoutes')



app.use(express.json());
app.use(express.urlencoded({ extended : true }))
app.use(cors());
app.use(routes)


const PORT = process.env.PORT || 8080
app.listen(PORT, (req, res) => {
    console.log("server running with port", PORT)
});