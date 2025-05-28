import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

function TripSearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Fetch filtered trips from backend
  useEffect(() => {
    const fetchTrips = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:4002/api/trips?search=${searchTerm}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };

    const delayDebounce = setTimeout(fetchTrips, 300); // debounce for 300ms
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-sm lg:hidden px-4">
      <input
        type="text"
        placeholder="Search trips..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />

      {searchTerm && (
        <div className="absolute bg-white z-10 w-full mt-2 rounded-md shadow-lg border border-gray-200">
          {searchResults.length > 0 ? (
            searchResults.map((trip) => (
              <div
                key={trip._id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  window.location.href = `/trip/${trip._id}`;
                }}
              >
                <p className="font-semibold">{trip.name}</p>
                <p className="text-sm text-gray-500">{trip.province}</p>
              </div>
            ))
          ) : (
            <p className="px-4 py-2 text-gray-500">No trips found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default TripSearchBar;