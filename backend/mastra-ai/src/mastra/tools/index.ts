import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface GeocodingResponse {
  results: {
    latitude: number;
    longitude: number;
    name: string;
  }[];
}
interface WeatherResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    weather_code: number;
  };
}

// Flight research tool
export const flightSearchTool = createTool({
  id: 'flight-search',
  description: 'Find flight options based on origin, destination, and dates',
  inputSchema: z.object({
    origin: z.string().describe('Origin city or airport code'),
    destination: z.string().describe('Destination city or airport code'),
    departureDate: z.string().describe('Departure date in YYYY-MM-DD format'),
    returnDate: z.string().optional().describe('Return date in YYYY-MM-DD format for round trips'),
    passengers: z.number().default(1).describe('Number of passengers'),
    maxPrice: z.number().optional().describe('Maximum price in USD'),
  }),
  outputSchema: z.object({
    flights: z.array(z.object({
      airline: z.string(),
      flightNumber: z.string(),
      departureTime: z.string(),
      arrivalTime: z.string(),
      duration: z.string(),
      price: z.number(),
      stopCount: z.number(),
      origin: z.string(),
      destination: z.string(),
    })),
    currency: z.string(),
    lowestPrice: z.number(),
  }),
  execute: async ({ context }) => {
    // Simulate flight search API call
    return await searchFlights(
      context.origin,
      context.destination,
      context.departureDate,
      context.returnDate,
      context.passengers,
      context.maxPrice
    );
  },
});

// Accommodation search tool
export const accommodationSearchTool = createTool({
  id: 'accommodation-search',
  description: 'Find accommodation options based on location and requirements',
  inputSchema: z.object({
    location: z.string().describe('City or area name'),
    checkIn: z.string().describe('Check-in date in YYYY-MM-DD format'),
    checkOut: z.string().describe('Check-out date in YYYY-MM-DD format'),
    guests: z.number().default(1).describe('Number of guests'),
    propertyType: z.enum(['hotel', 'apartment', 'hostel', 'resort', 'any']).default('any')
      .describe('Type of accommodation'),
    amenities: z.array(z.string()).optional().describe('Required amenities like wifi, pool, etc.'),
    maxPrice: z.number().optional().describe('Maximum price per night in USD'),
  }),
  outputSchema: z.object({
    accommodations: z.array(z.object({
      name: z.string(),
      type: z.string(),
      address: z.string(),
      price: z.number(),
      pricePerNight: z.number(),
      rating: z.number(),
      amenities: z.array(z.string()),
      description: z.string(),
      availability: z.boolean(),
    })),
    currency: z.string(),
    lowestPrice: z.number(),
  }),
  execute: async ({ context }) => {
    // Simulate accommodation search API call
    return await searchAccommodations(
      context.location,
      context.checkIn,
      context.checkOut,
      context.guests,
      context.propertyType,
      context.amenities,
      context.maxPrice
    );
  },
});

// Activities search tool
export const activitiesSearchTool = createTool({
  id: 'activities-search',
  description: 'Find activities, attractions, and experiences at a destination',
  inputSchema: z.object({
    location: z.string().describe('City or area name'),
    dates: z.array(z.string()).optional().describe('Dates in YYYY-MM-DD format'),
    interests: z.array(z.string()).optional().describe('Types of activities like museums, outdoors, food, etc.'),
    maxPrice: z.number().optional().describe('Maximum price per activity in USD'),
    familyFriendly: z.boolean().optional().describe('Only show family-friendly activities'),
  }),
  outputSchema: z.object({
    activities: z.array(z.object({
      name: z.string(),
      category: z.string(),
      description: z.string(),
      price: z.number().nullable(),
      duration: z.string(),
      location: z.string(),
      rating: z.number(),
      bestTimeToVisit: z.string().optional(),
      bookingRequired: z.boolean().optional(),
    })),
    currency: z.string(),
    recommendedItinerary: z.array(z.object({
      day: z.number(),
      activities: z.array(z.string()),
    })).optional(),
  }),
  execute: async ({ context }) => {
    // Simulate activities search API call
    return await searchActivities(
      context.location,
      context.dates,
      context.interests,
      context.maxPrice,
      context.familyFriendly
    );
  },
});

// Weather information tool (kept from original)
export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});

