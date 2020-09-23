const {
    app
} = require('./src/lib/express');
const connectDB = require('./config/db');
const PORT = require('./src/constants/port-express');

// Connect Database 
connectDB();

app.get('/', (req, res) => res.send("API Running"));

// Define Routes

app.use('/api/users', require('./routes/api/users'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));