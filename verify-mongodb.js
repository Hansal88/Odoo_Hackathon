const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/traveloop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('\n📦 MONGODB COLLECTIONS STATUS:\n');
    
    const schemas = {
      tripexplores: new mongoose.Schema({}, { strict: false }),
      tripbudgets: new mongoose.Schema({}, { strict: false }),
      trippackings: new mongoose.Schema({}, { strict: false }),
    };
    
    for (const [collName, schema] of Object.entries(schemas)) {
      const model = mongoose.model(collName, schema, collName);
      const count = await model.countDocuments();
      const exists = collections.find(c => c.name === collName);
      console.log(`${exists ? '✅' : '❌'} ${collName}: ${count} documents ${exists ? '(exists)' : '(missing)'}`);
      
      if (count > 0) {
        const doc = await model.findOne().lean();
        console.log(`   └─ Sample tripId: ${doc.tripId}`);
      }
    }
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Open http://localhost:5174 in your browser');
    console.log('2. Create a new trip with destination & details');
    console.log('3. Go to "Explore" tab and click "AI Explore Guide"');
    console.log('4. Wait for generation to complete');
    console.log('5. Run this script again to verify MongoDB insertion\n');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Connection failed:', err.message);
  process.exit(1);
});
