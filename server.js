const express = require('express');
const path = require('path');

const port = process.env.PORT || 5001;

const app = express();
app.use(express.static('public'));

app.enable('trust proxy')
app.use((req, res, next) => {
    req.secure ? next() : res.redirect('https://' + req.headers.host + req.url);
    console.log("SECURE", req.secure);
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`Server is running on: http://localhost:${port}`));