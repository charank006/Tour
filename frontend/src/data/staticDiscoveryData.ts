export interface PlaceItem {
    id: string;
    name: string;
    type: 'Nature' | 'Heritage' | 'Adventure' | 'Spiritual' | 'Urban' | 'Relaxation';
    popularityScore: number; // 0 to 10
    crowdLevel: 'Low' | 'Medium' | 'High';
    bestSeason: string;
    duration: string; // e.g. "2h", " Half Day"
    cost: number; // per person entry/activity cost
    openingTime?: string;
    closingTime?: string;
}

export interface DestinationItem {
    id: string;
    name: string;
    state: string;
    category: 'Mountains' | 'Beaches' | 'Nature' | 'Heritage' | 'Urban' | 'Spiritual';
    famousFor: string;
    tags: string[];
    image: string;
    averageDailyCost: number; // per person (mid-range)
    places: PlaceItem[];
}

export interface ActivityItem {
    id: string;
    name: string;
    category: 'Adventure' | 'Nature' | 'Spiritual' | 'Culture' | 'Food';
    bestPlaces: string[];
    bestSeason: string;
    difficulty?: 'Easy' | 'Moderate' | 'Hard';
    description: string;
    image: string;
}

export const destinationsData: DestinationItem[] = [
    {
        id: 'd1',
        name: 'Manali',
        state: 'Himachal Pradesh',
        category: 'Mountains',
        famousFor: 'Snow-capped peaks and adventure sports',
        tags: ['Snow', 'Trekking', 'Honeymoon'],
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 3500,
        places: [
            { id: 'p1_1', name: 'Solang Valley', type: 'Adventure', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Winter', duration: '4h', cost: 1000 },
            { id: 'p1_2', name: 'Hidimba Temple', type: 'Heritage', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 0 },
            { id: 'p1_3', name: 'Rohtang Pass', type: 'Nature', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Summer', duration: '6h', cost: 2500 },
            { id: 'p1_4', name: 'Old Manali', type: 'Urban', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '3h', cost: 500 },
            { id: 'p1_5', name: 'Jogini Waterfalls', type: 'Nature', popularityScore: 7.5, crowdLevel: 'Low', bestSeason: 'Mar-Nov', duration: '3h', cost: 0 },
        ]
    },
    {
        id: 'd2',
        name: 'Goa',
        state: 'Goa',
        category: 'Beaches',
        famousFor: 'Sun, sand, and vibrant nightlife',
        tags: ['Beach', 'Party', 'Relaxation'],
        image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 4500,
        places: [
            { id: 'p2_1', name: 'Baga Beach', type: 'Nature', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Nov-Feb', duration: '4h', cost: 500 },
            { id: 'p2_2', name: 'Fort Aguada', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 300 },
            { id: 'p2_3', name: 'Dudhsagar Falls', type: 'Nature', popularityScore: 9.0, crowdLevel: 'Medium', bestSeason: 'Monsoon', duration: '6h', cost: 1500 },
            { id: 'p2_4', name: 'Palolem Beach', type: 'Relaxation', popularityScore: 8.0, crowdLevel: 'Low', bestSeason: 'Nov-Mar', duration: '4h', cost: 200 },
            { id: 'p2_5', name: 'Basilica of Bom Jesus', type: 'Heritage', popularityScore: 8.8, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 0 },
        ]
    },
    {
        id: 'd3',
        name: 'Jaipur',
        state: 'Rajasthan',
        category: 'Heritage',
        famousFor: 'Royal palaces and historic forts',
        tags: ['Forts', 'History', 'Shopping'],
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 4000,
        places: [
            { id: 'p3_1', name: 'Amber Fort', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Oct-Mar', duration: '3h', cost: 500 },
            { id: 'p3_2', name: 'Hawa Mahal', type: 'Heritage', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 200 },
            { id: 'p3_3', name: 'City Palace', type: 'Heritage', popularityScore: 9.0, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 700 },
            { id: 'p3_4', name: 'Jantar Mantar', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1.5h', cost: 200 },
            { id: 'p3_5', name: 'Nahargarh Fort', type: 'Nature', popularityScore: 8.8, crowdLevel: 'Medium', bestSeason: 'Sunset', duration: '3h', cost: 200 },
        ]
    },
    {
        id: 'd4',
        name: 'Varanasi',
        state: 'Uttar Pradesh',
        category: 'Spiritual',
        famousFor: 'Ancient ghats and spiritual ceremonies',
        tags: ['Ganga', 'Temples', 'Culture'],
        image: 'https://images.unsplash.com/photo-1561361513-35e6ba0d7943?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 2500,
        places: [
            { id: 'p4_1', name: 'Dashashwamedh Ghat', type: 'Spiritual', popularityScore: 10, crowdLevel: 'High', bestSeason: 'Year-round', duration: '3h', cost: 0 },
            { id: 'p4_2', name: 'Kashi Vishwanath Temple', type: 'Spiritual', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Year-round', duration: '2h', cost: 0 },
            { id: 'p4_3', name: 'Sarnath', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Oct-Mar', duration: '3h', cost: 200 },
            { id: 'p4_4', name: 'Assi Ghat', type: 'Spiritual', popularityScore: 8.0, crowdLevel: 'Medium', bestSeason: 'Morning', duration: '2h', cost: 0 },
        ]
    },
    {
        id: 'd5',
        name: 'Munnar',
        state: 'Kerala',
        category: 'Nature',
        famousFor: 'Tea gardens and misty hills',
        tags: ['Tea', 'Hills', 'Monsoon'],
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 3800,
        places: [
            { id: 'p5_1', name: 'Tea Museum', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 200 },
            { id: 'p5_2', name: 'Eravikulam National Park', type: 'Nature', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Sep-Mar', duration: '4h', cost: 500 },
            { id: 'p5_3', name: 'Mattupetty Dam', type: 'Nature', popularityScore: 8.8, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1h', cost: 50 },
            { id: 'p5_4', name: 'Top Station', type: 'Nature', popularityScore: 8.0, crowdLevel: 'Low', bestSeason: 'Morning', duration: '3h', cost: 0 },
        ]
    },
    {
        id: 'd6',
        name: 'Rishikesh',
        state: 'Uttarakhand',
        category: 'Spiritual',
        famousFor: 'Yoga capital and white water rafting',
        tags: ['Yoga', 'Rafting', 'Ganga'],
        image: 'https://images.unsplash.com/photo-1588416936097-4183d2af387b?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 3000,
        places: [
            { id: 'p6_1', name: 'Laxman Jhula', type: 'Heritage', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 0 },
            { id: 'p6_2', name: 'Triveni Ghat', type: 'Spiritual', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Evening', duration: '2h', cost: 0 },
            { id: 'p6_3', name: 'River Rafting Point', type: 'Adventure', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Sep-Jun', duration: '4h', cost: 1500 },
            { id: 'p6_4', name: 'Beatles Ashram', type: 'Heritage', popularityScore: 7.5, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '2h', cost: 600 },
        ]
    },
    {
        id: 'd7',
        name: 'Udaipur',
        state: 'Rajasthan',
        category: 'Heritage',
        famousFor: 'Lakes and romantic palaces',
        tags: ['Lakes', 'Romantic', 'Palaces'],
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 4500,
        places: [
            { id: 'p7_1', name: 'City Palace', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Year-round', duration: '3h', cost: 400 },
            { id: 'p7_2', name: 'Lake Pichola', type: 'Nature', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Sunset', duration: '2h', cost: 500 },
            { id: 'p7_3', name: 'Jag Mandir', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1h', cost: 300 },
            { id: 'p7_4', name: 'Sajjangarh Monsoon Palace', type: 'Nature', popularityScore: 9.0, crowdLevel: 'Medium', bestSeason: 'Monsoon', duration: '2h', cost: 150 },
        ]
    },
    {
        id: 'd8',
        name: 'Ladakh',
        state: 'Ladakh',
        category: 'Mountains',
        famousFor: 'High altitude adventurous landscapes',
        tags: ['Biking', 'Adventure', 'Snow'],
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 5000,
        places: [
            { id: 'p8_1', name: 'Pangong Lake', type: 'Nature', popularityScore: 10, crowdLevel: 'High', bestSeason: 'Jun-Sep', duration: '4h', cost: 0 },
            { id: 'p8_2', name: 'Nubra Valley', type: 'Nature', popularityScore: 9.5, crowdLevel: 'Medium', bestSeason: 'Jun-Sep', duration: '5h', cost: 500 },
            { id: 'p8_3', name: 'Thiksey Monastery', type: 'Spiritual', popularityScore: 8.5, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '1.5h', cost: 100 },
            { id: 'p8_4', name: 'Khardung La Pass', type: 'Adventure', popularityScore: 9.2, crowdLevel: 'Medium', bestSeason: 'Jun-Sep', duration: '1h', cost: 0 },
        ]
    },
    {
        id: 'd9',
        name: 'Mumbai',
        state: 'Maharashtra',
        category: 'Urban',
        famousFor: 'Bollywood, colonial architecture, and sea face',
        tags: ['City', 'Food', 'Culture'],
        image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 4000,
        places: [
            { id: 'p9_1', name: 'Gateway of India', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 0 },
            { id: 'p9_2', name: 'Marine Drive', type: 'Urban', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Evening', duration: '2h', cost: 0 },
            { id: 'p9_3', name: 'Elephanta Caves', type: 'Heritage', popularityScore: 8.8, crowdLevel: 'Medium', bestSeason: 'Nov-Mar', duration: '4h', cost: 250 },
            { id: 'p9_4', name: 'Colaba Causeway', type: 'Urban', popularityScore: 8.5, crowdLevel: 'High', bestSeason: 'Year-round', duration: '2h', cost: 0 },
        ]
    },
    {
        id: 'd10',
        name: 'Andaman Islands',
        state: 'Andaman & Nicobar',
        category: 'Beaches',
        famousFor: 'Pristine beaches and coral reefs',
        tags: ['Diving', 'Beach', 'Nature'],
        image: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 6000,
        places: [
            { id: 'p10_1', name: 'Radhanagar Beach', type: 'Nature', popularityScore: 10, crowdLevel: 'High', bestSeason: 'Oct-May', duration: '3h', cost: 0 },
            { id: 'p10_2', name: 'Cellular Jail', type: 'Heritage', popularityScore: 9.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 100 },
            { id: 'p10_3', name: 'Elephant Beach', type: 'Adventure', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Oct-May', duration: '4h', cost: 1200 },
            { id: 'p10_4', name: 'Ross Island', type: 'Heritage', popularityScore: 8.0, crowdLevel: 'Low', bestSeason: 'Oct-May', duration: '2h', cost: 200 },
        ]
    },
    {
        id: 'd11',
        name: 'Hampi',
        state: 'Karnataka',
        category: 'Heritage',
        famousFor: 'Ancient ruins and boulder landscapes',
        tags: ['History', 'Ruins', 'Architecture'],
        image: 'https://images.unsplash.com/photo-1623143584856-bf5db5a16c7f?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 2500,
        places: [
            { id: 'p11_1', name: 'Virupaksha Temple', type: 'Spiritual', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Oct-Feb', duration: '1h', cost: 0 },
            { id: 'p11_2', name: 'Vijaya Vittala Temple', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Oct-Feb', duration: '2h', cost: 500 },
            { id: 'p11_3', name: 'Matanga Hill', type: 'Nature', popularityScore: 9.0, crowdLevel: 'Medium', bestSeason: 'Sunrise', duration: '2h', cost: 0 },
            { id: 'p11_4', name: 'Coracle Ride', type: 'Adventure', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Oct-Feb', duration: '1h', cost: 400 },
        ]
    },
    {
        id: 'd12',
        name: 'Coorg',
        state: 'Karnataka',
        category: 'Nature',
        famousFor: 'Coffee plantations and waterfalls',
        tags: ['Coffee', 'Hills', 'Nature'],
        image: 'https://images.unsplash.com/photo-1589136777351-94328811440a?w=500&auto=format&fit=crop&q=60',
        averageDailyCost: 4000,
        places: [
            { id: 'p12_1', name: 'Abbey Falls', type: 'Nature', popularityScore: 9.2, crowdLevel: 'High', bestSeason: 'Monsoon', duration: '2h', cost: 50 },
            { id: 'p12_2', name: 'Dubare Elephant Camp', type: 'Nature', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Year-round', duration: '3h', cost: 300 },
            { id: 'p12_3', name: 'Raja\'s Seat', type: 'Relaxation', popularityScore: 8.5, crowdLevel: 'High', bestSeason: 'Sunset', duration: '1h', cost: 20 },
            { id: 'p12_4', name: 'Coffee Plantation Tour', type: 'Nature', popularityScore: 8.8, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '2h', cost: 500 },
        ]
    }
];

export const activitiesData: ActivityItem[] = [
    {
        id: 'a1',
        name: 'River Rafting',
        category: 'Adventure',
        bestPlaces: ['Rishikesh', 'Manali', 'Coorg'],
        bestSeason: 'Sep - Jun',
        difficulty: 'Moderate',
        description: 'Navigate through thrilling rapids in the holy Ganga or Beas rivers.',
        image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'a2',
        name: 'Scuba Diving',
        category: 'Adventure',
        bestPlaces: ['Andaman', 'Goa', 'Lakshadweep'],
        bestSeason: 'Oct - May',
        difficulty: 'Moderate',
        description: 'Explore vibrant coral reefs and marine life deep underwater.',
        image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'a3',
        name: 'Yoga Retreat',
        category: 'Spiritual',
        bestPlaces: ['Rishikesh', 'Kerala', 'Goa'],
        bestSeason: 'Year-round',
        difficulty: 'Easy',
        description: 'Rejuvenate your mind and body in the birthplace of Yoga.',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'a4',
        name: 'Camel Safari',
        category: 'Adventure',
        bestPlaces: ['Jaisalmer', 'Pushkar', 'Bikaner'],
        bestSeason: 'Oct - Mar',
        difficulty: 'Easy',
        description: 'Ride through the golden dunes of the Thar desert at sunset.',
        image: 'https://images.unsplash.com/photo-1589815033735-a764d9ac72b3?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'a5',
        name: 'Houseboat Stay',
        category: 'Nature',
        bestPlaces: ['Alleppey', 'Kumarakom', 'Srinagar'],
        bestSeason: 'Aug - Mar',
        difficulty: 'Easy',
        description: 'Drift along serene backwaters in a traditional houseboat.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'a6',
        name: 'Street Food Tour',
        category: 'Food',
        bestPlaces: ['Delhi', 'Mumbai', 'Lucknow'],
        bestSeason: 'Year-round',
        difficulty: 'Easy',
        description: 'Taste the authentic flavors of India, from chaat to kebabs.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'a7',
        name: 'Trekking',
        category: 'Adventure',
        bestPlaces: ['Triund', 'Valley of Flowers', 'Kheerganga'],
        bestSeason: 'May - Oct',
        difficulty: 'Hard',
        description: 'Conquer the peaks and witness breathtaking mountain vistas.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60'
    },
    {
        id: 'a8',
        name: 'Temple Tour',
        category: 'Culture',
        bestPlaces: ['Varanasi', 'Madurai', 'Hampi'],
        bestSeason: 'Year-round',
        difficulty: 'Easy',
        description: 'Marvel at ancient architecture and spiritual ceremonies.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=60'
    }
];
