const app = require('./src/lib/express');

const PORT = 3001 || 5000;

app.get('/', (req, res) => res.send("API Running"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));