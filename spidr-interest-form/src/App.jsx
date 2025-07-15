import { useState } from 'react';
import Select from 'react-select';
import countryData from 'country-telephone-data';
import validator from 'validator';
import 'react-phone-number-input/style.css';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const countryOptions = countryData.allCountries.map((country) => {
    // Remove anything in parentheses from the country name
    const englishName = country.name.replace(/\s*\(.*\)\s*/, '');
    return {
      value: country.dialCode,
      label: `${englishName} (+${country.dialCode})`,
    };
  });

  const defaultCountry = countryOptions.find(
    c => c.label.startsWith('United States')
  );

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    countryCode: defaultCountry,
    phone: '',
    email: '',
    guess: '',
    pin: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (eOrValue, meta) => {
    if (meta && meta.name === 'countryCode') {
      setFormData((prev) => ({ ...prev, countryCode: eOrValue }));
      return;
    }

    // For basic inputs
    const { name, value } = eOrValue.target;

    if (name === 'pin') {
      let digits = value.replace(/\D/g, '').slice(0, 16);
      let formatted = '';
      for (let i = 0; i < digits.length; i += 4) {
        if (i > 0) formatted += '-';
        formatted += digits.slice(i, i + 4);
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else if (name === 'guess') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    } else if (name === 'phone') {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, '') }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First name is required.';
    if (!formData.lastName) errors.lastName = 'Last name is required.';
    if (!formData.countryCode) errors.phone = 'Country code is required.';
    if (!formData.phone) errors.phone = 'Phone number is required.';
    else {
      // Combine country code and phone for validation
      const fullPhone = `+${formData.countryCode.value}${formData.phone}`;
      // Use validator to check if it's a valid phone number
      if (!validator.isMobilePhone(fullPhone, undefined, { strictMode: false })) {
        errors.phone = 'Please enter a valid phone number.';
      }
    }
    if (!formData.email) errors.email = 'Email address is required.';
    else if (!validator.isEmail(formData.email)) errors.email = 'Please enter a valid email address (example@domain.com).';
    if (!formData.guess) errors.guess = 'Guess is required.';
    if (!formData.pin) errors.pin = 'Spidr PIN is required.';
    else {
      const pinDigits = formData.pin.replace(/\D/g, '');
      if (pinDigits.length !== 16) errors.pin = 'Spidr PIN must be exactly 16 digits.';
    }
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      console.log('Form submitted:', formData);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <div className="confirmation">Thank you for your interest! Your submission has been received.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}
      </div>
      <div>
        <label>Last Name</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}
      </div>
      <div>
        <label>Phone Number</label>
        <div>
          <div>
            <Select options={countryOptions} value={formData.countryCode} onChange={(option) => handleChange(option, { name: 'countryCode' })} isSearchable
            />
          </div>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
      </div>
      <div>
        <label>Email Address</label>
        <input type="text" name="email" value={formData.email} onChange={handleChange} />
        {formErrors.email && <div className="error-message">{formErrors.email}</div>}
      </div>
      <div>
        <label>Guess the air fryer’s cost (in USD)</label>
        <input type="text" inputMode="numeric" name="guess" value={formData.guess} onChange={handleChange} />
        {formErrors.guess && <div className="error-message">{formErrors.guess}</div>}
      </div>
      <div>
        <label>Spidr PIN</label>
        <input type="text" inputMode="numeric" name="pin" placeholder="####-####-####-####" maxLength={19} value={formData.pin} onChange={handleChange} />
        {formErrors.pin && <div className="error-message">{formErrors.pin}</div>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default App;
