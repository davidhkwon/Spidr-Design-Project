import { useState } from 'react';
import Select from 'react-select';
import countryData from 'country-telephone-data';
import validator from 'validator';
import './App.css';

function App() {
  // Prepare country options for the select dropdown
  const countryOptions = countryData.allCountries.map((country) => {
    const englishName = country.name.replace(/\s*\(.*\)\s*/, '');
    return {
      value: country.dialCode,
      label: `${englishName} (+${country.dialCode})`,
    };
  });

  const defaultCountry = countryOptions.find(c => c.label.startsWith('United States'));

  // State management
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
  const [formHistory, setFormHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Handle input changes
  const handleChange = (eOrValue, meta) => {
    if (meta && meta.name === 'countryCode') {
      // Save current state to history before updating
      setFormHistory(prev => [...prev.slice(0, historyIndex + 1), formData]);
      setHistoryIndex(prev => prev + 1);
      setFormData((prev) => ({ ...prev, countryCode: eOrValue }));
      return;
    }
    
    const { name, value } = eOrValue.target;
    let newValue;
    
    if (name === 'pin') {
      // Format PIN as ####-####-####-####
      let digits = value.replace(/\D/g, '').slice(0, 16);
      let formatted = '';
      for (let i = 0; i < digits.length; i += 4) {
        if (i > 0) formatted += '-';
        formatted += digits.slice(i, i + 4);
      }
      newValue = formatted;
    } else if (name === 'guess' || name === 'phone') {
      newValue = value.replace(/\D/g, '');
    } else {
      // Remove leading spaces from text inputs
      newValue = value.replace(/^\s+/, '');
    }
    
    // Save current state to history before updating
    setFormHistory(prev => [...prev.slice(0, historyIndex + 1), formData]);
    setHistoryIndex(prev => prev + 1);
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  // Handle undo (Ctrl+Z)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        setFormData(formHistory[historyIndex - 1]);
      }
    }
  };

  // Validate and submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First name is required.';
    if (!formData.lastName) errors.lastName = 'Last name is required.';
    if (!formData.countryCode) errors.phone = 'Country code is required.';
    if (!formData.phone) errors.phone = 'Phone number is required.';
    else {
      const fullPhone = `+${formData.countryCode.value}${formData.phone}`;
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
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <div className="confirmation">Thank you for your interest! Your submission has been received.</div>;
  }

  return (
    <>
      <h1 className="form-title">Spidr Design Interest Form</h1>
      <div className="split-container">
        <div className="split-left">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div className="split-right">
          <p className="required-note">* Required Field</p>
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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
              <div className="country-select">
                <Select options={countryOptions} 
                        value={formData.countryCode} 
                        onChange={(option) => handleChange(option, { name: 'countryCode' })} 
                        isSearchable
                        styles={{
                          container: (provided) => ({ ...provided }),
                          control: (provided) => ({ ...provided, color: 'black', minWidth: '0', fontSize: '0.9em' }),
                          singleValue: (provided) => ({ ...provided, color: 'black', fontSize: '0.9em' }),
                          input: (provided) => ({ ...provided, color: 'black', fontSize: '0.9em' }),
                          option: (provided, state) => ({ 
                            ...provided, 
                            color: 'black', 
                            fontSize: '0.9em',
                            backgroundColor: state.isFocused ? '#56acbd' : state.isSelected ? '#56acbd' : 'white',
                            color: state.isFocused || state.isSelected ? 'white' : 'black',
                            '&:hover': {
                              backgroundColor: '#56acbd',
                              color: 'white'
                            }
                          }),
                        }}
                />
              </div>
              <input type="text"
                     name="phone"
                     value={formData.phone}
                     onChange={handleChange}
                     className="phone-input"
                     style={{ marginTop: '8px' }}
              />
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
