const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traveloop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    // Define User schema
    const userSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', userSchema, 'users');
    
    // Find the test user
    const user = await User.findOne({ email: 'testuser@mongodb.local' }).lean();
    
    if (user) {
      console.log('\n✅ User found:', user.email);
      console.log('   Verification Code:', user.verificationCode);
      console.log('   Verified:', user.isVerified);
    } else {
      console.log('\n❌ User not found');
    }
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Connection failed:', err.message);
  process.exit(1);
});
