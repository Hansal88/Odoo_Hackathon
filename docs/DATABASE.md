# 💾 Database Schema & MongoDB Design

Complete MongoDB schema design for Traveloop with best practices.

---

## Database Structure

### User Model
```javascript
{
  _id: ObjectId,
  
  // Basic Info
  name: String (required, indexed),
  email: String (required, unique, indexed),
  phone: String,
  
  // Authentication
  password: String (hashed, bcrypt),
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Profile
  avatar: String (Cloudinary URL),
  bio: String (max 500),
  dateOfBirth: Date,
  nationality: String,
  
  // Preferences
  preferences: {
    travelStyle: String (enum: ['adventure', 'luxury', 'cultural', 'beach', 'backpacking']),
    budget: String (enum: ['budget', 'mid-range', 'luxury']),
    interests: [String] (hiking, food, culture, beach, etc.),
    language: String (default: 'en')
  },
  
  // Relationships
  trips: [ObjectId] (references Trip),
  friends: [ObjectId] (references User),
  
  // Account Status
  isActive: Boolean (default: true),
  isVerified: Boolean (default: false),
  verificationToken: String,
  
  // Timestamps
  createdAt: Date (auto, indexed),
  updatedAt: Date (auto),
  
  // Indexes
  // { email: 1 } - unique index
  // { createdAt: -1 } - for sorting
  // { "preferences.interests": 1 } - for filtering
}
```

---

### Trip Model
```javascript
{
  _id: ObjectId,
  
  // Basic Info
  title: String (required, indexed),
  description: String (max 1000),
  coverImage: String (Cloudinary URL),
  
  // Owner & Permissions
  owner: ObjectId (references User, required, indexed),
  collaborators: [
    {
      user: ObjectId (references User),
      role: String (enum: ['viewer', 'editor', 'owner']),
      joinedAt: Date
    }
  ],
  
  // Trip Details
  destination: {
    country: String (required),
    city: String,
    region: String,
    latitude: Number,
    longitude: Number,
    timeZone: String
  },
  
  // Dates
  startDate: Date (required, indexed),
  endDate: Date (required),
  duration: Number (calculated, in days),
  
  // Budget
  budget: {
    total: Number,
    currency: String (default: 'USD'),
    spent: Number (default: 0),
    remaining: Number (calculated)
  },
  
  // Content
  itineraries: [ObjectId] (references Itinerary),
  documents: [ObjectId] (references Document),
  notes: String,
  
  // Trip Status
  status: String (enum: ['planning', 'ongoing', 'completed'], indexed),
  isPublic: Boolean (default: false),
  
  // Ratings & Reviews
  rating: Number (1-5),
  reviews: [
    {
      reviewer: ObjectId (references User),
      comment: String,
      rating: Number,
      createdAt: Date
    }
  ],
  
  // Odoo Integration
  odooBookingId: String,
  odooBookingStatus: String,
  
  // Timestamps
  createdAt: Date (auto, indexed),
  updatedAt: Date (auto),
  
  // Indexes
  // { owner: 1, createdAt: -1 }
  // { status: 1, startDate: 1 }
  // { destination.country: 1 }
}
```

---

### Itinerary Model
```javascript
{
  _id: ObjectId,
  
  // Relationship
  trip: ObjectId (references Trip, required, indexed),
  
  // Day Info
  day: Number (1-100, required),
  date: Date (calculated from trip start date),
  title: String (optional, e.g., "Day 1 - Paris Exploration"),
  
  // Activities
  activities: [
    {
      _id: ObjectId,
      startTime: String (format: "HH:MM", e.g., "09:00"),
      endTime: String,
      activity: String (required),
      description: String,
      location: {
        name: String,
        address: String,
        latitude: Number,
        longitude: Number
      },
      category: String (enum: ['food', 'sightseeing', 'transport', 'accommodation', 'shopping', 'entertainment']),
      cost: Number,
      currency: String,
      bookingUrl: String,
      bookingConfirmation: String,
      attachments: [String] (Cloudinary URLs),
      notes: String,
      status: String (enum: ['planned', 'completed', 'cancelled']),
      createdAt: Date,
      updatedAt: Date
    }
  ],
  
  // Daily Info
  dailyBudget: Number,
  weather: {
    condition: String,
    temperature: Number,
    humidity: Number,
    forecast: String
  },
  
  // Notes
  notes: String,
  tags: [String],
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto),
  
  // Indexes
  // { trip: 1, day: 1 } - unique compound index
  // { "activities.category": 1 }
}
```

