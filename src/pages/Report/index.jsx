import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const DEFAULT_POSITION = [13.41, 122.56]; // Central Philippines

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

const isBrowser = typeof window !== 'undefined';

const Report = () => {
  const [formData, setFormData] = useState({
    incidentType: '',
    location: '',
    date: '',
    time: '',
    description: '',
    attachments: null,
  });
  const [mapPosition, setMapPosition] = useState(DEFAULT_POSITION);
  const [isLocating, setIsLocating] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapPosition([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied. Please enable location access.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out.");
            break;
          default:
            alert("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Update location string when map position changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      location: mapPosition ? `${mapPosition[0]}, ${mapPosition[1]}` : prev.location
    }));
  }, [mapPosition]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement report submission logic
    console.log('Report submitted:', formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Report an Incident</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="incidentType" className="block text-sm font-medium text-gray-700 mb-1">
              Incident Type
            </label>
            <select
              id="incidentType"
              name="incidentType"
              value={formData.incidentType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select incident type</option>
              <option value="theft">Theft</option>
              <option value="harassment">Harassment</option>
              <option value="vandalism">Vandalism</option>
              <option value="suspicious">Suspicious Activity</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location (click on the map to select)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Click on the map below to select location"
                required
                readOnly
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isLocating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {isLocating ? 'Getting Location...' : 'Get My Location'}
              </button>
            </div>
            <div className="mt-2 rounded overflow-hidden" style={{ height: 300 }}>
              {isBrowser && (
                <MapContainer center={mapPosition} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker position={mapPosition} setPosition={setMapPosition} />
                </MapContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe the incident in detail"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
              Attachments (Optional)
            </label>
            <input
              type="file"
              id="attachments"
              name="attachments"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              accept="image/*"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report; 