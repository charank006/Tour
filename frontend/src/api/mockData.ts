// Mock Data for PlanYours Travel App
// This simulates API responses with realistic Indian travel data

export interface Destination {
  id: string;
  name: string;
  state: string;
  image: string;
  weather: string;
  temperature: string;
  budgetEstimate: string;
  budgetRange: { min: number; max: number };
  description: string;
  bestTime: string;
  highlights: string[];
}

export interface Activity {
  time: 'morning' | 'afternoon' | 'evening';
  title: string;
  description: string;
  cost: number;
  duration: string;
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
  dailySpend: number;
}

export interface TravelOption {
  type: 'flight' | 'train' | 'bus';
  duration: string;
  cost: number;
  departure: string;
  arrival: string;
  operator: string;
}

export interface StayOption {
  type: 'budget' | 'comfort' | 'luxury';
  name: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  image: string;
}

export interface TripPlan {
  destination: Destination;
  startLocation: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalDays: number;
  dayPlans: DayPlan[];
  travelOptions: TravelOption[];
  stayOptions: StayOption[];
  budgetBreakdown: {
    travel: number;
    stay: number;
    food: number;
    activities: number;
    misc: number;
    total: number;
  };
}

const destinations: Destination[] = [
  {
    id: 'goa',
    name: 'Goa',
    state: 'Goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    weather: 'Sunny',
    temperature: '28°C',
    budgetEstimate: '₹15,000 - ₹25,000',
    budgetRange: { min: 15000, max: 25000 },
    description: 'Sun-kissed beaches, vibrant nightlife, and Portuguese heritage',
    bestTime: 'November to February',
    highlights: ['Beaches', 'Nightlife', 'Water Sports', 'Heritage Sites'],
  },
  {
    id: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    weather: 'Cool',
    temperature: '15°C',
    budgetEstimate: '₹12,000 - ₹20,000',
    budgetRange: { min: 12000, max: 20000 },
    description: 'Snow-capped mountains, adventure sports, and serene valleys',
    bestTime: 'March to June',
    highlights: ['Mountains', 'Trekking', 'Skiing', 'Temples'],
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
    weather: 'Warm',
    temperature: '32°C',
    budgetEstimate: '₹10,000 - ₹18,000',
    budgetRange: { min: 10000, max: 18000 },
    description: 'Pink City with majestic forts, palaces, and royal heritage',
    bestTime: 'October to March',
    highlights: ['Forts', 'Palaces', 'Shopping', 'Culture'],
  },
  {
    id: 'kerala',
    name: 'Kerala',
    state: 'Kerala',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
    weather: 'Pleasant',
    temperature: '26°C',
    budgetEstimate: '₹18,000 - ₹30,000',
    budgetRange: { min: 18000, max: 30000 },
    description: 'Backwaters, houseboats, Ayurveda, and lush green landscapes',
    bestTime: 'September to March',
    highlights: ['Backwaters', 'Houseboats', 'Ayurveda', 'Tea Gardens'],
  },
];

const generateDayPlans = (destination: string, days: number): DayPlan[] => {
  const activitiesByDestination: Record<string, Activity[][]> = {
    goa: [
      [
        { time: 'morning', title: 'Beach Sunrise Yoga', description: 'Start your day with yoga at Anjuna Beach', cost: 500, duration: '2 hours' },
        { time: 'afternoon', title: 'Water Sports at Baga', description: 'Jet skiing, parasailing, and banana boat rides', cost: 2500, duration: '4 hours' },
        { time: 'evening', title: 'Sunset at Chapora Fort', description: 'Watch the famous Goa sunset with panoramic views', cost: 0, duration: '2 hours' },
      ],
      [
        { time: 'morning', title: 'Old Goa Heritage Walk', description: 'Explore Se Cathedral and Basilica of Bom Jesus', cost: 200, duration: '3 hours' },
        { time: 'afternoon', title: 'Lunch at Fisherman\'s Wharf', description: 'Authentic Goan seafood experience', cost: 1500, duration: '2 hours' },
        { time: 'evening', title: 'Cruise on Mandovi River', description: 'Sunset cruise with live music and dinner', cost: 1200, duration: '2 hours' },
      ],
      [
        { time: 'morning', title: 'Spice Plantation Tour', description: 'Visit organic spice farms in Ponda', cost: 800, duration: '3 hours' },
        { time: 'afternoon', title: 'Dudhsagar Falls Trek', description: 'Adventure to India\'s 5th tallest waterfall', cost: 1500, duration: '5 hours' },
        { time: 'evening', title: 'Nightlife at Tito\'s Lane', description: 'Experience Goa\'s famous party scene', cost: 2000, duration: '4 hours' },
      ],
    ],
    manali: [
      [
        { time: 'morning', title: 'Solang Valley Adventure', description: 'Paragliding and zorbing in the valley', cost: 2000, duration: '4 hours' },
        { time: 'afternoon', title: 'Hadimba Temple Visit', description: 'Ancient wooden temple in cedar forest', cost: 0, duration: '2 hours' },
        { time: 'evening', title: 'Mall Road Shopping', description: 'Local handicrafts and Himachali shawls', cost: 1000, duration: '3 hours' },
      ],
      [
        { time: 'morning', title: 'Rohtang Pass Excursion', description: 'Snow activities and breathtaking views', cost: 2500, duration: '6 hours' },
        { time: 'afternoon', title: 'Vashisht Hot Springs', description: 'Natural hot water springs and temple', cost: 100, duration: '2 hours' },
        { time: 'evening', title: 'Riverside Café Experience', description: 'Cozy dinner by the Beas River', cost: 800, duration: '2 hours' },
      ],
      [
        { time: 'morning', title: 'Old Manali Trek', description: 'Scenic trek through apple orchards', cost: 0, duration: '3 hours' },
        { time: 'afternoon', title: 'River Rafting in Beas', description: 'White water rafting adventure', cost: 1500, duration: '3 hours' },
        { time: 'evening', title: 'Bonfire & BBQ Night', description: 'Mountain bonfire experience', cost: 1200, duration: '3 hours' },
      ],
    ],
    jaipur: [
      [
        { time: 'morning', title: 'Amber Fort Elephant Ride', description: 'Royal entry to the magnificent fort', cost: 1100, duration: '3 hours' },
        { time: 'afternoon', title: 'City Palace Museum', description: 'Explore royal artifacts and architecture', cost: 500, duration: '3 hours' },
        { time: 'evening', title: 'Nahargarh Fort Sunset', description: 'Panoramic city views at sunset', cost: 200, duration: '2 hours' },
      ],
      [
        { time: 'morning', title: 'Hawa Mahal & Johari Bazaar', description: 'Iconic Pink City landmark and jewelry shopping', cost: 300, duration: '3 hours' },
        { time: 'afternoon', title: 'Traditional Rajasthani Lunch', description: 'Authentic Dal Baati Churma experience', cost: 800, duration: '2 hours' },
        { time: 'evening', title: 'Chokhi Dhani Village', description: 'Cultural evening with folk dance and dinner', cost: 1500, duration: '4 hours' },
      ],
      [
        { time: 'morning', title: 'Jantar Mantar Observatory', description: 'UNESCO World Heritage astronomical site', cost: 200, duration: '2 hours' },
        { time: 'afternoon', title: 'Albert Hall Museum', description: 'Victorian architecture and rare artifacts', cost: 150, duration: '2 hours' },
        { time: 'evening', title: 'Hot Air Balloon Ride', description: 'Aerial view of Pink City at sunset', cost: 8000, duration: '1 hour' },
      ],
    ],
    kerala: [
      [
        { time: 'morning', title: 'Houseboat Check-in', description: 'Board your traditional Kerala houseboat', cost: 0, duration: '2 hours' },
        { time: 'afternoon', title: 'Backwater Cruise', description: 'Cruise through Alleppey backwaters', cost: 0, duration: '4 hours' },
        { time: 'evening', title: 'Sunset on the Waters', description: 'Traditional Kerala dinner on houseboat', cost: 0, duration: '3 hours' },
      ],
      [
        { time: 'morning', title: 'Munnar Tea Gardens', description: 'Tour the lush tea plantations', cost: 500, duration: '4 hours' },
        { time: 'afternoon', title: 'Tea Museum Visit', description: 'Learn about tea processing and tasting', cost: 300, duration: '2 hours' },
        { time: 'evening', title: 'Kathakali Performance', description: 'Traditional Kerala dance drama', cost: 600, duration: '2 hours' },
      ],
      [
        { time: 'morning', title: 'Ayurvedic Spa Session', description: 'Traditional Kerala massage and treatments', cost: 3000, duration: '3 hours' },
        { time: 'afternoon', title: 'Periyar Wildlife Safari', description: 'Boat safari in tiger reserve', cost: 1500, duration: '4 hours' },
        { time: 'evening', title: 'Kerala Sadhya Feast', description: 'Traditional banana leaf meal experience', cost: 800, duration: '2 hours' },
      ],
    ],
  };

  const activities = activitiesByDestination[destination] || activitiesByDestination['goa'];
  const dayPlans: DayPlan[] = [];

  for (let i = 0; i < days; i++) {
    const dayActivities = activities[i % activities.length];
    const dailySpend = dayActivities.reduce((sum, act) => sum + act.cost, 0);
    
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    dayPlans.push({
      day: i + 1,
      date: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      activities: dayActivities,
      dailySpend,
    });
  }

  return dayPlans;
};

