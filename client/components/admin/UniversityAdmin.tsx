// pages/admin/universities.tsx or components/admin/UniversityAdmin.tsx
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

const UniversityAdmin: React.FC = () => {
  const [universities, setUniversities] = useState<IUniversity[]>([]);
  const [formData, setFormData] = useState<UniversityFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/admin/universities');
      if (response.ok) {
        const data = await response.json();
        setUniversities(data);
      }
    } catch (error) {
      console.error('Error fetching universities:', error);
    }
  };

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
          ...((prev[parent as keyof typeof prev] || {}) as object),
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
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    
    try {
      const response = await fetch(`/api/admin/universities/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'University deleted successfully!' });
        await fetchUniversities();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete university' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">University Admin Panel</h1>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit University' : 'Add New University'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Logo URL</label>
                <input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website URL</label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contacts.email"
                  value={formData.contacts.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="contacts.phone"
                  value={formData.contacts.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <input
                  type="text"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  placeholder="e.g., 15th January"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admission Fee</label>
                <input
                  type="number"
                  name="admission_fee"
                  value={formData.admission_fee}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">CGPA Requirement</label>
                <input
                  type="text"
                  name="cgpa_requirement"
                  value={formData.cgpa_requirement}
                  onChange={handleInputChange}
                  placeholder="e.g., 3.0/4.0"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">English Requirement</label>
                <input
                  type="text"
                  name="english_requirement"
                  value={formData.english_requirement}
                  onChange={handleInputChange}
                  placeholder="e.g., IELTS 6.5"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Application Link</label>
              <input
                type="url"
                name="application_link"
                value={formData.application_link}
                onChange={handleInputChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Intakes Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Intakes</label>
                <button
                  type="button"
                  onClick={addIntake}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Add Intake
                </button>
              </div>
              
              {formData.intakes.map((intake, index) => (
                <div key={index} className="border p-3 rounded mb-2 bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Intake name"
                      value={intake.name}
                      onChange={(e) => updateIntake(index, 'name', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="date"
                      placeholder="Start date"
                      value={intake.start_date}
                      onChange={(e) => updateIntake(index, 'start_date', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="date"
                      placeholder="End date"
                      value={intake.end_date}
                      onChange={(e) => updateIntake(index, 'end_date', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Notes"
                      value={intake.notes}
                      onChange={(e) => updateIntake(index, 'notes', e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIntake(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingId ? 'Update' : 'Create')}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Universities List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Universities ({universities.length})</h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {universities.map((university) => (
              <div key={String(university._id)} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{university.name}</h3>
                    <p className="text-sm text-gray-600">{university.location}</p>
                    <p className="text-xs text-gray-500">
                      Views: {university.viewCount} | 
                      Favorites: {university.favoriteCount} | 
                      Tracked: {university.trackedCount}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(university)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(String(university._id))}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                {university.intakes && university.intakes.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">
                      Intakes: {university.intakes.map(i => i.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {universities.length === 0 && (
              <p className="text-gray-500 text-center py-8">No universities found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityAdmin;