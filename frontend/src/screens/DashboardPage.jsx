import React, { useEffect, useState, useCallback } from 'react';
import config from '../constants.js';
import { PhotoIcon, PlusIcon, TagIcon, StarIcon, TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';

const AROMA_OPTIONS = ['Pungent', 'Mild', 'Earthy', 'Nutty'];
const TEXTURE_OPTIONS = ['Soft', 'Hard', 'Creamy', 'Crumbly'];

// Feature-Aware Component: ImageUploader
const ImageUploader = ({ photoFile, onPhotoChange }) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!photoFile) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(photoFile);
  }, [photoFile]);

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      onPhotoChange(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Cheese Photo</label>
      <div onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300'}`}>
        <div className="space-y-1 text-center">
          {preview ? (
            <div className="relative mx-auto">
              <img src={preview} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md" />
              <button onClick={() => onPhotoChange(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="flex text-sm text-gray-600">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

// Feature-Aware Component: ChoiceSelector
const ChoiceSelector = ({ label, options, selected, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selected === option ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [cheeses, setCheeses] = useState([]);
  const [newCheese, setNewCheese] = useState({ name: '', description: '', origin: '', aroma: 'Mild', texture: 'Hard' });
  const [photoFile, setPhotoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCheeses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Cheese').find({ include: ['discoverer'], sort: { createdAt: 'desc' } });
      if (response && response.data) {
        setCheeses(response.data);
      }
    } catch (error) {
      console.error('Failed to load cheeses:', error);
    }
    setIsLoading(false);
  }, [manifest]);

  useEffect(() => {
    loadCheeses();
  }, [loadCheeses]);

  const handleCreateCheese = async (e) => {
    e.preventDefault();
    if (!newCheese.name) {
      alert('Cheese name is required.');
      return;
    }
    try {
      const cheeseData = { ...newCheese, photo: photoFile };
      await manifest.from('Cheese').create(cheeseData);
      setNewCheese({ name: '', description: '', origin: '', aroma: 'Mild', texture: 'Hard' });
      setPhotoFile(null);
      loadCheeses();
    } catch (error) {
      console.error('Failed to create cheese:', error);
      alert('Could not create cheese.');
    }
  };

    const handleDeleteCheese = async (cheeseId) => {
        if (window.confirm('Are you sure you want to delete this cheese?')) {
            try {
                await manifest.from('Cheese').delete(cheeseId);
                loadCheeses();
            } catch (error) {
                console.error('Failed to delete cheese:', error);
                alert('You can only delete cheeses you discovered.');
            }
        }
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mice's Cheese Pantry</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name}! <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Connoisseur' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span></p>
          </div>
          <div className="flex items-center gap-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Admin Panel</a>
            <button onClick={onLogout} className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Logout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <PlusIcon className="h-6 w-6 mr-2" />
                Add a New Cheese
              </h2>
              <form onSubmit={handleCreateCheese} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Cheese Name</label>
                  <input type="text" id="name" value={newCheese.name} onChange={(e) => setNewCheese({ ...newCheese, name: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
                </div>
                <div>
                  <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin (e.g., France)</label>
                  <input type="text" id="origin" value={newCheese.origin} onChange={(e) => setNewCheese({ ...newCheese, origin: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea id="description" rows="3" value={newCheese.description} onChange={(e) => setNewCheese({ ...newCheese, description: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                </div>
                <ImageUploader photoFile={photoFile} onPhotoChange={setPhotoFile} />
                <ChoiceSelector label="Aroma" options={AROMA_OPTIONS} selected={newCheese.aroma} onSelect={(aroma) => setNewCheese({ ...newCheese, aroma })} />
                <ChoiceSelector label="Texture" options={TEXTURE_OPTIONS} selected={newCheese.texture} onSelect={(texture) => setNewCheese({ ...newCheese, texture })} />
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add Cheese</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Cheese Collection</h2>
              {isLoading ? (
                <p className="text-gray-500">Scurrying to find the cheese...</p>
              ) : cheeses && cheeses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cheeses.map((cheese) => (
                    <div key={cheese.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                      {cheese.photo && <img src={cheese.photo.thumbnail.url} alt={cheese.name} className="w-full h-48 object-cover" />}
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{cheese.name}</h3>
                                <p className="text-sm text-gray-500">{cheese.origin}</p>
                             </div>
                             {(user.id === cheese.discoverer?.id || user.role === 'Connoisseur') && (
                                <button onClick={() => handleDeleteCheese(cheese.id)} className="text-gray-400 hover:text-red-500 p-1">
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            )}
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{cheese.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{cheese.aroma}</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{cheese.texture}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">Discovered by: {cheese.discoverer ? cheese.discoverer.name : 'Unknown Mouse'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">The pantry is empty! Add your first cheese.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