const travelOptions: Record<string, TravelOption[]> = {
  goa: [
    { type: 'flight', duration: '1h 30m', cost: 4500, departure: '06:00 AM', arrival: '07:30 AM', operator: 'IndiGo' },
    { type: 'train', duration: '12h', cost: 1200, departure: '10:00 PM', arrival: '10:00 AM', operator: 'Konkan Railway' },
    { type: 'bus', duration: '14h', cost: 800, departure: '06:00 PM', arrival: '08:00 AM', operator: 'VRL Travels' },
  ],
  manali: [
    { type: 'flight', duration: '1h 20m + 6h', cost: 5500, departure: '06:00 AM', arrival: '01:20 PM', operator: 'SpiceJet + Bus' },
    { type: 'bus', duration: '14h', cost: 1500, departure: '05:00 PM', arrival: '07:00 AM', operator: 'HRTC Volvo' },
    { type: 'train', duration: '10h + 6h', cost: 1800, departure: '09:00 PM', arrival: '01:00 PM', operator: 'Shatabdi + Bus' },
  ],
  jaipur: [
    { type: 'flight', duration: '1h', cost: 3500, departure: '07:00 AM', arrival: '08:00 AM', operator: 'Air India' },
    { type: 'train', duration: '5h', cost: 800, departure: '06:00 AM', arrival: '11:00 AM', operator: 'Ajmer Shatabdi' },
    { type: 'bus', duration: '6h', cost: 600, departure: '06:00 AM', arrival: '12:00 PM', operator: 'RSRTC' },
  ],
  kerala: [
    { type: 'flight', duration: '2h 30m', cost: 5500, departure: '06:00 AM', arrival: '08:30 AM', operator: 'Vistara' },
    { type: 'train', duration: '24h', cost: 1500, departure: '06:00 AM', arrival: '06:00 AM', operator: 'Kerala Express' },
    { type: 'bus', duration: '20h', cost: 1800, departure: '04:00 PM', arrival: '12:00 PM', operator: 'KSRTC' },
  ],
};

