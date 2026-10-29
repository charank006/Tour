const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Trip = require('../models/Trip');
const Review = require('../models/Review');
const fileStore = require('../utils/store');

const sampleTrips = [
  {
    destination: 'Jaipur',
    startLocation: 'New Delhi',
    startDate: '2026-11-10',
    endDate: '2026-11-13',
    durationDays: 4,
    travelers: 2,
    mood: 'Heritage',
    pace: 'Medium',
    budget: 32000,
    plan: {
      planSummary: 'A 4-day royal heritage expedition through Jaipur',
      whyThisDestination: 'Cool autumn breezes and illuminated palace courtyards.',
      estimatedCost: { total: 24500, transport: 4200, stay: 10500, food: 6000, activities: 2800, misc: 1000 },
      stay: { type: 'Comfort', area: 'Civil Lines Heritage Quarter', estimatedCostPerNight: 3500, nights: 3 },
      places: [
        { name: 'Amber Palace', category: 'Historic Citadel', cost: 500 },
        { name: 'Hawa Mahal', category: 'Royal Architecture', cost: 200 },
        { name: 'City Palace', category: 'State Museum', cost: 700 }
      ],
      dayPlans: [
        { day: 1, theme: 'Royal Arrival & Bazaars', activities: [{ time: 'Morning', title: 'Hawa Mahal & Morning Chai', duration: '2h' }] },
        { day: 2, theme: 'Fortress Horizons', activities: [{ time: 'Morning', title: 'Amber Palace Elephant Path', duration: '3h' }] }
      ]
    }
  },
  {
    destination: 'Manali',
    startLocation: 'Chandigarh',
    startDate: '2026-12-01',
    endDate: '2026-12-05',
    durationDays: 5,
    travelers: 2,
    mood: 'Mountains',
    pace: 'Relaxed',
    budget: 40000,
    plan: {
      planSummary: 'A 5-day snowline retreat in the Pir Panjal mountains',
      whyThisDestination: 'Crisp alpine air, pine-scented log cabins, and snow trails.',
      estimatedCost: { total: 31000, transport: 5500, stay: 14000, food: 7500, activities: 3000, misc: 1000 },
      stay: { type: 'Comfort', area: 'Old Manali Apple Orchards', estimatedCostPerNight: 3500, nights: 4 },
      places: [
        { name: 'Solang Valley', category: 'Valley & Snow', cost: 500 },
        { name: 'Hadimba Temple', category: 'Cedar Sanctuary', cost: 50 }
      ],
      dayPlans: [
        { day: 1, theme: 'Mountain Acclimatization', activities: [{ time: 'Morning', title: 'Old Manali Cafe Trail', duration: '2h' }] }
      ]
    }
  }
];

const sampleReviews = [
  {
    placeId: 'amber-fort',
    destination: 'Jaipur',
    author: 'Aarav Mehta',
    rating: 5,
    worthIt: true,
    actualCost: 500,
    timeSpent: '3.5 hours',
    crowdLevel: 'Moderate',
    comment: 'Arrive right at 8:00 AM before the tour buses pull in. The sun hitting the Sheesh Mahal mirror work is mesmerizing.'
  },
  {
    placeId: 'fontainhas',
    destination: 'Goa',
    author: 'Elena Rostova',
    rating: 5,
    worthIt: true,
    actualCost: 0,
    timeSpent: '2 hours',
    crowdLevel: 'Quiet',
    comment: 'Peaceful morning walk through the Portuguese quarter. Pick up fresh warm poee bread from the local bakeries.'
  },
  {
    placeId: 'alleppey-houseboat',
    destination: 'Kerala',
    author: 'Rohan & Priya',
    rating: 5,
    worthIt: true,
    actualCost: 4500,
    timeSpent: 'Overnight',
    crowdLevel: 'Quiet',
    comment: 'Unbelievably calm. The freshly cooked Karimeen fish curry while gliding through quiet palm canals was unforgettable.'
  }
];

async function seed() {
  console.log('🌱 Starting PlanYours Database Seed...');

  let mongoConnected = false;
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
      mongoConnected = true;
      console.log('✅ Connected to MongoDB.');
    } catch (err) {
      console.warn('⚠️  Could not connect to MongoDB:', err.message);
      console.log('📁 Seeding local JSON store (data/store.json)...');
    }
  } else {
    console.log('ℹ️  No MONGO_URI provided. Seeding local JSON store (data/store.json)...');
  }

  if (mongoConnected) {
    try {
      await Trip.deleteMany({});
      await Review.deleteMany({});
      await Trip.insertMany(sampleTrips);
      await Review.insertMany(sampleReviews);
      console.log(`✅ Seeded ${sampleTrips.length} trips and ${sampleReviews.length} reviews to MongoDB.`);
      await mongoose.disconnect();
    } catch (err) {
      console.error('Mongo seed error:', err.message);
    }
  }

  // Always seed JSON store as fallback
  sampleTrips.forEach(t => fileStore.saveTrip(t));
  sampleReviews.forEach(r => fileStore.saveReview(r));
  console.log(`✅ Seeded ${sampleTrips.length} trips and ${sampleReviews.length} reviews to data/store.json.`);

  console.log('🎉 Seed complete! Everything is ready.');
}

seed();
