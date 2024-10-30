import React, { useState, useEffect } from 'react';
import styles from './volunteerApp.module.css';

const VolunteerForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    areasOfHelp: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    
    if (name === "areasOfHelp") {
      setFormData((prevData) => {
        const newAreasOfHelp = checked
          ? [...prevData.areasOfHelp, value]  // Add value if checked
          : prevData.areasOfHelp.filter(area => area !== value); // Remove value if unchecked

        return {
          ...prevData,
          areasOfHelp: newAreasOfHelp,
        };
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch('http://localhost:3000/volunteer/create', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form class={styles.volunteerForm} onSubmit={handleSubmit}>

      <input class={styles.volunteerInput} type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
      <input class={styles.volunteerInput} type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
      <input class={styles.volunteerInput} type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
      <input class={styles.volunteerInput} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input class={styles.volunteerInput} type="text" name="streetAddress" placeholder="Street Address" value={formData.streetAddress} onChange={handleChange} required />
      <input class={styles.volunteerInput} type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
      <input class={styles.volunteerInput} type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
      <input class={styles.volunteerInput} type="text" name="zipCode" placeholder="Zip Code" value={formData.zipCode} onChange={handleChange} required />
      
      <label>Areas of Help:</label>
      <div>
        <label class={styles.volunteerLabel}>
          <input 
            type="checkbox" 
            name="areasOfHelp" 
            value="Teaching" 
            checked={formData.areasOfHelp.includes('Teaching')} 
            onChange={handleChange} 
          />
          Teaching
        </label>
        <label class={styles.volunteerLabel}>
          <input 
            type="checkbox" 
            name="areasOfHelp" 
            value="First Aid" 
            checked={formData.areasOfHelp.includes('First Aid')} 
            onChange={handleChange} 
          />
          First Aid
        </label>
        <label class={styles.volunteerLabel}>
          <input 
            type="checkbox" 
            name="areasOfHelp" 
            value="Fundraising" 
            checked={formData.areasOfHelp.includes('Fundraising')} 
            onChange={handleChange} 
          />
          Fundraising
        </label>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default VolunteerForm;