const stayOptions: Record<string, StayOption[]> = {
  goa: [
    { type: 'budget', name: 'Zostel Goa', pricePerNight: 800, rating: 4.2, amenities: ['WiFi', 'AC', 'Breakfast'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80' },
    { type: 'comfort', name: 'Caravela Beach Resort', pricePerNight: 5500, rating: 4.6, amenities: ['Pool', 'Spa', 'Beach Access', 'Restaurant'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80' },
  ],
  manali: [
    { type: 'budget', name: 'Backpacker Panda', pricePerNight: 700, rating: 4.3, amenities: ['WiFi', 'Heater', 'Café'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80' },
    { type: 'comfort', name: 'The Himalayan', pricePerNight: 4500, rating: 4.7, amenities: ['Mountain View', 'Spa', 'Bonfire', 'Restaurant'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80' },
  ],
  jaipur: [
    { type: 'budget', name: 'Moustache Hostel', pricePerNight: 600, rating: 4.4, amenities: ['WiFi', 'AC', 'Rooftop Café'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80' },
    { type: 'comfort', name: 'Rambagh Palace', pricePerNight: 15000, rating: 4.9, amenities: ['Heritage', 'Pool', 'Spa', 'Fine Dining'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80' },
  ],
  kerala: [
    { type: 'budget', name: 'Vedanta Wake Up!', pricePerNight: 900, rating: 4.1, amenities: ['WiFi', 'AC', 'Breakfast'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80' },
    { type: 'comfort', name: 'Kumarakom Lake Resort', pricePerNight: 12000, rating: 4.8, amenities: ['Houseboat', 'Ayurveda Spa', 'Pool', 'Backwater View'], image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80' },
  ],
};

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDestinations = async (budget?: { min: number; max: number }): Promise<Destination[]> => {
  await delay(800);
  
  if (budget) {
    return destinations.filter(
      d => d.budgetRange.min <= budget.max && d.budgetRange.max >= budget.min
    );
  }
  
  return destinations;
};

export const fetchDestinationById = async (id: string): Promise<Destination | undefined> => {
  await delay(500);
  return destinations.find(d => d.id === id);
};

export const fetchTripPlan = async (
  destinationId: string,
  startLocation: string,
  startDate: string,
  endDate: string,
  travelers: number
): Promise<TripPlan> => {
  await delay(1000);
  
  const destination = destinations.find(d => d.id === destinationId);
  if (!destination) {
    throw new Error('Destination not found');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const dayPlans = generateDayPlans(destinationId, totalDays);
  const destTravelOptions = travelOptions[destinationId] || travelOptions['goa'];
  const destStayOptions = stayOptions[destinationId] || stayOptions['goa'];

  const avgTravelCost = destTravelOptions[0].cost * 2 * travelers; // Round trip
  const avgStayCost = destStayOptions[0].pricePerNight * (totalDays - 1) * Math.ceil(travelers / 2);
  const activitiesCost = dayPlans.reduce((sum, day) => sum + day.dailySpend, 0) * travelers;
  const foodCost = 800 * totalDays * travelers;
  const miscCost = Math.round((avgTravelCost + avgStayCost + activitiesCost + foodCost) * 0.1);
  const total = avgTravelCost + avgStayCost + activitiesCost + foodCost + miscCost;

  return {
    destination,
    startLocation,
    startDate,
    endDate,
    travelers,
    totalDays,
    dayPlans,
    travelOptions: destTravelOptions,
    stayOptions: destStayOptions,
    budgetBreakdown: {
      travel: avgTravelCost,
      stay: avgStayCost,
      activities: activitiesCost,
      food: foodCost,
      misc: miscCost,
      total,
    },
  };
};

export const startLocations = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
];

export const travelTypes = [
  { value: 'solo', label: 'Solo', icon: '🧳' },
  { value: 'couple', label: 'Couple', icon: '💑' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'friends', label: 'Friends', icon: '👯' },
];

export const budgetRanges = [
  { value: 'budget', label: 'Budget', range: '₹5K - ₹15K', min: 5000, max: 15000 },
  { value: 'moderate', label: 'Moderate', range: '₹15K - ₹30K', min: 15000, max: 30000 },
  { value: 'comfort', label: 'Comfort', range: '₹30K - ₹50K', min: 30000, max: 50000 },
  { value: 'luxury', label: 'Luxury', range: '₹50K+', min: 50000, max: 200000 },
];
