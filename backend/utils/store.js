const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const STORE_PATH = path.join(__dirname, '..', 'data', 'store.json');

function ensureStoreFile() {
  if (!fs.existsSync(STORE_PATH)) {
    const initial = { trips: [], reviews: [] };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
  }
}

function readStore() {
  try {
    ensureStoreFile();
    const raw = fs.readFileSync(STORE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read data/store.json, resetting to empty store:', err.message);
    return { trips: [], reviews: [] };
  }
}

function writeStore(data) {
  try {
    ensureStoreFile();
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to write data/store.json:', err.message);
    return false;
  }
}

const fileStore = {
  // Trips
  saveTrip: (tripData) => {
    const data = readStore();
    const id = tripData._id || tripData.id || `trip_${crypto.randomUUID()}`;
    const shareId = tripData.shareId || `share_${crypto.randomBytes(6).toString('hex')}`;
    const newTrip = {
      ...tripData,
      _id: id,
      id: id,
      shareId,
      createdAt: tripData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIdx = data.trips.findIndex(t => t._id === id || t.id === id);
    if (existingIdx >= 0) {
      data.trips[existingIdx] = { ...data.trips[existingIdx], ...newTrip };
    } else {
      data.trips.unshift(newTrip);
    }

    writeStore(data);
    return newTrip;
  },

  getTripById: (id) => {
    const data = readStore();
    return data.trips.find(t => t._id === id || t.id === id || t.shareId === id) || null;
  },

  getAllTrips: (userId = null) => {
    const data = readStore();
    if (!userId || userId === 'guest') {
      return data.trips;
    }
    return data.trips.filter(t => t.userId === userId || !t.userId);
  },

  deleteTrip: (id) => {
    const data = readStore();
    const initialLen = data.trips.length;
    data.trips = data.trips.filter(t => t._id !== id && t.id !== id && t.shareId !== id);
    if (data.trips.length !== initialLen) {
      writeStore(data);
      return true;
    }
    return false;
  },

  // Reviews
  saveReview: (reviewData) => {
    const data = readStore();
    const id = reviewData._id || reviewData.id || `rev_${crypto.randomUUID()}`;
    const newReview = {
      ...reviewData,
      _id: id,
      id: id,
      createdAt: reviewData.createdAt || new Date().toISOString()
    };
    data.reviews.unshift(newReview);
    writeStore(data);
    return newReview;
  },

  getAllReviews: (placeId = null) => {
    const data = readStore();
    if (!placeId) return data.reviews;
    return data.reviews.filter(r => r.placeId === placeId);
  }
};

module.exports = fileStore;
