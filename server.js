const {
    app,
    express
} = require('./src/lib/express');
const connectDB = require('./config/db');
const PORT = require('./src/constants/port-express');

// Connect Database 
connectDB();

// Init Middleware 
app.use(express.json({
    extended: false
}));

app.get('/', (req, res) => res.send("API Running"));

// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/users', require('./routes/api/users'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));