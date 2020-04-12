#!/usr/bin/env node

let express = require('express');
let app = express();
let port = 5000;

app.use(express.static(__dirname));
app.listen(port);
console.log(`Svelte radio interface on port ${port}`);