// lib/types/city.ts

export interface WeatherData {
    tempC: number;
    minTempC: number;
    maxTempC: number;
    description: string;
    iconURL: string;
    isLoading?: boolean;
    error?: boolean;
}

export interface CityMetric {
    label: string;
    value: number | string;
    unit?: string;
    icon: React.ElementType | string; // Can be Lucide icon component or string from DB
    barColor?: string;
}

export interface NomadListStyleTag {
    label: string;
    color: string;
}

export interface CityData {
    _id: string; // MongoDB _id
    id: string; // Internal ID, often same as slug
    cityName: string;
    slug: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
    heroImage?: string;
    monthlyEstimateEUR: number;
    currencySymbol?: string;
    overallScore: number;
    safetyScore: number;
    studentFriendliness: number;
    universityNames: string[];
    metrics: CityMetric[];
    nomadListStyleTags?: NomadListStyleTag[];
    internetSpeedMbps?: number;
    dataSourceNotes?: string;
    cityDescription?: string;
    housingLink?: string;
    createdAt: Date; // From timestamps
    updatedAt: Date; // From timestamps

    // These fields are populated dynamically on the client
    annualMinTempC: number;
    annualMaxTempC: number;
    currentWeather: WeatherData;
}