// Fake flight search API implementation
const searchFlights = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  passengers: number = 1,
  maxPrice?: number
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate realistic flight data
  const airlines = ['Delta', 'United', 'American', 'JetBlue', 'Southwest', 'British Airways', 'Lufthansa', 'Emirates'];
  const flightCount = Math.floor(Math.random() * 5) + 3; // Generate 3-7 flights
  const basePrice = (destination.length * 75) + (origin.length * 25); // Simple price algorithm
  const flights = [];
  
  for (let i = 0; i < flightCount; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const flightNumber = airline.substring(0, 2).toUpperCase() + Math.floor(Math.random() * 1000 + 100);
    const price = basePrice + (Math.random() * 200) - 100; // Vary price by +/- $100
    const stopCount = Math.floor(Math.random() * 3); // 0, 1, or 2 stops
    const durationHours = 3 + stopCount * 2 + Math.floor(Math.random() * 4); // 3-10 hours based on stops
    
    // Only include flights below max price if specified
    if (maxPrice && price > maxPrice) continue;
    
    flights.push({
      airline,
      flightNumber,
      departureTime: `${departureDate}T${String(8 + Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      arrivalTime: `${departureDate}T${String(8 + durationHours + Math.floor(Math.random() * 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      duration: `${durationHours}h ${Math.floor(Math.random() * 60)}m`,
      price: Math.round(price * 100) / 100,
      stopCount,
      origin,
      destination,
    });
  }
  
  // Sort by price
  flights.sort((a, b) => a.price - b.price);
  
  return {
    flights,
    currency: 'USD',
    lowestPrice: flights.length > 0 ? flights[0].price : 0,
  };
};

// Fake accommodation search API implementation
const searchAccommodations = async (
  location: string,
  checkIn: string,
  checkOut: string,
  guests: number = 1,
  propertyType: string = 'any',
  amenities?: string[],
  maxPrice?: number
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate realistic accommodation data
  const accommodationTypes = ['hotel', 'apartment', 'hostel', 'resort', 'villa'];
  const propertyNames = [
    `${location} Grand Hotel`, 
    `${location} Plaza`, 
    `${location} Suites`, 
    `Downtown ${location}`, 
    `${location} Resort & Spa`,
    `The ${location}`,
    `${location} View Apartments`,
    `Historic ${location} Inn`
  ];
  const possibleAmenities = [
    'wifi', 'pool', 'spa', 'gym', 'restaurant', 'room service', 'parking', 
    'air conditioning', 'kitchen', 'laundry', 'breakfast', 'pet friendly'
  ];
  
  const propertyCount = Math.floor(Math.random() * 6) + 4; // Generate 4-9 properties
  const accommodations = [];
  
  // Calculate total nights
  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i < propertyCount; i++) {
    // Generate type according to filter or random if 'any'
    const type = propertyType === 'any' ? 
      accommodationTypes[Math.floor(Math.random() * accommodationTypes.length)] : 
      propertyType;
    
    // Generate random amenity set
    const propertyAmenities = [];
    const amenityCount = Math.floor(Math.random() * 7) + 3; // 3-9 amenities
    for (let j = 0; j < amenityCount; j++) {
      const amenity = possibleAmenities[Math.floor(Math.random() * possibleAmenities.length)];
      if (!propertyAmenities.includes(amenity)) {
        propertyAmenities.push(amenity);
      }
    }
    
    // Skip if required amenities aren't available
    if (amenities && amenities.length > 0) {
      const hasMissingAmenities = amenities.some(a => !propertyAmenities.includes(a));
      if (hasMissingAmenities) continue;
    }
    
    // Generate price based on type and location
    let basePrice;
    switch (type) {
      case 'hotel': basePrice = 120; break;
      case 'apartment': basePrice = 100; break;
      case 'hostel': basePrice = 40; break;
      case 'resort': basePrice = 250; break;
      case 'villa': basePrice = 300; break;
      default: basePrice = 100;
    }
    
    // Adjust price by location length as a simple algorithm
    const pricePerNight = basePrice + (location.length * 5) + (Math.random() * 50) - 25;
    const totalPrice = pricePerNight * nights;
    
    // Skip if over max price
    if (maxPrice && pricePerNight > maxPrice) continue;
    
    accommodations.push({
      name: propertyNames[i % propertyNames.length],
      type,
      address: `${Math.floor(Math.random() * 200) + 1} ${location} Street, ${location}`,
      price: Math.round(totalPrice * 100) / 100,
      pricePerNight: Math.round(pricePerNight * 100) / 100,
      rating: Math.min(5, Math.max(2, 3 + (Math.random() * 2) - 0.5)), // Rating between 2.5-5
      amenities: propertyAmenities,
      description: `A beautiful ${type} located in the heart of ${location}, offering comfortable accommodations for up to ${guests + 2} guests.`,
      availability: Math.random() > 0.1, // 90% chance of availability
    });
  }
  
  // Sort by price
  accommodations.sort((a, b) => a.pricePerNight - b.pricePerNight);
  
  return {
    accommodations,
    currency: 'USD',
    lowestPrice: accommodations.length > 0 ? accommodations[0].pricePerNight : 0,
  };
};

// Fake activities search API implementation
const searchActivities = async (
  location: string,
  dates?: string[],
  interests?: string[],
  maxPrice?: number,
  familyFriendly?: boolean
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Activity categories
  const categories = [
    'museum', 'outdoor', 'tour', 'historic', 'food', 'shopping', 
    'entertainment', 'nightlife', 'sports', 'cultural'
  ];
  
  // Generate activity names based on location and categories
  const activityTemplates = [
    { name: `${location} Museum of Art`, category: 'museum', price: 15, duration: '2 hours', familyFriendly: true },
    { name: `${location} Natural History Museum`, category: 'museum', price: 18, duration: '3 hours', familyFriendly: true },
    { name: `${location} Zoo`, category: 'outdoor', price: 25, duration: '4 hours', familyFriendly: true },
    { name: `${location} Botanical Gardens`, category: 'outdoor', price: 10, duration: '2 hours', familyFriendly: true },
    { name: `Historic ${location} Walking Tour`, category: 'tour', price: 30, duration: '3 hours', familyFriendly: true },
    { name: `${location} Food Tour`, category: 'food', price: 65, duration: '4 hours', familyFriendly: true },
    { name: `${location} Castle`, category: 'historic', price: 22, duration: '2 hours', familyFriendly: true },
    { name: `${location} Cathedral`, category: 'historic', price: 0, duration: '1 hour', familyFriendly: true },
    { name: `${location} Street Market`, category: 'shopping', price: 0, duration: '2 hours', familyFriendly: true },
    { name: `${location} Theater Show`, category: 'entertainment', price: 80, duration: '3 hours', familyFriendly: false },
    { name: `${location} Nightclub Experience`, category: 'nightlife', price: 40, duration: '4 hours', familyFriendly: false },
    { name: `${location} Pub Crawl`, category: 'nightlife', price: 50, duration: '4 hours', familyFriendly: false },
    { name: `${location} Sports Game`, category: 'sports', price: 65, duration: '3 hours', familyFriendly: true },
    { name: `${location} Cooking Class`, category: 'food', price: 70, duration: '3 hours', familyFriendly: true },
    { name: `${location} River Cruise`, category: 'tour', price: 45, duration: '2 hours', familyFriendly: true },
    { name: `${location} Cultural Festival`, category: 'cultural', price: 35, duration: '6 hours', familyFriendly: true },
    { name: `${location} Wildlife Sanctuary`, category: 'outdoor', price: 28, duration: '4 hours', familyFriendly: true },
    { name: `${location} Aquarium`, category: 'outdoor', price: 30, duration: '3 hours', familyFriendly: true },
  ];
  
  // Filter by family-friendly if required
  let filteredTemplates = [...activityTemplates];
  if (familyFriendly === true) {
    filteredTemplates = filteredTemplates.filter(a => a.familyFriendly);
  }
  
  // Filter by interests/categories
  if (interests && interests.length > 0) {
    filteredTemplates = filteredTemplates.filter(a => 
      interests.some(interest => a.category.includes(interest) || interest.includes(a.category))
    );
  }
  
  // Filter by price
  if (maxPrice !== undefined) {
    filteredTemplates = filteredTemplates.filter(a => a.price <= maxPrice);
  }
  
  // Generate a randomized subset
  const shuffled = filteredTemplates.sort(() => 0.5 - Math.random());
  const activityCount = Math.min(shuffled.length, Math.floor(Math.random() * 8) + 5); // 5-12 activities
  
  const activities = shuffled.slice(0, activityCount).map(template => {
    // Randomize data slightly
    const rating = Math.min(5, Math.max(3, 4 + (Math.random() * 1.5) - 0.8)); // Rating between 3.2-5
    const price = template.price === 0 ? null : Math.round(template.price * (0.9 + Math.random() * 0.3) * 100) / 100;
    
    return {
      name: template.name,
      category: template.category,
      description: `Experience the wonders of ${template.name}, one of ${location}'s top attractions.`,
      price,
      duration: template.duration,
      location: `${location}, City Center`,
      rating,
      bestTimeToVisit: ['Morning', 'Afternoon', 'Evening'][Math.floor(Math.random() * 3)],
      bookingRequired: Math.random() > 0.4, // 60% chance of requiring booking
    };
  });
  
  // Generate recommended itinerary if we have dates
  let recommendedItinerary;
  if (dates && dates.length > 0) {
    recommendedItinerary = [];
    const dayCount = dates.length;
    const activitiesPerDay = Math.min(3, Math.ceil(activities.length / dayCount));
    
    for (let i = 0; i < dayCount; i++) {
      const startIdx = i * activitiesPerDay;
      const endIdx = Math.min(startIdx + activitiesPerDay, activities.length);
      const dayActivities = activities.slice(startIdx, endIdx);
      
      if (dayActivities.length > 0) {
        recommendedItinerary.push({
          day: i + 1,
          activities: dayActivities.map(a => a.name),
        });
      }
    }
  }
  
  return {
    activities,
    currency: 'USD',
    recommendedItinerary,
  };
};

// Weather API implementation (kept from original)
const getWeather = async (location: string) => {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
  const geocodingResponse = await fetch(geocodingUrl);
  const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

  if (!geocodingData.results?.[0]) {
    throw new Error(`Location '${location}' not found`);
  }

  const { latitude, longitude, name } = geocodingData.results[0];

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;

  const response = await fetch(weatherUrl);
  const data = (await response.json()) as WeatherResponse;

  return {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windGust: data.current.wind_gusts_10m,
    conditions: getWeatherCondition(data.current.weather_code),
    location: name,
  };
};

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return conditions[code] || 'Unknown';
}
