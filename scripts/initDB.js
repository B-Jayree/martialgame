const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function initDB() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('martial-peak-game');
    
    // Create collections
    await db.createCollection('users');
    await db.createCollection('gamesaves');
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('gamesaves').createIndex({ userId: 1 }, { unique: true });
    
    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 12);
    await db.collection('users').insertOne({
      name: 'Test Cultivator',
      email: 'test@cultivation.com',
      password: hashedPassword,
      createdAt: new Date()
    });
    
    console.log('✅ Database initialized successfully!');
    console.log('👤 Test user: test@cultivation.com / password123');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await client.close();
  }
}

initDB();