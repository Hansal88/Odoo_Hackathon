const PLACE_PROFILES = [
  {
    key: 'manali',
    matchWords: ['manali', 'himachal', 'shimla', 'kasol', 'kullu', 'leh', 'ladakh', 'mountain', 'himalaya'],
    label: 'Mountain Escape',
    publicIds: [
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Manali_jan.jpg', label: 'Snow Peaks' },
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Manali_2022.jpg', label: 'Nature Trails' },
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Mountains%2C_Manali%2C_Himachal_Pradesh.jpg', label: 'Valley Stay' },
    ],
    explore: [
      { name: 'Solang Valley', description: 'Snow sports, cable cars, and open valley views.' },
      { name: 'Hidimba Devi Temple', description: 'A quiet cedar-forest stop near Old Manali.' },
      { name: 'Vashisht Hot Springs', description: 'Warm up after a cold mountain day.' },
      { name: 'Mall Road', description: 'Evening walks, cafes, and local shopping.' },
    ],
    stay: [
      'Mountain-view homestay near Old Manali',
      'Cottage or boutique hotel with heater',
      'Riverside stay for a quiet retreat',
    ],
    food: [
      'Hot momos, thukpa, and soups',
      'Tea cafes with parathas and Maggi',
      'Local bakeries for quick breakfast stops',
    ],
    travel: [
      'Shared cab for Solang Valley',
      'Private taxi for Rohtang or snow points',
      'Walking and short auto rides around Old Manali',
    ],
    activities: [
      'Cable car ride',
      'Snow play and short treks',
      'Cafe hopping in the evening',
    ],
    packing: [
      'Warm jackets and sweaters',
      'Thermals and wool socks',
      'Gloves, cap, and scarf',
      'Comfortable trekking shoes',
      'Moisturizer and lip balm',
      'Power bank and flashlight',
    ],
  },
  {
    key: 'goa',
    matchWords: ['goa', 'beach', 'shore', 'coast', 'sea'],
    label: 'Beach Escape',
    publicIds: [
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Donna_Paula%2C_Goa.jpg', label: 'Beach View' },
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Panjim_Downtown.JPG', label: 'Sunset Coast' },
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Goa_Memorial.JPG', label: 'Palm Coast' },
    ],
    explore: [
      { name: 'Baga and Calangute', description: 'Popular beaches for sun, sand, and water sports.' },
      { name: 'Fort Aguada', description: 'Historic fort with wide coastal views.' },
      { name: 'Anjuna Market', description: 'Flea market shopping and local finds.' },
      { name: 'Fontainhas', description: 'A colorful heritage walk through Panaji.' },
    ],
    stay: [
      'Beach resort or villa near the coast',
      'Boutique hotel in North Goa',
      'Homestay close to cafes and nightlife',
    ],
    food: [
      'Seafood grills and beach shacks',
      'Local Goan thalis and curries',
      'Fresh fruit, juices, and cafe breakfasts',
    ],
    travel: [
      'Scooter or bike rental for local travel',
      'Taxi for airport and inter-beach transfers',
      'Walking for market and old town areas',
    ],
    activities: [
      'Sunset cruises',
      'Water sports',
      'Market hopping and nightlife',
    ],
    packing: [
      'Sunscreen and sunglasses',
      'Swimwear and beach towel',
      'Flip flops / sandals',
      'Dry bag for electronics',
      'Light cotton clothes',
      'Reusable water bottle',
    ],
  },
  {
    key: 'kerala',
    matchWords: ['kerala', 'munnar', 'alleppey', 'kochi', 'backwater', 'houseboat'],
    label: 'Nature & Backwaters',
    publicIds: [
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Kathakali_BNC.jpg', label: 'Green Hills' },
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Jain_temple%2C_Wayanad_IMG_3494_by_Joseph_Lazer.jpg', label: 'Backwater Ride' },
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Cheraman_juma_masjid_Old.jpg', label: 'Tropical Greens' },
    ],
    explore: [
      { name: 'Alleppey Backwaters', description: 'Houseboats, canals, and slow scenic cruising.' },
      { name: 'Munnar Tea Gardens', description: 'Rolling tea estates with cool weather walks.' },
      { name: 'Kochi Fort Area', description: 'Colonial lanes, art cafes, and heritage stops.' },
      { name: 'Athirappilly Falls', description: 'A strong waterfall day trip for nature lovers.' },
    ],
    stay: [
      'Houseboat or backwater resort',
      'Tea estate stay in Munnar',
      'Heritage hotel in Kochi',
    ],
    food: [
      'Kerala sadya and local meals',
      'Seafood with coconut-based curries',
      'Tea-time snacks and banana chips',
    ],
    travel: [
      'Private cab between towns',
      'Auto-rickshaws for short city rides',
      'Boat transfer or houseboat cruise',
    ],
    activities: [
      'Backwater cruise',
      'Tea estate walk',
      'Cultural evening in Kochi',
    ],
    packing: [
      'Light breathable clothes',
      'Mosquito repellent',
      'Comfortable walking sandals',
      'Rain jacket / umbrella',
      'Power bank',
      'Waterproof pouch for phone',
    ],
  },
  {
    key: 'tokyo',
    matchWords: ['tokyo', 'kyoto', 'osaka', 'japan'],
    label: 'City & Culture',
    publicIds: [
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Tokyo_from_the_top_of_the_SkyTree_%28cropped%29.JPG', label: 'City Lights' },
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/1/13/KokyoFushimiYaguraM1070.jpg', label: 'Temple Streets' },
      { publicId: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Shofuku-ji_main_hall_%281%29_2023-09-10.jpg', label: 'Urban Walks' },
    ],
    explore: [
      { name: 'Shibuya Crossing', description: 'Iconic city energy and a classic Tokyo stop.' },
      { name: 'Asakusa & Senso-ji', description: 'Historic temples, shopping lanes, and street snacks.' },
      { name: 'Akihabara', description: 'Anime, gaming, and neon city culture.' },
      { name: 'Kiyomizu-dera', description: 'Traditional hillside views in Kyoto.' },
    ],
    stay: [
      'Central business hotel near transit',
      'Capsule or compact city hotel',
      'Ryokan-style stay in Kyoto',
    ],
    food: [
      'Ramen, sushi, and convenience store snacks',
      'Street food near temples and markets',
      'Cafe breakfasts and local desserts',
    ],
    travel: [
      'Subway and rail passes',
      'Airport transfer by train or bus',
      'Short taxi rides for late nights',
    ],
    activities: [
      'Museum and shrine visits',
      'Night city walks',
      'Shopping streets and anime districts',
    ],
    packing: [
      'Comfortable walking shoes',
      'Portable charger',
      'Travel adapter',
      'Light jacket for evenings',
      'Small day backpack',
      'Local cash and transit card',
    ],
  },
  {
    key: 'bali',
    matchWords: ['bali', 'ubud', 'seminyak', 'kuta', 'indonesia'],
    label: 'Tropical Escape',
    publicIds: [
      { publicId: 'cld-sample-5', label: 'Tropical Coast' },
      { publicId: 'cld-sample-4', label: 'Ocean Breeze' },
      { publicId: 'cld-sample-6', label: 'Island Greenery' },
    ],
    explore: [
      { name: 'Ubud Rice Terraces', description: 'Green terraces, walks, and a slower island pace.' },
      { name: 'Tanah Lot', description: 'A dramatic temple by the sea for sunset visits.' },
      { name: 'Seminyak Beach', description: 'Beach clubs, sunsets, and relaxed evenings.' },
      { name: 'Waterfall day trip', description: 'Nature stops away from the main coast.' },
    ],
    stay: [
      'Pool villa or boutique resort',
      'Beachfront stay in Seminyak',
      'Ubud retreat surrounded by greenery',
    ],
    food: [
      'Nasi goreng, satay, and smoothie bowls',
      'Beachfront seafood and fruit bowls',
      'Cafe brunch and local warungs',
    ],
    travel: [
      'Scooter rental or private driver',
      'Airport transfer and inter-town cab',
      'Short ride-hailing trips for markets and beaches',
    ],
    activities: [
      'Surfing or beach lounging',
      'Temple and waterfall visits',
      'Spa and sunset dinners',
    ],
    packing: [
      'Light cotton outfits',
      'Sunscreen and hat',
      'Swimwear',
      'Flip flops',
      'Mosquito repellent',
      'Waterproof pouch',
    ],
  },
  {
    key: 'europe',
    matchWords: ['europe', 'paris', 'amsterdam', 'prague', 'vienna', 'barcelona', 'rome'],
    label: 'City Hopper',
    publicIds: [
      { publicId: 'cld-sample-3', label: 'Historic City' },
      { publicId: 'cld-sample-2', label: 'Old Town' },
      { publicId: 'cld-sample-1', label: 'Scenic Stop' },
    ],
    explore: [
      { name: 'Historic Old Town', description: 'Walkable squares, landmarks, and classic architecture.' },
      { name: 'Museum quarter', description: 'Art, history, and exhibition stops in the city centre.' },
      { name: 'Riverfront promenade', description: 'Evening walks and photo spots.' },
      { name: 'Day trip villages', description: 'Nearby scenic towns for a slower pace.' },
    ],
    stay: [
      'Central hotel near transit',
      'Boutique apartment for longer stays',
      'Historic district guesthouse',
    ],
    food: [
      'Local bistros and bakery breakfasts',
      'Budget lunch spots and cafes',
      'Regional desserts and market snacks',
    ],
    travel: [
      'Metro passes and regional trains',
      'Airport transfers in advance',
      'Walking-friendly city zones',
    ],
    activities: [
      'Walking tours',
      'Museum visits',
      'Day trips to nearby towns',
    ],
    packing: [
      'Comfortable shoes for walking',
      'Travel adapter',
      'Layered outfits',
      'Power bank',
      'Copies of documents',
      'Light rain jacket',
    ],
  },
  {
    key: 'generic',
    matchWords: [],
    label: 'Travel Ready',
    publicIds: [
      { publicId: 'cld-sample-3', label: 'City View' },
      { publicId: 'cld-sample-4', label: 'Scenic View' },
      { publicId: 'cld-sample-5', label: 'Tropical View' },
    ],
    explore: [
      { name: 'Signature lookout', description: 'A scenic point that captures the destination’s skyline or landscape.' },
      { name: 'Local market district', description: 'Food, souvenirs, and neighborhood energy.' },
      { name: 'Cultural landmark', description: 'Temple, fort, or historic center worth a visit.' },
      { name: 'Evening walk area', description: 'A relaxed place for sunset and dinner.' },
    ],
    stay: [
      'Well-rated hotel near the center',
      'Homestay for a more local feel',
      'Stay close to the main attractions',
    ],
    food: [
      'Local specialties and breakfast cafes',
      'Street food and market snacks',
      'Simple dinner spots near the stay',
    ],
    travel: [
      'Use cabs or public transit for longer hops',
      'Walk the central sightseeing zone',
      'Keep airport transfer pre-booked',
    ],
    activities: [
      'City sightseeing',
      'Market browsing',
      'Photography and sunset stops',
    ],
    packing: [
      'Travel documents and ID',
      'Phone charger and power bank',
      'Basic medicines',
      'Reusable water bottle',
      'Comfortable shoes',
      'Weather-appropriate clothing',
    ],
  },
];

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreProfile(profile, text) {
  if (!text) return profile.key === 'generic' ? 0 : -1;
  if (profile.key === 'generic') return 0;

  return profile.matchWords.reduce((score, word) => {
    if (text.includes(word)) {
      return score + (word.length >= 6 ? 2 : 1);
    }
    return score;
  }, 0);
}

export function getTravelProfile(placeText = '') {
  const text = normalizeText(placeText);
  const ranked = PLACE_PROFILES
    .map(profile => ({ profile, score: scoreProfile(profile, text) }))
    .sort((a, b) => b.score - a.score);

  return ranked[0]?.profile || PLACE_PROFILES[PLACE_PROFILES.length - 1];
}

export function getSuggestedCovers(placeText = '') {
  const profile = getTravelProfile(placeText);
  return profile.publicIds;
}

export function getPackingSuggestions(placeText = '') {
  const profile = getTravelProfile(placeText);
  const essentials = [
    'Travel documents and ID',
    'Phone charger and power bank',
    'Basic medicines',
  ];

  return {
    label: profile.label,
    essentials,
    specific: profile.packing,
  };
}

function getDayCount(trip) {
  if (!trip?.startDate || !trip?.endDate) return 1;

  const start = new Date(`${trip.startDate}T00:00:00`);
  const end = new Date(`${trip.endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;

  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diff);
}

export function getExploreSuggestions(placeText = '') {
  const profile = getTravelProfile(placeText);

  return {
    label: profile.label,
    intro: `Explore the best local experiences in ${profile.label.toLowerCase()}.`,
    spots: profile.explore,
    highlights: profile.activities,
    publicIds: profile.publicIds,
  };
}

export function getBudgetSuggestions(tripOrText = '') {
  const trip = typeof tripOrText === 'object' && tripOrText !== null ? tripOrText : null;
  const placeText = trip ? `${trip.name || ''} ${trip.destinations?.join(' ') || ''}` : tripOrText;
  const profile = getTravelProfile(placeText);
  const totalBudget = Number(trip?.budget) > 0 ? Number(trip.budget) : 60000;
  const days = getDayCount(trip);
  const perDay = Math.max(0, Math.round(totalBudget / days));
  const style = String(trip?.style || '').toLowerCase();

  const allocation = (() => {
    if (style === 'luxury') {
      return { stay: 0.45, food: 0.2, travel: 0.15, activities: 0.15, reserve: 0.05 };
    }
    if (style === 'backpacking') {
      return { stay: 0.3, food: 0.25, travel: 0.2, activities: 0.15, reserve: 0.1 };
    }
    if (style === 'adventure') {
      return { stay: 0.35, food: 0.2, travel: 0.2, activities: 0.2, reserve: 0.05 };
    }
    if (style === 'family') {
      return { stay: 0.4, food: 0.25, travel: 0.15, activities: 0.1, reserve: 0.1 };
    }

    return { stay: 0.4, food: 0.25, travel: 0.2, activities: 0.1, reserve: 0.05 };
  })();

  const stayAmount = Math.round(totalBudget * allocation.stay);
  const foodAmount = Math.round(totalBudget * allocation.food);
  const travelAmount = Math.round(totalBudget * allocation.travel);
  const activitiesAmount = Math.round(totalBudget * allocation.activities);
  const reserveAmount = Math.max(0, totalBudget - stayAmount - foodAmount - travelAmount - activitiesAmount);

  return {
    label: profile.label,
    totalBudget,
    days,
    perDay,
    style: style || 'general',
    stay: profile.stay,
    food: profile.food,
    travel: profile.travel,
    activities: profile.activities,
    breakdown: [
      { label: 'Stay', amount: stayAmount, note: profile.stay[0] },
      { label: 'Food', amount: foodAmount, note: profile.food[0] },
      { label: 'Travel', amount: travelAmount, note: profile.travel[0] },
      { label: 'Activities', amount: activitiesAmount, note: profile.activities[0] },
      { label: 'Reserve', amount: reserveAmount, note: 'Keep a buffer for last-minute spending' },
    ],
  };
}
