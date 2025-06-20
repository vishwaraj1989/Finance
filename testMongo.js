const mongoose = require('mongoose');

const uri = 'mongodb+srv://vishwaraj:dudaji_dadaji@cluster0.n1kb3la.mongodb.net/native?retryWrites=true&w=majority';

mongoose.connect(uri)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));
