// src/components/cost-of-living/StudentCityCostInsights.tsx
'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    MapPin, Home, Utensils, Train, Bolt, Wifi, Shield, TrendingUp, DollarSign, GraduationCap,
    ExternalLink, ChevronDown, ChevronUp, AlertCircle, Sparkles, Filter, ArrowDownUp, Search,
    LayoutGrid, Map as MapIcon, X, Thermometer, Navigation, Loader2
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import { mockItalianStudentCityData as rawMockItalianStudentCityData } from '@/lib/data'; // REMOVE THIS IMPORT
import { CityData, WeatherData, CityMetric, NomadListStyleTag } from '@/lib/types/city'; // Import updated types

// Map string icon names to Lucide icon components (needs to be consistent with DB strings)
const iconMap: Record<string, React.ElementType> = {
    Home, Utensils, Train, Bolt, Wifi, DollarSign, GraduationCap, Shield, TrendingUp, Thermometer, Navigation,
};

// Fix for default Leaflet marker icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Constants for progress bar calculations
const MAX_RENT_SHARED_EUR = 700;
const MAX_GROCERIES_EUR = 450;
const MAX_TRANSPORT_PASS_EUR = 60;
const INITIAL_CARDS_TO_SHOW = 6;
const CARDS_TO_LOAD_ON_SCROLL = 3;

// Helper to initialize city data with placeholder weather and annual temps
const initializeCityDataWithPlaceholders = (baseData: CityData[]): CityData[] => {
    return baseData.map(city => ({
        ...city,
        // Assign illustrative annual temps (these are not from an API, so still hardcoded/derived)
        annualMinTempC: city.annualMinTempC || 0, // Ensure these are populated, either from DB or default
        annualMaxTempC: city.annualMaxTempC || 30, // Ensure these are populated
        currentWeather: { isLoading: true, iconURL: '', tempC: 0, minTempC: 0, maxTempC: 0, description: '' } as WeatherData,
        // Convert icon strings to Lucide components here once fetched
        metrics: city.metrics.map(metric => ({
            ...metric,
            icon: iconMap[metric.icon as string] || metric.icon, // Map string to component
        })) as CityMetric[]
    }));
};

const getScoreColorClass = (score: number): string => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    return 'bg-red-500';
};

