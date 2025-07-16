import { useState } from 'react';
import Select from 'react-select';
import countryData from 'country-telephone-data';
import validator from 'validator';
import 'react-phone-number-input/style.css';
import './App.css';

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

    // For basic inputs
    const { name, value } = eOrValue.target;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    
    // First Name
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
    <>
      <h1 className="form-title">Spidr Interest Form</h1>
      <div className="split-container">
        <div className="split-left">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div className="split-right">
          <p className="required-note">* Required Field</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label>First Name <span style={{ color: '#fff' }}>*</span></label>
              <input type="text"
                     name="firstName"
                     value={formData.firstName}
                     onChange={handleChange}
              />
              {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}
            </div>
            <div>
              <label>Last Name <span style={{ color: '#fff' }}>*</span></label>
              <input type="text"
                     name="lastName"
                     value={formData.lastName}
                     onChange={handleChange}
              />
              {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}
            </div>
            <div>
              <label>Phone Number <span style={{ color: '#fff' }}>*</span></label>
              <div className="phone-row">
                <div className="country-select">
                  <Select options={countryOptions} 
                          value={formData.countryCode} 
                          onChange={(option) => handleChange(option, { name: 'countryCode' })} 
                          isSearchable
                          styles={{
                            control: (provided) => ({ ...provided, color: 'black' }),
                            singleValue: (provided) => ({ ...provided, color: 'black' }),
                            input: (provided) => ({ ...provided, color: 'black' }),
                            option: (provided, state) => ({ ...provided, color: 'black' }),
                          }}
                    />
                </div>
                <input type="text"
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       className="phone-input"
                />
              </div>
              {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
            </div>
            <div>
              <label>Email Address <span style={{ color: '#fff' }}>*</span></label>
              <input type="text"
                     name="email"
                     value={formData.email}
                     onChange={handleChange} 
              />
              {formErrors.email && <div className="error-message">{formErrors.email}</div>}
            </div>
            <div>
              <label>Guess the air fryer’s cost (in USD) <span style={{ color: '#fff' }}>*</span></label>
              <input type="text"
                     inputMode="numeric"
                     name="guess" value={formData.guess}
                     onChange={handleChange} 
              />
              {formErrors.guess && <div className="error-message">{formErrors.guess}</div>}
            </div>
            <div>
              <label>Spidr PIN <span style={{ color: '#fff' }}>*</span></label>
              <input type="text"
                     inputMode="numeric"
                     name="pin"
                     placeholder="####-####-####-####"
                     maxLength={19} value={formData.pin}
                     onChange={handleChange} 
              />
              {formErrors.pin && <div className="error-message">{formErrors.pin}</div>}
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;