---

### Document Model
```javascript
{
  _id: ObjectId,
  
  // Ownership
  trip: ObjectId (references Trip, required, indexed),
  uploadedBy: ObjectId (references User, required),
  
  // Document Info
  filename: String (required),
  originalName: String,
  documentType: String (enum: ['passport', 'visa', 'insurance', 'booking', 'ticket', 'photo', 'other']),
  fileUrl: String (Cloudinary URL, required),
  mimeType: String,
  fileSize: Number (bytes),
  
  // Metadata
  uploadDate: Date (auto),
  expiryDate: Date (optional, for visa, insurance),
  tags: [String],
  description: String,
  
  // Sharing
  isPublic: Boolean (default: false),
  sharedWith: [ObjectId] (references User),
  
  // Timestamps
  createdAt: Date (auto, indexed),
  updatedAt: Date (auto),
  
  // Indexes
  // { trip: 1, documentType: 1 }
  // { uploadedBy: 1 }
}
```

---

## MongoDB Indexes (Performance)

### Recommended Indexes

```javascript
// User Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ "preferences.interests": 1 });

// Trip Indexes
db.trips.createIndex({ owner: 1, createdAt: -1 });
db.trips.createIndex({ status: 1, startDate: 1 });
db.trips.createIndex({ "destination.country": 1 });
db.trips.createIndex({ startDate: 1, endDate: 1 });

// Itinerary Indexes
db.itineraries.createIndex({ trip: 1, day: 1 }, { unique: true });
db.itineraries.createIndex({ trip: 1, createdAt: -1 });

// Document Indexes
db.documents.createIndex({ trip: 1, documentType: 1 });
db.documents.createIndex({ uploadedBy: 1 });
```

---

## Mongoose Schema Implementation

### User Schema (backend/src/models/User.js)

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  
  phone: {
    type: String,
    match: [/^\+?[\d\s\-()]+$/, 'Invalid phone format']
  },
  
  avatar: String,
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  
  preferences: {
    travelStyle: {
      type: String,
      enum: ['adventure', 'luxury', 'cultural', 'beach', 'backpacking'],
      default: 'cultural'
    },
    budget: {
      type: String,
      enum: ['budget', 'mid-range', 'luxury'],
      default: 'mid-range'
    },
    interests: [String],
    language: {
      type: String,
      default: 'en'
    }
  },
  
  isActive: {
    type: Boolean,
    default: true,
    select: false
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'preferences.interests': 1 });

module.exports = mongoose.model('User', userSchema);
```

---

## Data Validation Rules

### User Validation
- Name: 1-100 characters, required
- Email: Valid format, unique, required
- Password: Min 8 chars, at least 1 uppercase, 1 number, 1 special char
- Phone: Valid phone format (optional)

### Trip Validation
- Title: 1-200 characters, required
- StartDate < EndDate
- Budget: Positive number
- Destination: At least country required

### Itinerary Validation
- Day: 1-100
- Activities: At least 1 per day
- StartTime < EndTime for each activity

---

## Migration Strategy

### Adding New Fields

```javascript
// Use Mongoose hooks to handle existing documents
userSchema.pre('find', function() {
  // Set default for missing fields
  this.select('+isActive');
});
```

### Data Seeding (scripts/seed-db.js)

```javascript
const mongoose = require('mongoose');
const User = require('../backend/src/models/User');
const Trip = require('../backend/src/models/Trip');

const seedDatabase = async () => {
  const users = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Test@1234',
      preferences: {
        travelStyle: 'adventure',
        interests: ['hiking', 'culture']
      }
    }
  ];
  
  await User.insertMany(users);
  console.log('Database seeded');
};
```

---

**Last Updated:** May 2026