const ScoreDisplay: React.FC<{ score: number; Icon: React.ElementType; label: string; colorClass: string }> = ({ score, Icon, label, colorClass }) => (
    <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full border-4 ${colorClass} flex items-center justify-center mb-1`}>
            <span className="text-xl font-bold text-[var(--text-primary)]">{score.toFixed(1)}</span>
        </div>
        <div className="flex items-center text-xs text-[var(--text-secondary)]">
            <Icon size={12} className="mr-1" /> {label}
        </div>
    </div>
);

const WeatherDisplay: React.FC<{ weather?: WeatherData, annualMin: number, annualMax: number }> = ({ weather, annualMin, annualMax }) => {
    let dailyWeatherContent;
    if (weather?.isLoading) {
        dailyWeatherContent = (
            <div className="flex items-center justify-center text-[var(--text-secondary)] text-xs col-span-2">
                <Loader2 size={16} className="animate-spin mr-2 text-[var(--primary)]" />
                <span>Loading daily...</span>
            </div>
        );
    } else if (weather?.error || !weather || !weather.iconURL) {
        dailyWeatherContent = (
            <div className="flex items-center justify-center text-red-500 text-xs col-span-2">
                <AlertCircle size={14} className="mr-1" />
                <span>Daily N/A</span>
            </div>
        );
    } else {
        dailyWeatherContent = (
            <>
                <div className="flex items-center">
                    <img src={weather.iconURL} alt={weather.description} className="w-8 h-8 mr-2" />
                    <div>
                        <p className="text-lg font-semibold text-[var(--text-primary)]">{weather.tempC.toFixed(0)}°C</p>
                        <p className="text-xs capitalize -mt-1">{weather.description}</p>
                    </div>
                </div>
                <div className="text-right text-xs">
                    <p>Min: {weather.minTempC.toFixed(0)}°C</p>
                    <p>Max: {weather.maxTempC.toFixed(0)}°C</p>
                </div>
            </>
        );
    }

    return (
        <div className="mt-1 mb-4 p-3 bg-slate-50 rounded-lg shadow text-[var(--text-secondary)]">
            <div className="grid grid-cols-2 gap-2 items-center">
                {dailyWeatherContent}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-200 text-center text-xs">
                <Thermometer size={12} className="inline mr-1 text-[var(--primary)]" />
                Annual Range: {annualMin}°C to {annualMax}°C (Illustrative)
            </div>
        </div>
    );
};


const CityCard: React.FC<{ city: CityData; isModal?: boolean }> = ({ city, isModal = false }) => {
    const [isExpanded, setIsExpanded] = useState(isModal);
    const router = useRouter();
    const { locale: language } = useRouter() as any;

    const calculateBarPercentage = (value: number, category: string) => {
        let maxVal = 1;
        if (category === 'Shared Room Rent') maxVal = MAX_RENT_SHARED_EUR;
        else if (category === 'Groceries') maxVal = MAX_GROCERIES_EUR;
        else if (category === 'Transport Pass') maxVal = MAX_TRANSPORT_PASS_EUR;
        else return 0;

        const percentage = (value / maxVal) * 100;
        return Math.min(Math.max(percentage, 0), 100);
    };

    const handleViewDetailsClick = () => {
        router.push(`/${language}/city/${city.slug}`);
    };

    return (
        <div className={`bg-white rounded-xl ${isModal ? '' : 'shadow-lg hover:shadow-xl'} text-[var(--text-primary)] overflow-hidden transition-all duration-300 ease-in-out`}>
            {!isModal && (
                <div className="relative">
                    <img src={city.heroImage || `https://placehold.co/800x400/E2E8F0/4A5568?text=${city.cityName.replace(/\s/g, "+")}`}
                        alt={`View of ${city.cityName}`}
                        className="w-full h-48 object-cover"
                        onError={(e) => (e.currentTarget.src = `https://placehold.co/800x400/E2E8F0/4A5568?text=${city.cityName.replace(/\s/g, "+")}+Image+Not+Found`)}
                    />
                    <div className="absolute top-0 left-0 bg-gradient-to-r from-black/70 to-transparent p-4">
                        <h2 className="text-2xl font-bold text-white">{city.cityName}</h2>
                        <p className="text-sm text-gray-200 flex items-center"><MapPin size={14} className="mr-1" />{city.region}, {city.country}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-[var(--primary)] text-white text-xs px-2 py-1 rounded-full shadow-lg">
                        Est. {city.currencySymbol || '€'}{city.monthlyEstimateEUR.toLocaleString()}/mo
                    </div>
                </div>
            )}

            <div className={`p-5 ${isModal ? 'max-h-[calc(100vh-150px)] overflow-y-auto custom-scrollbar' : ''}`}>
                {isModal && (
                    <div className="mb-4">
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">{city.cityName}</h2>
                        <p className="text-md text-[var(--text-secondary)] flex items-center"><MapPin size={16} className="mr-1" />{city.region}, {city.country}</p>
                        <p className="text-lg font-semibold text-[var(--primary)] mt-1">Est. {city.currencySymbol || '€'}{city.monthlyEstimateEUR.toLocaleString()}/mo</p>
                    </div>
                )}
                <WeatherDisplay weather={city.currentWeather} annualMin={city.annualMinTempC} annualMax={city.annualMaxTempC} />

                <div className="flex justify-around items-center mb-4 pb-4 border-b border-gray-200">
                    <ScoreDisplay score={city.overallScore} Icon={TrendingUp} label="Affordability" colorClass="border-[var(--primary)]" />
                    <ScoreDisplay score={city.safetyScore} Icon={Shield} label="Safety" colorClass="border-green-500" />
                    <ScoreDisplay score={city.studentFriendliness} Icon={Sparkles} label="Vibe" colorClass="border-[var(--accent)]" />
                </div>

                <div className="mb-3">
                    <h4 className="font-semibold text-[var(--text-primary)] mb-1 flex items-center">
                        <GraduationCap size={18} className="mr-2 text-[var(--primary)]" /> Key Universities:
                    </h4>
                    <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] pl-2">
                        {city.universityNames.map(uni => <li key={uni}>{uni}</li>)}
                    </ul>
                </div>

                {city.nomadListStyleTags && city.nomadListStyleTags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {city.nomadListStyleTags.map(tag => (
                            <span key={tag.label} className={`text-xs text-white px-2.5 py-1 rounded-full ${tag.color}`}>
                                {tag.label}
                            </span>
                        ))}
                    </div>
                )}

                {!isModal && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] font-semibold py-2 px-3 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center mb-3"
                    >
                        {isExpanded ? 'Show Less' : 'Cost Breakdown'}
                        {isExpanded ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
                    </button>
                )}


                {isExpanded && (
                    <div className="space-y-3 mt-3 animate-fadeIn">
                        {city.metrics.map(metric => {
                            const barPercentage = (metric.label === 'Shared Room Rent' || metric.label === 'Groceries' || metric.label === 'Transport Pass')
                                ? calculateBarPercentage(Number(metric.value), metric.label)
                                : undefined;

                            const IconComponent = metric.icon as React.ElementType; // Now it's already a component

                            return (
                                <div key={metric.label}>
                                    <div className="flex items-center justify-between text-sm mb-0.5">
                                        <div className="flex items-center text-[var(--text-secondary)]">
                                            <IconComponent size={16} className="mr-2 text-gray-400" />
                                            {metric.label}
                                        </div>
                                        <span className="font-semibold text-[var(--text-primary)]">
                                            {metric.value.toLocaleString()} {metric.unit}
                                        </span>
                                    </div>
                                    {barPercentage !== undefined && (
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`${metric.barColor || 'bg-[var(--primary)]'} h-1.5 rounded-full`}
                                                style={{ width: `${barPercentage}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {city.internetSpeedMbps && (
                            <div className="flex items-center justify-between text-sm mt-2">
                                <div className="flex items-center text-[var(--text-secondary)]">
                                    <Wifi size={16} className="mr-2 text-gray-400" />
                                    Avg. Internet
                                </div>
                                <span className="font-semibold text-[var(--text-primary)]">{city.internetSpeedMbps} Mbps</span>
                            </div>
                        )}
                        {city.dataSourceNotes && (
                            <p className="text-xs text-gray-500 mt-4 pt-2 border-t border-gray-200 flex items-start">
                                <AlertCircle size={20} className="mr-1.5 flex-shrink-0 text-gray-400" />
                                {city.dataSourceNotes}
                            </p>
                        )}
                    </div>
                )}
                <a
                    href={`https://www.google.com/search?q=student+cost+of+living+${city.cityName}+${city.country}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-4 block w-full text-center text-sm"
                >
                    Explore {city.cityName} Further <ExternalLink size={14} className="inline ml-1" />
                </a>

                {/* New: Link to City's Dedicated Page */}
                {!isModal && (
                    <button
                        onClick={handleViewDetailsClick}
                        className="btn btn-secondary mt-2 block w-full text-center text-sm"
                    >
                        View Full City Details <ChevronDown size={14} className="inline ml-1 rotate-[-90deg]" />
                    </button>
                )}
            </div>
        </div>
    );
};

const MapView: React.FC<{ cities: CityData[]; onMarkerClick: (city: CityData) => void }> = ({ cities, onMarkerClick }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const [currentZoom, setCurrentZoom] = useState<number>(6);
    const isInitialMountRef = useRef(true);
    const prevCitiesRef = useRef<CityData[]>();

    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            const map = L.map(mapContainerRef.current, {
                scrollWheelZoom: true,
            }).setView([41.8719, 12.5674], 6);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            setCurrentZoom(map.getZoom());
            map.on('zoomend', () => {
                if (mapRef.current) {
                    setCurrentZoom(mapRef.current.getZoom());
                }
            });
            mapRef.current = map;
        }
    }, []);


    useEffect(() => {
        if (mapRef.current) {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            cities.forEach(city => {
                let divIconHTMLContent = '';
                let iconClassName = 'custom-map-marker-base ';
                let iconSize: L.PointExpression;
                let iconAnchor: L.PointExpression;
                let scoreColorStyle = '';

                if (currentZoom < 6) {
                    iconClassName += `map-marker-dot`;
                    const colorName = getScoreColorClass(city.overallScore).replace('bg-', '').replace('-500', '');
                    const actualColor = colorName === 'green' ? '#22c55e' : colorName === 'yellow' ? '#eab308' : '#ef4444';
                    scoreColorStyle = `background-color: ${actualColor};`;
                    iconSize = L.point(16, 16);
                    iconAnchor = L.point(8, 8);
                } else if (currentZoom < 8) {
                    iconClassName += 'map-marker-city-name';
                    divIconHTMLContent = `<strong>${city.cityName}</strong>`;
                    iconSize = L.point(90, 30);
                    iconAnchor = L.point(45, 15);
                } else if (currentZoom < 10) {
                    iconClassName += 'map-marker-city-cost';
                    divIconHTMLContent = `<strong>${city.cityName}</strong><p>${city.currencySymbol || '€'}${city.monthlyEstimateEUR.toLocaleString()}</p>`;
                    iconSize = L.point(120, 40);
                    iconAnchor = L.point(60, 20);
                } else {
                    iconClassName += 'map-marker-full-detail';
                    divIconHTMLContent = `
                        <strong class="custom-map-marker-title">${city.cityName}</strong>
                        <p class="custom-map-marker-info">${city.currencySymbol || '€'}${city.monthlyEstimateEUR.toLocaleString()} | Score: ${city.overallScore.toFixed(1)}</p>
                    `;
                    iconSize = L.point(140, 44);
                    iconAnchor = L.point(70, 22);
                }

                const fullDivIconHTML = `<div class="${iconClassName}" style="${scoreColorStyle}">${divIconHTMLContent}</div>`;

                const customIcon = L.divIcon({
                    html: fullDivIconHTML,
                    className: '',
                    iconSize: iconSize,
                    iconAnchor: iconAnchor
                });

                const marker = L.marker([city.latitude, city.longitude], { icon: customIcon })
                    .addTo(mapRef.current!);

                marker.on('click', () => {
                    onMarkerClick(city);
                });
                markersRef.current.push(marker);
            });

            const citiesHaveChanged = JSON.stringify(prevCitiesRef.current) !== JSON.stringify(cities);

            if (cities.length > 0 && (isInitialMountRef.current || citiesHaveChanged)) {
                setTimeout(() => {
                    if (mapRef.current) {
                        mapRef.current.invalidateSize();
                        const latitudes = cities.map(c => c.latitude);
                        const longitudes = cities.map(c => c.longitude);
                        mapRef.current.fitBounds([
                            [Math.min(...latitudes), Math.min(...longitudes)],
                            [Math.max(...latitudes), Math.max(...longitudes)]
                        ], { padding: [50, 50], maxZoom: 14 });
                    }
                }, 100);
                if (isInitialMountRef.current) isInitialMountRef.current = false;

            } else if (cities.length === 0 && mapRef.current) {
                mapRef.current.setView([41.8719, 12.5674], 6);
            }

            prevCitiesRef.current = cities;
            if (!citiesHaveChanged && mapRef.current) {
                setTimeout(() => mapRef.current?.invalidateSize(), 100);
            }
        }
    }, [cities, currentZoom, onMarkerClick]);

    return <div ref={mapContainerRef} className="h-[600px] w-full rounded-xl shadow-lg z-0 bg-gray-200" />;
};


const StudentCityCostInsights: React.FC = () => {
    const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const [citiesWithWeatherData, setCitiesWithWeatherData] = useState<CityData[]>([]); // Initialize empty, will fetch from API
    const [isLoadingCities, setIsLoadingCities] = useState(true); // New loading state for cities data itself
    const [fetchCitiesError, setFetchCitiesError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof CityData | null; direction: 'asc' | 'desc' }>({ key: 'overallScore', direction: 'desc' });
    const [maxCost, setMaxCost] = useState<number>(2000);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [selectedCityForModal, setSelectedCityForModal] = useState<CityData | null>(null);

    // Lazy loading states
    const [displayedCardsCount, setDisplayedCardsCount] = useState(INITIAL_CARDS_TO_SHOW);
    const [isLoadingMoreCards, setIsLoadingMoreCards] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(loadMoreRef.current); // Initialize with ref.current
    const { locale: language } = useRouter() as any;

    // --- New useEffect to fetch cities from API ---
    useEffect(() => {
        const fetchCitiesFromAPI = async () => {
            setIsLoadingCities(true);
            setFetchCitiesError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/cities`); // Fetch from your new API
                if (!response.ok) {
                    throw new Error(`Failed to fetch cities: ${response.statusText}`);
                }
                const result = await response.json();
                if (!result.success || !Array.isArray(result.data)) {
                    throw new Error(result.message || 'Invalid data format from cities API');
                }

                // Process fetched data: convert dates and map icons
                const processedCities: CityData[] = result.data.map((city: any) => ({
                    ...city,
                    createdAt: new Date(city.createdAt),
                    updatedAt: new Date(city.updatedAt),
                    // Initialize weather placeholder and annual temps as before
                    annualMinTempC: city.annualMinTempC || 0, // Ensure these come from DB or have default
                    annualMaxTempC: city.annualMaxTempC || 30, // Ensure these come from DB or have default
                    currentWeather: { isLoading: true, iconURL: '', tempC: 0, minTempC: 0, maxTempC: 0, description: '' } as WeatherData,
                    // Map icon strings to Lucide components
                    metrics: city.metrics.map((metric: any) => ({
                        ...metric,
                        icon: iconMap[metric.icon as string] || Home, // Fallback to Home if icon string not found
                    })),
                }));

                setCitiesWithWeatherData(processedCities);
            } catch (err: any) {
                console.error("Error fetching cities from API:", err);
                setFetchCitiesError(err.message || 'Failed to load cities data.');
            } finally {
                setIsLoadingCities(false);
            }
        };

        fetchCitiesFromAPI();
    }, [API_BASE_URL]); // Rerun when API_BASE_URL changes

    // --- Weather fetching logic (now triggered after cities are loaded) ---
    useEffect(() => {
        if (!API_KEY) {
            console.warn("WeatherAPI.com API key is not set. Weather data will not be fetched.");
            setCitiesWithWeatherData(prevCities => prevCities.map(city => ({
                ...city,
                currentWeather: { ...city.currentWeather, isLoading: false, error: true, iconURL: '' }
            })));
            return;
        }

        if (citiesWithWeatherData.length === 0 && !isLoadingCities) { // Only try to fetch weather if cities are loaded AND there are cities
            return;
        }

        const fetchWeatherForAllCities = async () => {
            // Do not re-initialize citiesWithWeatherData, just update their weather
            const weatherPromises = citiesWithWeatherData.map(async (city) => {
                // Skip fetching if weather is already fetched or if there's an error and not loading
                if (!city.currentWeather.isLoading && !city.currentWeather.error && city.currentWeather.iconURL) {
                    return city; // Already has valid weather data
                }

                // Set loading state for this specific city
                setCitiesWithWeatherData(prev => prev.map(c => c.id === city.id ? { ...c, currentWeather: { ...c.currentWeather, isLoading: true, error: false } } : c));

                try {
                    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city.latitude},${city.longitude}&days=1&aqi=no&alerts=no`);
                    if (!response.ok) {
                        throw new Error(`WeatherAPI request failed for ${city.cityName} with status ${response.status}`);
                    }
                    const data = await response.json();

                    if (!data.current || !data.forecast || !data.forecast.forecastday[0]) {
                        throw new Error(`Incomplete weather data for ${city.cityName}`);
                    }

                    return {
                        ...city,
                        currentWeather: {
                            tempC: data.current.temp_c,
                            minTempC: data.forecast.forecastday[0].day.mintemp_c,
                            maxTempC: data.forecast.forecastday[0].day.maxtemp_c,
                            description: data.current.condition.text,
                            iconURL: data.current.condition.icon,
                            isLoading: false,
                            error: false,
                        }
                    };
                } catch (error) {
                    console.error(`Failed to fetch weather for ${city.cityName}:`, error);
                    return {
                        ...city,
                        currentWeather: { isLoading: false, error: true, iconURL: '', tempC: 0, minTempC: 0, maxTempC: 0, description: '' } as WeatherData
                    };
                }
            });

            const updatedCities = await Promise.all(weatherPromises);
            setCitiesWithWeatherData(updatedCities);
        };

        if (!isLoadingCities && citiesWithWeatherData.length > 0) { // Only fetch weather if cities are loaded from API
            fetchWeatherForAllCities();
        }
    }, [API_KEY, citiesWithWeatherData, isLoadingCities]);


    const maxPossibleCost = useMemo(() => Math.max(...citiesWithWeatherData.map(c => c.monthlyEstimateEUR), 2000), [citiesWithWeatherData]);

    const filteredAndSortedCities = useMemo(() => {
        let cities = [...citiesWithWeatherData];
        if (searchTerm) {
            cities = cities.filter(city =>
                city.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                city.universityNames.some(uni => uni.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        cities = cities.filter(city => city.monthlyEstimateEUR <= maxCost);
        if (sortConfig.key) {
            cities.sort((a, b) => {
                const valA = a[sortConfig.key!];
                const valB = b[sortConfig.key!];
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return sortConfig.direction === 'asc' ? valA - valB : valB - valA;
                }
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                }
                return 0;
            });
        }
        return cities;
    }, [citiesWithWeatherData, searchTerm, maxCost, sortConfig]);

    const getSortIndicator = (key: keyof CityData) => {
        if (sortConfig.key === key) { return sortConfig.direction === 'asc' ? '▲' : '▼'; }
        return '';
    };

    const handleOpenModal = useCallback((city: CityData) => {
        setSelectedCityForModal(city);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedCityForModal(null);
    }, []);

    // Lazy loading logic
    const loadMoreCards = useCallback(() => {
        if (isLoadingMoreCards || displayedCardsCount >= filteredAndSortedCities.length) return;

        setIsLoadingMoreCards(true);
        setTimeout(() => {
            setDisplayedCardsCount(prevCount => Math.min(prevCount + CARDS_TO_LOAD_ON_SCROLL, filteredAndSortedCities.length));
            setIsLoadingMoreCards(false);
        }, 500); // Simulate network delay
    }, [isLoadingMoreCards, displayedCardsCount, filteredAndSortedCities.length]);

    useEffect(() => {
        if (viewMode !== 'grid' || !loadMoreRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreCards();
                }
            },
            { threshold: 1.0 }
        );

        const currentLoadMoreRef = loadMoreRef.current;
        if (currentLoadMoreRef) {
            observerRef.current.observe(currentLoadMoreRef);
        }

        return () => {
            if (currentLoadMoreRef && observerRef.current) {
                observerRef.current.unobserve(currentLoadMoreRef);
            }
        };
    }, [loadMoreCards, viewMode]);

    // Reset displayedCardsCount when filters change
    useEffect(() => {
        setDisplayedCardsCount(INITIAL_CARDS_TO_SHOW);
    }, [searchTerm, maxCost, sortConfig]);


    return (
        <div className="bg-[var(--background)] min-h-screen p-4 sm:p-6 md:p-8 text-[var(--text-secondary)]">
            <style jsx global>{`
                body {
                    background-color: var(--background);
                    font-family: 'Source Sans Pro', sans-serif;
                    color: var(--text-secondary);
                }
                h1, h2, h3, h4, h5, h6 {
                    font-family: 'Poppins', sans-serif;
                    color: var(--text-primary);
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-map-marker-base {
                    cursor: pointer;
                    transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
                    font-family: 'Source Sans Pro', sans-serif;
                    text-align: center;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    box-sizing: border-box;
                    border: 1px solid rgba(0,0,0,0.1);
                }
                .custom-map-marker-base:hover {
                    transform: scale(1.1);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                    z-index: 10000 !important;
                }

                .map-marker-dot { /* ... styles ... */ }
                .map-marker-city-name { /* ... styles ... */ }
                .map-marker-city-cost { /* ... styles ... */ }
                .map-marker-full-detail { /* ... styles ... */ }

                .leaflet-popup-content-wrapper { background-color: white; color: var(--text-secondary); border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
                .leaflet-popup-content { margin: 12px; font-family: 'Source Sans Pro', sans-serif; }
                .leaflet-popup-content h3 { color: var(--text-primary); font-family: 'Poppins', sans-serif; }
                .leaflet-popup-content p strong { color: var(--text-primary); }
                .leaflet-popup-content a { color: var(--primary); }
                .leaflet-popup-tip { background-color: white; }
                .leaflet-container a.leaflet-popup-close-button { color: var(--text-secondary); }
                .leaflet-container a.leaflet-popup-close-button:hover { color: var(--text-primary); }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; } /* bg-slate-100 */
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: var(--primary); border-radius: 4px; }
                .custom-scrollbar { scrollbar-width: thin; scrollbar-color: var(--primary) #f1f5f9; }

            `}</style>
            <div className="container mx-auto max-w-7xl">
                <header className="text-center mb-10 md:mb-12 pt-8">
                    <GraduationCap className="mx-auto h-16 w-16 text-[var(--primary)] mb-4" />
                    <h1>
                        Italian University City Cost Explorer
                    </h1>
                    <p className="mt-4 max-w-3xl mx-auto">
                        Discover affordability, safety, and student vibe in key Italian university cities.
                    </p>
                </header>

                <div className="mb-8 p-4 sm:p-6 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-end">
                        <div className="lg:col-span-1">
                            <label htmlFor="search" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                <Search size={14} className="inline mr-1" /> Search
                            </label>
                            <input
                                type="text" id="search" placeholder="e.g., Rome or Sapienza"
                                className="p-2.5 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <label htmlFor="costRange" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                <Filter size={14} className="inline mr-1" /> Max Cost: €{maxCost.toLocaleString()}
                            </label>
                            <input
                                type="range" id="costRange" min="500" max={maxPossibleCost} step="50" value={maxCost}
                                onChange={(e) => setMaxCost(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                            />
                            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1"><span>€500</span><span>€{maxPossibleCost.toLocaleString()}</span></div>
                        </div>
                        <div className="lg:col-span-1">
                            <label htmlFor="sortBy" className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                                <ArrowDownUp size={14} className="inline mr-1" /> Sort By
                            </label>
                            <select
                                id="sortBy"
                                className="p-2.5 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-colors"
                                value={sortConfig.key ? `${sortConfig.key}-${sortConfig.direction}` : ''}
                                onChange={(e) => {
                                    const [key, direction] = e.target.value.split('-');
                                    setSortConfig({ key: key as keyof CityData, direction: direction as 'asc' | 'desc' });
                                }}
                            >
                                <option value="overallScore-desc">Overall Score (High-Low) {getSortIndicator('overallScore')}</option>
                                <option value="overallScore-asc">Overall Score (Low-High) {getSortIndicator('overallScore')}</option>
                                <option value="monthlyEstimateEUR-asc">Monthly Cost (Low-High) {getSortIndicator('monthlyEstimateEUR')}</option>
                                <option value="monthlyEstimateEUR-desc">Monthly Cost (High-Low) {getSortIndicator('monthlyEstimateEUR')}</option>
                                <option value="safetyScore-desc">Safety (High-Low) {getSortIndicator('safetyScore')}</option>
                                <option value="safetyScore-asc">Safety (Low-High) {getSortIndicator('safetyScore')}</option>
                                <option value="studentFriendliness-desc">Vibe (High-Low) {getSortIndicator('studentFriendliness')}</option>
                                <option value="studentFriendliness-asc">Vibe (Low-High) {getSortIndicator('studentFriendliness')}</option>
                                <option value="cityName-asc">City Name (A-Z) {getSortIndicator('cityName')}</option>
                                <option value="cityName-desc">City Name (Z-A) {getSortIndicator('cityName')}</option>
                            </select>
                        </div>
                        <div className="lg:col-span-1 flex space-x-2 items-end">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'bg-gray-200 text-[var(--text-primary)] hover:bg-gray-300 border border-gray-300'} flex-1 text-sm flex items-center justify-center`}
                            > <LayoutGrid size={16} className="mr-2" /> Grid</button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`btn ${viewMode === 'map' ? 'btn-primary' : 'bg-gray-200 text-[var(--text-primary)] hover:bg-gray-300 border border-gray-300'} flex-1 text-sm flex items-center justify-center`}
                            > <MapIcon size={16} className="mr-2" /> Map</button>
                        </div>
                    </div>
                </div>

                {isLoadingCities ? (
                    <div className="text-center py-20">
                        <Loader2 size={60} className="mx-auto animate-spin text-[var(--primary)] mb-6" />
                        <p className="text-2xl text-[var(--text-primary)]">Loading cities...</p>
                    </div>
                ) : fetchCitiesError ? (
                    <div className="text-center py-20">
                        <AlertCircle size={60} className="mx-auto text-red-500 mb-6" />
                        <p className="text-2xl text-red-700">Error loading cities:</p>
                        <p className="text-red-600 mt-2">{fetchCitiesError}</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <>
                        {filteredAndSortedCities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {filteredAndSortedCities.slice(0, displayedCardsCount).map(city => (<CityCard key={city.id} city={city} />))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Search size={60} className="mx-auto text-gray-400 mb-6" />
                                <p className="text-2xl text-[var(--text-primary)]">No cities match your criteria.</p>
                                <p className="text-[var(--text-secondary)] mt-2">Try adjusting your search or filters.</p>
                            </div>
                        )}
                        {displayedCardsCount < filteredAndSortedCities.length && (
                            <div ref={loadMoreRef} className="text-center py-8">
                                {isLoadingMoreCards ? (
                                    <Loader2 size={32} className="mx-auto animate-spin text-[var(--primary)]" />
                                ) : (
                                    <button onClick={loadMoreCards} className="btn btn-secondary">Load More Cities</button>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <MapView cities={filteredAndSortedCities} onMarkerClick={handleOpenModal} />
                )}

                {selectedCityForModal && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 animate-fadeIn"
                        onClick={handleCloseModal}
                    >
                        <div
                            className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 z-10"
                                aria-label="Close city details"
                            >
                                <X size={20} />
                            </button>
                            <CityCard city={selectedCityForModal} isModal={true} />
                        </div>
                    </div>
                )}


                <footer className="mt-16 md:mt-24 text-center text-sm text-[var(--text-secondary)] pb-8">
                    <p>&copy; {new Date().getFullYear()} Student Cost Insights. All data is approximate and for illustrative purposes.</p>
                    <p>Always conduct thorough research for personal financial planning. Data sourced illustratively. Weather data by WeatherAPI.com.</p>
                </footer>
            </div>
        </div>
    );
};

export default StudentCityCostInsights;