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
    // New Smart Fields
    // New Smart Fields
    bestTime: 'Sunrise' | 'Morning' | 'Afternoon' | 'Sunset' | 'Evening' | 'Night' | 'Any';
    weatherSensitivity: 'Low' | 'Medium' | 'High';
    locationType: 'Indoor' | 'Outdoor';
    image?: string;
    activityIds?: string[];
    bestWindow?: string; // e.g. "7 AM - 9 AM"
    crowdTimeline?: { time: string; level: 'Low' | 'Medium' | 'High' }[];
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
    duration?: string;
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
            {
                id: 'p1_1', name: 'Solang Valley', type: 'Adventure', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Winter', duration: '4h', cost: 1000, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&auto=format&fit=crop&q=60', activityIds: ['a1', 'a7'],
                bestWindow: '8 AM - 11 AM',
                crowdTimeline: [
                    { time: '8 AM', level: 'Low' }, { time: '10 AM', level: 'Medium' }, { time: '12 PM', level: 'High' }, { time: '2 PM', level: 'High' }, { time: '4 PM', level: 'Medium' }
                ]
            },
            {
                id: 'p1_2', name: 'Hidimba Temple', type: 'Heritage', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=500&auto=format&fit=crop&q=60',
                bestWindow: '7 AM - 9 AM',
                crowdTimeline: [
                    { time: '7 AM', level: 'Low' }, { time: '9 AM', level: 'Medium' }, { time: '11 AM', level: 'High' }, { time: '4 PM', level: 'High' }
                ]
            },
            { id: 'p1_3', name: 'Rohtang Pass', type: 'Nature', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Summer', duration: '6h', cost: 2500, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1605649487215-285f33880653?w=500&auto=format&fit=crop&q=60' },
            { id: 'p1_4', name: 'Old Manali', type: 'Urban', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '3h', cost: 500, bestTime: 'Evening', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&auto=format&fit=crop&q=60' },
            { id: 'p1_5', name: 'Jogini Waterfalls', type: 'Nature', popularityScore: 7.5, crowdLevel: 'Low', bestSeason: 'Mar-Nov', duration: '3h', cost: 0, bestTime: 'Afternoon', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=500&auto=format&fit=crop&q=60', activityIds: ['a7'] },
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
            {
                id: 'p2_1', name: 'Baga Beach', type: 'Nature', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Nov-Feb', duration: '4h', cost: 500, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1548232979-6c557ee14752?w=500&auto=format&fit=crop&q=60', activityIds: ['a2'],
                bestWindow: '4 PM - 7 PM',
                crowdTimeline: [{ time: '10 AM', level: 'Low' }, { time: '2 PM', level: 'Medium' }, { time: '5 PM', level: 'High' }, { time: '8 PM', level: 'High' }]
            },
            {
                id: 'p2_2', name: 'Fort Aguada', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 300, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1590422749842-3a5c2d3cae0a?w=500&auto=format&fit=crop&q=60',
                bestWindow: '9 AM - 11 AM',
                crowdTimeline: [{ time: '9 AM', level: 'Low' }, { time: '11 AM', level: 'Medium' }, { time: '4 PM', level: 'High' }]
            },
            { id: 'p2_3', name: 'Dudhsagar Falls', type: 'Nature', popularityScore: 9.0, crowdLevel: 'Medium', bestSeason: 'Monsoon', duration: '6h', cost: 1500, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1544473244-f6895e672d62?w=500&auto=format&fit=crop&q=60', activityIds: ['a7'] },
            { id: 'p2_4', name: 'Palolem Beach', type: 'Relaxation', popularityScore: 8.0, crowdLevel: 'Low', bestSeason: 'Nov-Mar', duration: '4h', cost: 200, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1591526462947-2cb83d8e58da?w=500&auto=format&fit=crop&q=60' },
            { id: 'p2_5', name: 'Basilica of Bom Jesus', type: 'Heritage', popularityScore: 8.8, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 0, bestTime: 'Any', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1587588354456-ae376af71a25?w=500&auto=format&fit=crop&q=60' },
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
            { id: 'p3_1', name: 'Amber Fort', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Oct-Mar', duration: '3h', cost: 500, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=60' },
            { id: 'p3_2', name: 'Hawa Mahal', type: 'Heritage', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 200, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&auto=format&fit=crop&q=60' },
            { id: 'p3_3', name: 'City Palace', type: 'Heritage', popularityScore: 9.0, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 700, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1557690756-62725e24344e?w=500&auto=format&fit=crop&q=60' },
            { id: 'p3_4', name: 'Jantar Mantar', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1.5h', cost: 200, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1592639396345-0d04c47849e7?w=500&auto=format&fit=crop&q=60' },
            { id: 'p3_5', name: 'Nahargarh Fort', type: 'Nature', popularityScore: 8.8, crowdLevel: 'Medium', bestSeason: 'Sunset', duration: '3h', cost: 200, bestTime: 'Sunset', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1590435974026-6b21644c1d47?w=500&auto=format&fit=crop&q=60' },
        ]
    },
    {
        id: 'd4',
        name: 'Varanasi',
        state: 'Uttar Pradesh',
        category: 'Spiritual',
        famousFor: 'Ancient ghats and spiritual ceremonies',
        tags: ['Ganga', 'Temples', 'Culture'],
        image: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmFyYW5hc2l8ZW58MHx8MHx8fDA%3D',
        averageDailyCost: 2500,
        places: [
            { id: 'p4_1', name: 'Dashashwamedh Ghat', type: 'Spiritual', popularityScore: 10, crowdLevel: 'High', bestSeason: 'Year-round', duration: '3h', cost: 0, bestTime: 'Evening', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1561361513-35e6ba0d7943?w=500&auto=format&fit=crop&q=60', activityIds: ['a8'] },
            { id: 'p4_2', name: 'Kashi Vishwanath Temple', type: 'Spiritual', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Year-round', duration: '2h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?w=500&auto=format&fit=crop&q=60', activityIds: ['a8'] },
            { id: 'p4_3', name: 'Sarnath', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Oct-Mar', duration: '3h', cost: 200, bestTime: 'Afternoon', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1571597438372-540dd352bf41?w=500&auto=format&fit=crop&q=60' },
            { id: 'p4_4', name: 'Assi Ghat', type: 'Spiritual', popularityScore: 8.0, crowdLevel: 'Medium', bestSeason: 'Morning', duration: '2h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1596001004147-38435d791533?w=500&auto=format&fit=crop&q=60' },
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
            { id: 'p5_1', name: 'Tea Museum', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 200, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1585800454359-598d9255a298?w=500&auto=format&fit=crop&q=60' },
            { id: 'p5_2', name: 'Eravikulam National Park', type: 'Nature', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Sep-Mar', duration: '4h', cost: 500, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1591807353995-1f99c27f329d?w=500&auto=format&fit=crop&q=60' },
            { id: 'p5_3', name: 'Mattupetty Dam', type: 'Nature', popularityScore: 8.8, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1h', cost: 50, bestTime: 'Any', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1598687704772-f61b0c03cc5f?w=500&auto=format&fit=crop&q=60' },
            { id: 'p5_4', name: 'Top Station', type: 'Nature', popularityScore: 8.0, crowdLevel: 'Low', bestSeason: 'Morning', duration: '3h', cost: 0, bestTime: 'Sunrise', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1627915570889-cb7dd714d5ce?w=500&auto=format&fit=crop&q=60', activityIds: ['a7'] },
        ]
    },
    {
        id: 'd6',
        name: 'Rishikesh',
        state: 'Uttarakhand',
        category: 'Spiritual',
        famousFor: 'Yoga capital and white water rafting',
        tags: ['Yoga', 'Rafting', 'Ganga'],
        image: 'https://images.unsplash.com/photo-1624807136278-e2973be118ff?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJpc2hpa2VzaHxlbnwwfHwwfHx8MA%3D%3D',
        averageDailyCost: 3000,
        places: [
            { id: 'p6_1', name: 'Laxman Jhula', type: 'Heritage', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 0, bestTime: 'Evening', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1594970428803-b1d3032d8478?w=500&auto=format&fit=crop&q=60' },
            { id: 'p6_2', name: 'Triveni Ghat', type: 'Spiritual', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Evening', duration: '2h', cost: 0, bestTime: 'Evening', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1594493397980-fc02a9a7384a?w=500&auto=format&fit=crop&q=60' },
            { id: 'p6_3', name: 'River Rafting Point', type: 'Adventure', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Sep-Jun', duration: '4h', cost: 1500, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1626624343160-c3d9a0d10266?w=500&auto=format&fit=crop&q=60' },
            { id: 'p6_4', name: 'Beatles Ashram', type: 'Heritage', popularityScore: 7.5, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '2h', cost: 600, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1627896476140-54b0365022cc?w=500&auto=format&fit=crop&q=60' },
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
            { id: 'p7_1', name: 'City Palace', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Year-round', duration: '3h', cost: 400, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=500&auto=format&fit=crop&q=60' },
            { id: 'p7_2', name: 'Lake Pichola', type: 'Nature', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Sunset', duration: '2h', cost: 500, bestTime: 'Sunset', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1595265677860-9a31435d8536?w=500&auto=format&fit=crop&q=60' },
            { id: 'p7_3', name: 'Jag Mandir', type: 'Heritage', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1h', cost: 300, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1628173426868-b7886477017d?w=500&auto=format&fit=crop&q=60' },
            { id: 'p7_4', name: 'Sajjangarh Monsoon Palace', type: 'Nature', popularityScore: 9.0, crowdLevel: 'Medium', bestSeason: 'Monsoon', duration: '2h', cost: 150, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1633519391060-f965d8362b58?w=500&auto=format&fit=crop&q=60' },
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
            { id: 'p8_1', name: 'Pangong Lake', type: 'Nature', popularityScore: 10, crowdLevel: 'High', bestSeason: 'Jun-Sep', duration: '4h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1601009187313-2d2c70032c28?w=500&auto=format&fit=crop&q=60' },
            { id: 'p8_2', name: 'Nubra Valley', type: 'Nature', popularityScore: 9.5, crowdLevel: 'Medium', bestSeason: 'Jun-Sep', duration: '5h', cost: 500, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1627052968858-54c3c3a918a3?w=500&auto=format&fit=crop&q=60' },
            { id: 'p8_3', name: 'Thiksey Monastery', type: 'Spiritual', popularityScore: 8.5, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '1.5h', cost: 100, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1598000494396-857ae230b80e?w=500&auto=format&fit=crop&q=60' },
            { id: 'p8_4', name: 'Khardung La Pass', type: 'Adventure', popularityScore: 9.2, crowdLevel: 'Medium', bestSeason: 'Jun-Sep', duration: '1h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1597519616091-bf1f57f44ace?w=500&auto=format&fit=crop&q=60' },
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
            { id: 'p9_1', name: 'Gateway of India', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=500&auto=format&fit=crop&q=60' },
            { id: 'p9_2', name: 'Marine Drive', type: 'Urban', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Evening', duration: '2h', cost: 0, bestTime: 'Sunset', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1567157577867-05ccb782306d?w=500&auto=format&fit=crop&q=60' },
            { id: 'p9_3', name: 'Elephanta Caves', type: 'Heritage', popularityScore: 8.8, crowdLevel: 'Medium', bestSeason: 'Nov-Mar', duration: '4h', cost: 250, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1627299616853-535359142ec7?w=500&auto=format&fit=crop&q=60' },
            { id: 'p9_4', name: 'Colaba Causeway', type: 'Urban', popularityScore: 8.5, crowdLevel: 'High', bestSeason: 'Year-round', duration: '2h', cost: 0, bestTime: 'Afternoon', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1681754026365-d41c8849b291?w=500&auto=format&fit=crop&q=60' },
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
            { id: 'p10_1', name: 'Radhanagar Beach', type: 'Nature', popularityScore: 10, crowdLevel: 'High', bestSeason: 'Oct-May', duration: '3h', cost: 0, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1629858509033-6893c5d6487e?w=500&auto=format&fit=crop&q=60' },
            { id: 'p10_2', name: 'Cellular Jail', type: 'Heritage', popularityScore: 9.5, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 100, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1596791409278-68783472506b?w=500&auto=format&fit=crop&q=60' },
            { id: 'p10_3', name: 'Elephant Beach', type: 'Adventure', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Oct-May', duration: '4h', cost: 1200, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1569485641753-2cf53c07f212?w=500&auto=format&fit=crop&q=60' },
            { id: 'p10_4', name: 'Ross Island', type: 'Heritage', popularityScore: 8.0, crowdLevel: 'Low', bestSeason: 'Oct-May', duration: '2h', cost: 200, bestTime: 'Afternoon', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1628173426868-b7886477017d?w=500&auto=format&fit=crop&q=60' },
        ]
    },
    {
        id: 'd11',
        name: 'Hampi',
        state: 'Karnataka',
        category: 'Heritage',
        famousFor: 'Ancient ruins and boulder landscapes',
        tags: ['History', 'Ruins', 'Architecture'],
        image: 'https://images.unsplash.com/photo-1561981969-65ee8dfc7351?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhhbXBpfGVufDB8fDB8fHww',
        averageDailyCost: 2500,
        places: [
            { id: 'p11_1', name: 'Virupaksha Temple', type: 'Spiritual', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Oct-Feb', duration: '1h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1623143584856-bf5db5a16c7f?w=500&auto=format&fit=crop&q=60' },
            { id: 'p11_2', name: 'Vijaya Vittala Temple', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Oct-Feb', duration: '2h', cost: 500, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1590422749842-3a5c2d3cae0a?w=500&auto=format&fit=crop&q=60' },
            { id: 'p11_3', name: 'Matanga Hill', type: 'Nature', popularityScore: 9.0, crowdLevel: 'Medium', bestSeason: 'Sunrise', duration: '2h', cost: 0, bestTime: 'Sunrise', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1625902030018-7b9c9f2b8423?w=500&auto=format&fit=crop&q=60' },
            { id: 'p11_4', name: 'Coracle Ride', type: 'Adventure', popularityScore: 8.5, crowdLevel: 'Medium', bestSeason: 'Oct-Feb', duration: '1h', cost: 400, bestTime: 'Evening', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1601726002061-0b5c1c045053?w=500&auto=format&fit=crop&q=60' },
        ]
    },
    {
        id: 'd12',
        name: 'Coorg',
        state: 'Karnataka',
        category: 'Nature',
        famousFor: 'Coffee plantations and waterfalls',
        tags: ['Coffee', 'Hills', 'Nature'],
        image: 'https://images.unsplash.com/photo-1599922760936-e840fa373d8d?q=80&w=3678&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        averageDailyCost: 4000,
        places: [
            { id: 'p12_1', name: 'Abbey Falls', type: 'Nature', popularityScore: 9.2, crowdLevel: 'High', bestSeason: 'Monsoon', duration: '2h', cost: 50, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1627896476140-54b0365022cc?w=500&auto=format&fit=crop&q=60' },
            { id: 'p12_2', name: 'Dubare Elephant Camp', type: 'Nature', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Year-round', duration: '3h', cost: 300, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1634629377488-81d33144c207?w=500&auto=format&fit=crop&q=60' },
            { id: 'p12_3', name: 'Raja\'s Seat', type: 'Relaxation', popularityScore: 8.5, crowdLevel: 'High', bestSeason: 'Sunset', duration: '1h', cost: 20, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1598000494396-857ae230b80e?w=500&auto=format&fit=crop&q=60' },
            { id: 'p12_4', name: 'Coffee Plantation Tour', type: 'Nature', popularityScore: 8.8, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '2h', cost: 500, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1601009187313-2d2c70032c28?w=500&auto=format&fit=crop&q=60' },
        ]
    },
    {
        id: 'd13',
        name: 'Kashmir',
        state: 'Jammu & Kashmir',
        category: 'Mountains',
        famousFor: 'Pristine Dal Lake shikaras, Mughal gardens, and snow-laden peaks of Gulmarg',
        tags: ['Snow', 'Lakes', 'Meadows', 'Himalayas'],
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 4800,
        places: [
            { id: 'p13_1', name: 'Gulmarg Gondola & Apharwat Peak', type: 'Adventure', popularityScore: 9.9, crowdLevel: 'High', bestSeason: 'Dec-Apr', duration: '5h', cost: 1850, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80' },
            { id: 'p13_2', name: 'Dal Lake Morning Shikara', type: 'Relaxation', popularityScore: 9.8, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 800, bestTime: 'Sunrise', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&auto=format&fit=crop&q=80' },
            { id: 'p13_3', name: 'Betaab Valley & Aru Meadows', type: 'Nature', popularityScore: 9.2, crowdLevel: 'Medium', bestSeason: 'Apr-Oct', duration: '4h', cost: 300, bestTime: 'Afternoon', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80' },
            { id: 'p13_4', name: 'Nishat Bagh Royal Garden', type: 'Heritage', popularityScore: 8.9, crowdLevel: 'Low', bestSeason: 'Apr-Nov', duration: '2h', cost: 100, bestTime: 'Sunset', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd14',
        name: 'Spiti Valley',
        state: 'Himachal Pradesh',
        category: 'Mountains',
        famousFor: 'High-altitude Tibetan moonscape, ancient clifftop monasteries, and pristine starry skies',
        tags: ['Monastery', 'High Altitude', 'Stargazing', 'Adventure'],
        image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 3200,
        places: [
            { id: 'p14_1', name: 'Key Monastery', type: 'Spiritual', popularityScore: 9.8, crowdLevel: 'Low', bestSeason: 'May-Oct', duration: '3h', cost: 50, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&auto=format&fit=crop&q=80' },
            { id: 'p14_2', name: 'Chandratal Lake (Moon Lake)', type: 'Nature', popularityScore: 9.7, crowdLevel: 'Medium', bestSeason: 'Jun-Sep', duration: '4h', cost: 0, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1601009187313-2d2c70032c28?w=800&auto=format&fit=crop&q=80' },
            { id: 'p14_3', name: 'Dhankar Clifftop Monastery', type: 'Heritage', popularityScore: 9.1, crowdLevel: 'Low', bestSeason: 'Jun-Oct', duration: '2.5h', cost: 50, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1598000494396-857ae230b80e?w=800&auto=format&fit=crop&q=80' },
            { id: 'p14_4', name: 'Hikkim Highest Post Office', type: 'Urban', popularityScore: 8.8, crowdLevel: 'Medium', bestSeason: 'Jun-Oct', duration: '1.5h', cost: 100, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1627052968858-54c3c3a918a3?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd15',
        name: 'Jaisalmer',
        state: 'Rajasthan',
        category: 'Heritage',
        famousFor: 'Golden sandstone living fort, desert havelis, and evening camel treks on Sam dunes',
        tags: ['Desert', 'Forts', 'Dunes', 'Royal'],
        image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 3800,
        places: [
            { id: 'p15_1', name: 'Jaisalmer Fort (Sonar Qila)', type: 'Heritage', popularityScore: 9.8, crowdLevel: 'High', bestSeason: 'Oct-Mar', duration: '3.5h', cost: 250, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&auto=format&fit=crop&q=80' },
            { id: 'p15_2', name: 'Patwon Ki Haveli', type: 'Heritage', popularityScore: 9.2, crowdLevel: 'Medium', bestSeason: 'Oct-Mar', duration: '2h', cost: 150, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80' },
            { id: 'p15_3', name: 'Sam Sand Dunes Camel Safari', type: 'Adventure', popularityScore: 9.5, crowdLevel: 'High', bestSeason: 'Oct-Mar', duration: '3h', cost: 800, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80' },
            { id: 'p15_4', name: 'Gadisar Lake at Dusk', type: 'Relaxation', popularityScore: 8.9, crowdLevel: 'Low', bestSeason: 'Oct-Mar', duration: '1.5h', cost: 100, bestTime: 'Sunset', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1590435974026-6b21644c1d47?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd16',
        name: 'Pondicherry',
        state: 'Puducherry',
        category: 'Beaches',
        famousFor: 'Pastel French quarters, tranquil seaside promenade, artisan bakeries, and Auroville',
        tags: ['French Quarter', 'Coast', 'Cafes', 'Boutique'],
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 3600,
        places: [
            { id: 'p16_1', name: 'White Town Heritage Cycle Tour', type: 'Heritage', popularityScore: 9.6, crowdLevel: 'Medium', bestSeason: 'Oct-Mar', duration: '2.5h', cost: 400, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop&q=80' },
            { id: 'p16_2', name: 'Promenade Seaside Walkway', type: 'Relaxation', popularityScore: 9.4, crowdLevel: 'High', bestSeason: 'Year-round', duration: '2h', cost: 0, bestTime: 'Sunset', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
            { id: 'p16_3', name: 'Auroville Matrimandir & Peace Area', type: 'Spiritual', popularityScore: 9.5, crowdLevel: 'Medium', bestSeason: 'Oct-Mar', duration: '3h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80' },
            { id: 'p16_4', name: 'Paradise Beach by Ferry', type: 'Nature', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Nov-Feb', duration: '3h', cost: 350, bestTime: 'Afternoon', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd17',
        name: 'Alleppey',
        state: 'Kerala',
        category: 'Nature',
        famousFor: 'Emerald backwaters, silent overnight houseboats, coconut canals, and coir villages',
        tags: ['Backwaters', 'Houseboat', 'Lush', 'Relaxation'],
        image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 4200,
        places: [
            { id: 'p17_1', name: 'Vembanad Lake Houseboat Cruise', type: 'Nature', popularityScore: 9.9, crowdLevel: 'Medium', bestSeason: 'Sep-Mar', duration: '6h', cost: 3500, bestTime: 'Afternoon', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80' },
            { id: 'p17_2', name: 'Marari Serene White Sand Beach', type: 'Relaxation', popularityScore: 9.2, crowdLevel: 'Low', bestSeason: 'Nov-Feb', duration: '3h', cost: 0, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
            { id: 'p17_3', name: 'Kuttanad Canal Canoe Trail', type: 'Adventure', popularityScore: 9.4, crowdLevel: 'Low', bestSeason: 'Sep-Mar', duration: '2.5h', cost: 600, bestTime: 'Sunrise', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1544473244-f6895e672d62?w=800&auto=format&fit=crop&q=80' },
            { id: 'p17_4', name: 'Alappuzha Pier & Lighthouse', type: 'Heritage', popularityScore: 8.7, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1.5h', cost: 50, bestTime: 'Sunset', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1590422749842-3a5c2d3cae0a?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd18',
        name: 'Meghalaya',
        state: 'Meghalaya',
        category: 'Nature',
        famousFor: 'Double decker living root bridges, crystal clear Umngot river, and misty waterfalls',
        tags: ['Waterfalls', 'Root Bridges', 'Trekking', 'Clouds'],
        image: 'https://images.unsplash.com/photo-1626014903708-41407985449a?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 3500,
        places: [
            { id: 'p18_1', name: 'Double Decker Living Root Bridge', type: 'Adventure', popularityScore: 9.9, crowdLevel: 'Medium', bestSeason: 'Oct-Apr', duration: '6h', cost: 100, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1626014903708-41407985449a?w=800&auto=format&fit=crop&q=80' },
            { id: 'p18_2', name: 'Dawki Umngot River Boat Ride', type: 'Nature', popularityScore: 9.6, crowdLevel: 'High', bestSeason: 'Nov-Mar', duration: '2h', cost: 600, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80' },
            { id: 'p18_3', name: 'Nohkalikai Falls Overlook', type: 'Nature', popularityScore: 9.3, crowdLevel: 'Medium', bestSeason: 'Sep-Apr', duration: '1.5h', cost: 50, bestTime: 'Afternoon', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1544473244-f6895e672d62?w=800&auto=format&fit=crop&q=80' },
            { id: 'p18_4', name: 'Mawsmai Limestone Caves', type: 'Adventure', popularityScore: 8.8, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2h', cost: 100, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1627299616853-535359142ec7?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd19',
        name: 'Gokarna',
        state: 'Karnataka',
        category: 'Beaches',
        famousFor: 'Scenic cliffside coastal treks, Om Beach crescent, and laidback Bohemian seaside shacks',
        tags: ['Beach Trek', 'Quiet', 'Cliffs', 'Sunsets'],
        image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 2800,
        places: [
            { id: 'p19_1', name: 'Om Beach & Cliff Trail', type: 'Nature', popularityScore: 9.6, crowdLevel: 'Medium', bestSeason: 'Oct-Mar', duration: '3h', cost: 0, bestTime: 'Sunset', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&auto=format&fit=crop&q=80' },
            { id: 'p19_2', name: 'Half Moon to Paradise Beach Trek', type: 'Adventure', popularityScore: 9.3, crowdLevel: 'Low', bestSeason: 'Oct-Mar', duration: '3.5h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
            { id: 'p19_3', name: 'Mahabaleshwar Ancient Temple', type: 'Spiritual', popularityScore: 9.0, crowdLevel: 'High', bestSeason: 'Year-round', duration: '1.5h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1623143584856-bf5db5a16c7f?w=800&auto=format&fit=crop&q=80' },
            { id: 'p19_4', name: 'Kudle Beach Sunset Cafes', type: 'Relaxation', popularityScore: 9.1, crowdLevel: 'Medium', bestSeason: 'Nov-Feb', duration: '2.5h', cost: 400, bestTime: 'Sunset', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1548232979-6c557ee14752?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd20',
        name: 'Dharamshala',
        state: 'Himachal Pradesh',
        category: 'Mountains',
        famousFor: 'Home of the Dalai Lama, Tibetan prayer wheels, pine-clad Triund ridge, and mountain cafes',
        tags: ['Tibetan', 'Monasteries', 'Triund', 'Trekking'],
        image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 3100,
        places: [
            { id: 'p20_1', name: 'Tsuglagkhang Dalai Lama Temple Complex', type: 'Spiritual', popularityScore: 9.8, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '2.5h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&auto=format&fit=crop&q=80' },
            { id: 'p20_2', name: 'Triund Ridge Day Hike', type: 'Adventure', popularityScore: 9.7, crowdLevel: 'High', bestSeason: 'Mar-Jun, Sep-Nov', duration: '6h', cost: 500, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80' },
            { id: 'p20_3', name: 'Norbulingka Arts Institute', type: 'Heritage', popularityScore: 9.1, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '2h', cost: 150, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80' },
            { id: 'p20_4', name: 'Bhagsunag Waterfall & Shiva Cafe', type: 'Nature', popularityScore: 8.8, crowdLevel: 'High', bestSeason: 'Mar-Nov', duration: '2h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd21',
        name: 'Amritsar',
        state: 'Punjab',
        category: 'Spiritual',
        famousFor: 'Radiant Golden Temple sanctum, world-famous communal langar, and Wagah border parade',
        tags: ['Golden Temple', 'Langar', 'Heritage', 'Food'],
        image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 2600,
        places: [
            { id: 'p21_1', name: 'Sri Harmandir Sahib (Golden Temple)', type: 'Spiritual', popularityScore: 10, crowdLevel: 'High', bestSeason: 'Oct-Mar', duration: '4h', cost: 0, bestTime: 'Sunrise', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=800&auto=format&fit=crop&q=80' },
            { id: 'p21_2', name: 'Wagah Border Beating Retreat Ceremony', type: 'Heritage', popularityScore: 9.6, crowdLevel: 'High', bestSeason: 'Year-round', duration: '3.5h', cost: 0, bestTime: 'Sunset', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1590422749842-3a5c2d3cae0a?w=800&auto=format&fit=crop&q=80' },
            { id: 'p21_3', name: 'Jallianwala Bagh Memorial', type: 'Heritage', popularityScore: 9.3, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1.5h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1571597438372-540dd352bf41?w=800&auto=format&fit=crop&q=80' },
            { id: 'p21_4', name: 'Partition Museum at Town Hall', type: 'Heritage', popularityScore: 9.1, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '2h', cost: 50, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Indoor', image: 'https://images.unsplash.com/photo-1596791409278-68783472506b?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd22',
        name: 'Kodaikanal',
        state: 'Tamil Nadu',
        category: 'Nature',
        famousFor: 'Star-shaped mountain lake, towering Pillar Rocks, fragrant eucalyptus groves, and Coaker\'s walk',
        tags: ['Pine Woods', 'Lakes', 'Misty Hills', 'Quiet'],
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 3400,
        places: [
            { id: 'p22_1', name: 'Kodaikanal Star Lake & Rowing', type: 'Relaxation', popularityScore: 9.4, crowdLevel: 'Medium', bestSeason: 'Sep-May', duration: '2.5h', cost: 250, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80' },
            { id: 'p22_2', name: 'Coaker\'s Walk Valley Vista', type: 'Nature', popularityScore: 9.2, crowdLevel: 'High', bestSeason: 'Oct-May', duration: '1.5h', cost: 30, bestTime: 'Morning', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80' },
            { id: 'p22_3', name: 'Pine Forest Morning Stroll', type: 'Nature', popularityScore: 9.1, crowdLevel: 'Low', bestSeason: 'Year-round', duration: '2h', cost: 20, bestTime: 'Sunrise', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80' },
            { id: 'p22_4', name: 'Pillar Rocks Mist Overlook', type: 'Nature', popularityScore: 8.9, crowdLevel: 'Medium', bestSeason: 'Sep-Apr', duration: '1.5h', cost: 20, bestTime: 'Afternoon', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd23',
        name: 'Darjeeling',
        state: 'West Bengal',
        category: 'Mountains',
        famousFor: 'Lush colonial tea gardens, Tiger Hill dawn over Mount Kanchenjunga, and UNESCO Toy Train',
        tags: ['Tea Gardens', 'Toy Train', 'Kanchenjunga', 'Himalayas'],
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 3700,
        places: [
            { id: 'p23_1', name: 'Tiger Hill Sunrise over Kanchenjunga', type: 'Nature', popularityScore: 9.9, crowdLevel: 'High', bestSeason: 'Oct-May', duration: '3h', cost: 100, bestTime: 'Sunrise', weatherSensitivity: 'High', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80' },
            { id: 'p23_2', name: 'Happy Valley Tea Estate Tasting', type: 'Heritage', popularityScore: 9.4, crowdLevel: 'Medium', bestSeason: 'Mar-Nov', duration: '2.5h', cost: 250, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1585800454359-598d9255a298?w=800&auto=format&fit=crop&q=80' },
            { id: 'p23_3', name: 'Darjeeling Himalayan Railway (Toy Train)', type: 'Heritage', popularityScore: 9.7, crowdLevel: 'High', bestSeason: 'Year-round', duration: '2h', cost: 1200, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1596791409278-68783472506b?w=800&auto=format&fit=crop&q=80' },
            { id: 'p23_4', name: 'Batasia Loop & War Memorial', type: 'Heritage', popularityScore: 8.9, crowdLevel: 'Medium', bestSeason: 'Oct-Apr', duration: '1.5h', cost: 50, bestTime: 'Afternoon', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80' },
        ]
    },
    {
        id: 'd24',
        name: 'Jodhpur',
        state: 'Rajasthan',
        category: 'Heritage',
        famousFor: 'The historic Blue City, colossal Mehrangarh citadel, royal stepwells, and desert spice bazaars',
        tags: ['Blue City', 'Mehrangarh', 'Stepwells', 'Desert'],
        image: 'https://images.unsplash.com/photo-1590422749842-3a5c2d3cae0a?w=800&auto=format&fit=crop&q=80',
        averageDailyCost: 3400,
        places: [
            { id: 'p24_1', name: 'Mehrangarh Fort Clifftop Walk', type: 'Heritage', popularityScore: 9.9, crowdLevel: 'High', bestSeason: 'Oct-Mar', duration: '3.5h', cost: 600, bestTime: 'Morning', weatherSensitivity: 'Medium', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1590422749842-3a5c2d3cae0a?w=800&auto=format&fit=crop&q=80' },
            { id: 'p24_2', name: 'Navchokiya Blue City Walking Trail', type: 'Heritage', popularityScore: 9.5, crowdLevel: 'Low', bestSeason: 'Oct-Mar', duration: '2h', cost: 0, bestTime: 'Morning', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&auto=format&fit=crop&q=80' },
            { id: 'p24_3', name: 'Toorji Ka Jhalra Stepwell & Cafe', type: 'Heritage', popularityScore: 9.2, crowdLevel: 'Medium', bestSeason: 'Year-round', duration: '1.5h', cost: 0, bestTime: 'Sunset', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&auto=format&fit=crop&q=80' },
            { id: 'p24_4', name: 'Jaswant Thada Marble Cenotaph', type: 'Heritage', popularityScore: 8.9, crowdLevel: 'Low', bestSeason: 'Oct-Mar', duration: '1.5h', cost: 50, bestTime: 'Afternoon', weatherSensitivity: 'Low', locationType: 'Outdoor', image: 'https://images.unsplash.com/photo-1557690756-62725e24344e?w=800&auto=format&fit=crop&q=80' },
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
        image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=500&auto=format&fit=crop&q=60',
        duration: '2-4 Hours'
    },
    {
        id: 'a2',
        name: 'Scuba Diving',
        category: 'Adventure',
        bestPlaces: ['Andaman', 'Goa', 'Lakshadweep'],
        bestSeason: 'Oct - May',
        difficulty: 'Moderate',
        description: 'Explore vibrant coral reefs and marine life deep underwater.',
        image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=500&auto=format&fit=crop&q=60',
        duration: '3-5 Hours'
    },
    {
        id: 'a3',
        name: 'Yoga Retreat',
        category: 'Spiritual',
        bestPlaces: ['Rishikesh', 'Kerala', 'Goa'],
        bestSeason: 'Year-round',
        difficulty: 'Easy',
        description: 'Rejuvenate your mind and body in the birthplace of Yoga.',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=60',
        duration: '1-7 Days'
    },
    {
        id: 'a4',
        name: 'Camel Safari',
        category: 'Adventure',
        bestPlaces: ['Jaisalmer', 'Pushkar', 'Bikaner'],
        bestSeason: 'Oct - Mar',
        difficulty: 'Easy',
        description: 'Ride through the golden dunes of the Thar desert at sunset.',
        image: 'https://plus.unsplash.com/premium_photo-1661962542692-4fe7a4ad6b54?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2FtZWwlMjBzYWZhcml8ZW58MHx8MHx8fDA%3D',
        duration: '2 Hours'
    },
    {
        id: 'a5',
        name: 'Houseboat Stay',
        category: 'Nature',
        bestPlaces: ['Alleppey', 'Kumarakom', 'Srinagar'],
        bestSeason: 'Aug - Mar',
        difficulty: 'Easy',
        description: 'Drift along serene backwaters in a traditional houseboat.',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=500&auto=format&fit=crop&q=60',
        duration: 'Overnight'
    },
    {
        id: 'a6',
        name: 'Street Food Tour',
        category: 'Food',
        bestPlaces: ['Delhi', 'Mumbai', 'Lucknow'],
        bestSeason: 'Year-round',
        difficulty: 'Easy',
        description: 'Taste the authentic flavors of India, from chaat to kebabs.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60',
        duration: '3 Hours'
    },
    {
        id: 'a7',
        name: 'Trekking',
        category: 'Adventure',
        bestPlaces: ['Triund', 'Valley of Flowers', 'Kheerganga'],
        bestSeason: 'May - Oct',
        difficulty: 'Hard',
        description: 'Conquer the peaks and witness breathtaking mountain vistas.',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500&auto=format&fit=crop&q=60',
        duration: 'Full Day'
    },
    {
        id: 'a8',
        name: 'Temple Tour',
        category: 'Culture',
        bestPlaces: ['Varanasi', 'Madurai', 'Hampi'],
        bestSeason: 'Year-round',
        difficulty: 'Easy',
        description: 'Marvel at ancient architecture and spiritual ceremonies.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&auto=format&fit=crop&q=60',
        duration: 'Half Day'
    }
];
