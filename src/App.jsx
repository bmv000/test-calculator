import React, { useState } from 'react';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    venueSlug: '',
    cartValue: '',
    userLatitude: '',
    userLongitude: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted');
  };

  return (
    <div className="App">
      <h1>Delivery Order Pricing Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Venue slug:
          <input
            type="text"
            name="venueSlug"
            value={formData.venueSlug}
            onChange={handleInputChange}
            data-test-id="venueSlug"
            required
          />
        </label>
        <label>
          Cart value:
          <input
            type="number"
            name="cartValue"
            value={formData.cartValue}
            onChange={handleInputChange}
            data-test-id="cartValue"
            required
          />
        </label>
        <label>
          User latitude:
          <input
            type="number"
            name="userLatitude"
            value={formData.userLatitude}
            onChange={handleInputChange}
            data-test-id="userLatitude"
            required
          />
        </label>
        <label>
          User longitude:
          <input
            type="number"
            name="userLongitude"
            value={formData.userLongitude}
            onChange={handleInputChange}
            data-test-id="userLongitude"
            required
          />
        </label>
        <button type="submit" data-test-id="getLocation">Submit</button>
      </form>
    </div>
  );
};

export default App;
