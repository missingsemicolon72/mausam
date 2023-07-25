const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const PORT = process.env.PORT || 8888;

const publicPath = path.join(__dirname, '../public');
const templatesPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', templatesPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('index', {
        footerYear: new Date().getFullYear()
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        footerYear: new Date().getFullYear()
    });
});

app.get('/weather', (req, res) => {
    res.render('weather', {
        footerYear: new Date().getFullYear()
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        footerYear: new Date().getFullYear()
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});