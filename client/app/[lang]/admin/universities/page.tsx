'use client';

import React, { useState, useEffect } from 'react';
import { IUniversity } from '@/lib/models/University';

interface UniversityFormData {
    name: string;
    slug: string;
    location: string;
    city: string;
    description: string;
    logoUrl: string;
    websiteUrl: string;
    contacts: {
        email: string;
        phone: string;
    };
    deadline: string;
    admission_fee: number;
    cgpa_requirement: string;
    english_requirement: string;
    intakes: {
        name: string;
        start_date: string;
        end_date: string;
        notes: string;
    }[];
    application_link: string;
}

const initialFormData: UniversityFormData = {
    name: '',
    slug: '',
    location: '',
    city: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    contacts: {
        email: '',
        phone: ''
    },
    deadline: '',
    admission_fee: 0,
    cgpa_requirement: '',
    english_requirement: '',
    intakes: [],
    application_link: ''
};

export default function UniversityAdminPage() {
    const [universities, setUniversities] = useState<IUniversity[]>([]);
    const [formData, setFormData] = useState<UniversityFormData>(initialFormData);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCity, setFilterCity] = useState('');

    // Fetch universities on component mount
    useEffect(() => {
        fetchUniversities();
    }, []);

    // Auto-hide messages after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchUniversities = async () => {
        try {
            setFetchLoading(true);
            const response = await fetch('/api/admin/universities');
            if (response.ok) {
                const data = await response.json();
                setUniversities(data);
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch universities' });
            }
        } catch (error) {
            console.error('Error fetching universities:', error);
            setMessage({ type: 'error', text: 'Network error while fetching universities' });
        } finally {
            setFetchLoading(false);
        }
    };
    // especially if you have a large number of universities, you might want to implement pagination or lazy loading.

    // Auto-generate slug from name
    useEffect(() => {
        if (formData.name && !editingId) {
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.name, editingId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof typeof prev] as any,
                    [child]: type === 'number' ? Number(value) : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value
            }));
        }
    };

    const addIntake = () => {
        setFormData(prev => ({
            ...prev,
            intakes: [...prev.intakes, { name: '', start_date: '', end_date: '', notes: '' }]
        }));
    };

    const updateIntake = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            intakes: prev.intakes.map((intake, i) =>
                i === index ? { ...intake, [field]: value } : intake
            )
        }));
    };

    const removeIntake = (index: number) => {
        setFormData(prev => ({
            ...prev,
            intakes: prev.intakes.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingId ? `/api/admin/universities/${editingId}` : '/api/admin/universities';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: `University ${editingId ? 'updated' : 'created'} successfully!` });
                resetForm();
                await fetchUniversities();
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Something went wrong' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error occurred' });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (university: IUniversity) => {
        setFormData({
            name: university.name,
            slug: university.slug,
            location: university.location || '',
            city: university.city || '',
            description: university.description || '',
            logoUrl: university.logoUrl || '',
            websiteUrl: university.websiteUrl || '',
            contacts: {
                email: university.contacts?.email || '',
                phone: university.contacts?.phone || ''
            },
            deadline: university.deadline || '',
            admission_fee: university.admission_fee || 0,
            cgpa_requirement: university.cgpa_requirement || '',
            english_requirement: university.english_requirement || '',
            intakes: (university.intakes || []).map(intake => ({
                name: intake.name || '',
                start_date: intake.start_date || '',
                end_date: intake.end_date || '',
                notes: intake.notes || ''
            })),
            application_link: university.application_link || ''
        });
        setEditingId(String(university._id));

        // Scroll to form
        document.getElementById('university-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this university? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/api/admin/universities/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'University deleted successfully!' });
                await fetchUniversities();
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Failed to delete university' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error occurred' });
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingId(null);
    };

    // Filter universities based on search and filter criteria
    const filteredUniversities = universities.filter(university => {
        const matchesSearch = university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            university.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            university.city?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCity = !filterCity || university.city?.toLowerCase() === filterCity.toLowerCase();

        return matchesSearch && matchesCity;
    });

    // Get unique cities for filter dropdown
    const uniqueCities = Array.from(new Set(universities.map(u => u.city).filter(Boolean))).sort();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">University Admin Panel</h1>
                    <p className="text-gray-600">Manage university listings and information</p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {message.type === 'success' ? (
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="font-medium">{message.text}</p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setMessage(null)}
                                    className="inline-flex text-gray-400 hover:text-gray-600"
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Form Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {editingId ? 'Edit University' : 'Add New University'}
                            </h2>
                        </div>

                        <form id="university-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            University Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="Enter university name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL Slug *
                                        </label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={formData.slug}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="university-name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="State/Province, Country"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="City name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Brief description of the university..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                                        <input
                                            type="url"
                                            name="logoUrl"
                                            value={formData.logoUrl}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="https://example.com/logo.png"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                                        <input
                                            type="url"
                                            name="websiteUrl"
                                            value={formData.websiteUrl}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="https://university.edu"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contact Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                                        <input
                                            type="email"
                                            name="contacts.email"
                                            value={formData.contacts.email}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="admissions@university.edu"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                                        <input
                                            type="tel"
                                            name="contacts.phone"
                                            value={formData.contacts.phone}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Academic Requirements</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                                        <input
                                            type="text"
                                            name="deadline"
                                            value={formData.deadline}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g., 15th January 2024"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Admission Fee ($)</label>
                                        <input
                                            type="number"
                                            name="admission_fee"
                                            value={formData.admission_fee}
                                            onChange={handleInputChange}
                                            min="0"
                                            step="0.01"
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CGPA Requirement</label>
                                        <input
                                            type="text"
                                            name="cgpa_requirement"
                                            value={formData.cgpa_requirement}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g., 3.0/4.0 or 70%"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">English Requirement</label>
                                        <input
                                            type="text"
                                            name="english_requirement"
                                            value={formData.english_requirement}
                                            onChange={handleInputChange}
                                            className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            placeholder="e.g., IELTS 6.5, TOEFL 80"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Link</label>
                                    <input
                                        type="url"
                                        name="application_link"
                                        value={formData.application_link}
                                        onChange={handleInputChange}
                                        className="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="https://apply.university.edu"
                                    />
                                </div>
                            </div>

                            {/* Intakes Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="text-lg font-medium text-gray-900">Intake Periods</h3>
                                    <button
                                        type="button"
                                        onClick={addIntake}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        + Add Intake
                                    </button>
                                </div>

                                {formData.intakes.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No intake periods added yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {formData.intakes.map((intake, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Intake Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g., Fall 2024, Spring 2024"
                                                            value={intake.name}
                                                            onChange={(e) => updateIntake(index, 'name', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                        <input
                                                            type="date"
                                                            value={intake.start_date}
                                                            onChange={(e) => updateIntake(index, 'start_date', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                        <input
                                                            type="date"
                                                            value={intake.end_date}
                                                            onChange={(e) => updateIntake(index, 'end_date', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Additional information"
                                                            value={intake.notes}
                                                            onChange={(e) => updateIntake(index, 'notes', e.target.value)}
                                                            className="w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeIntake(index)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                                                >
                                                    Remove Intake
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {editingId ? 'Updating...' : 'Creating...'}
                                        </div>
                                    ) : (
                                        editingId ? 'Update University' : 'Create University'
                                    )}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Universities List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Universities ({filteredUniversities.length})
                                </h2>

                                {/* Search and Filter */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        placeholder="Search universities..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                    <select
                                        value={filterCity}
                                        onChange={(e) => setFilterCity(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">All Cities</option>
                                        {uniqueCities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {fetchLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="ml-2 text-gray-600">Loading universities...</span>
                                </div>
                            ) : filteredUniversities.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1 m4-4h1m-1 4h1m-1-8h1m-1 4h1" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No universities found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {searchTerm || filterCity ? 'Try adjusting your search criteria.' : 'Get started by creating a new university.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {filteredUniversities.map((university) => (
                                        <div key={String(university._id)} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-3">
                                                        {university.logoUrl && (
                                                            <img
                                                                src={university.logoUrl}
                                                                alt={`${university.name} logo`}
                                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-lg text-gray-900 truncate">
                                                                {university.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mb-1">
                                                                {university.location || university.city || 'Location not specified'}
                                                            </p>

                                                            {/* Stats */}
                                                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                                                                <span className="flex items-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    Views: {university.viewCount}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                    </svg>
                                                                    Favorites: {university.favoriteCount}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                                    </svg>
                                                                    Tracked: {university.trackedCount}
                                                                </span>
                                                            </div>

                                                            {/* Requirements */}
                                                            {(university.cgpa_requirement || university.english_requirement || university.admission_fee) && (
                                                                <div className="flex flex-wrap gap-2 mb-2">
                                                                    {university.cgpa_requirement && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                            CGPA: {university.cgpa_requirement}
                                                                        </span>
                                                                    )}
                                                                    {university.english_requirement && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            {university.english_requirement}
                                                                        </span>
                                                                    )}
                                                                    {university.admission_fee && university.admission_fee > 0 && (
                                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            Fee: ${university.admission_fee}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Intakes */}
                                                            {university.intakes && university.intakes.length > 0 && (
                                                                <div className="mt-2">
                                                                    <p className="text-xs text-gray-600 mb-1">
                                                                        <span className="font-medium">Intakes:</span> {university.intakes.map(i => i.name).filter(Boolean).join(', ') || 'Not specified'}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Deadline */}
                                                            {university.deadline && (
                                                                <p className="text-xs text-red-600 font-medium">
                                                                    Deadline: {university.deadline}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col sm:flex-row gap-2 ml-4">
                                                    <button
                                                        onClick={() => handleEdit(university)}
                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(String(university._id))}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Links */}
                                            {(university.websiteUrl || university.application_link) && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                                                    {university.websiteUrl && (
                                                        <a
                                                            href={university.websiteUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 underline"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                            Website
                                                        </a>
                                                    )}
                                                    {university.application_link && (
                                                        <a
                                                            href={university.application_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 underline"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            Apply
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}