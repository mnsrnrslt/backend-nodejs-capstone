// Serves the production React build on port 9000 (used for the Code Engine deployment)
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 9000;
const buildDir = path.join(__dirname, 'build');

app.use(express.static(buildDir));

// SPA fallback: every unknown route returns index.html so React Router can handle it
app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(port, () => {
    console.log(`GiftLink frontend served on port ${port}`);
});
