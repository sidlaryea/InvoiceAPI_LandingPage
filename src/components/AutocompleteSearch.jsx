import { useState, useEffect } from "react";

// Optional debounce helper
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};




export default function AutocompleteSearch({
  label,
  placeholder,
  fetchData,           // function that takes a query string and returns array of results
  getOptionLabel,      // function to format display text from a result item
  onSelect,            // callback when an item is selected
  value = null,        // controlled selected item from parent
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  
  


//   const updateItem = (index, field, value) => {
//   const updatedItems = [...formData.items];
//   updatedItems[index][field] = value;
//   setFormData({ ...formData, items: updatedItems });
// };

  const fetchResults = async (searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    try {
      const data = await fetchData(searchTerm);
      setResults(data);
    } catch (error) {
      console.error("Autocomplete fetch error:", error);
    }
  };

  const debouncedFetch = debounce(fetchResults, 300);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetch(value);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    setQuery(getOptionLabel(item));
    setResults([]);
    onSelect(item);
  };

  // Sync internal state with controlled value prop
  useEffect(() => {
    if (value === null) {
      setSelectedItem(null);
      setQuery("");
      setResults([]);
    } else {
      setSelectedItem(value);
      setQuery(getOptionLabel(value));
    }
  }, [value, getOptionLabel]);

  return (
    <div className="relative mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      />

      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow rounded max-h-60 overflow-y-auto border mt-1">
          {results.map((item) => (
            <li
              key={item.id}
              onClick={() => handleSelect(item)}
              className="px-4 py-2 hover:bg-teal-100 cursor-pointer"
            >
              {getOptionLabel(item)}
            </li>
          ))}
        </ul>
      )}

      {selectedItem && (
        <p className="text-sm text-gray-600 mt-1">
          {/* Selected: {getOptionLabel(selectedItem)} */}
        </p>
      )}

    </div>
  );
}
