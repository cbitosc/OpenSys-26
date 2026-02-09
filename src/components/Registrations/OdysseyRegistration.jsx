import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Mail, User, Phone, GraduationCap, Calendar, Hash, Key, Share2, ListChecks, MessageCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { db, collection, addDoc, query, where, getDocs } from '../../firebase/firebaseConfig';
import registrationTracker from '../../firebase/registrationTracker';
import { validatePhone, validateEmail, validatePassword, BRANCH_OPTIONS, COLLEGE_OPTIONS, YEAR_OPTIONS, getFirebaseErrorMessage } from '../../utils/validation';
import Input from '../Input';
import PostRegistrationOptions from '../PostRegistrationOptions';

const OdysseyRegistration = () => {
  const navigate = useNavigate();

  const initialFormState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    otherCollegeName: '', // Added for "Other" college option
    branch: '',
    phone: '',
    rollNumber: '',
    year: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadSavedData = () => {
      const participant1Data = localStorage.getItem('odyssey_participant1Data');

      try {
        if (participant1Data) {
          const p1Data = JSON.parse(participant1Data);

          // Determine if the saved college was from "Other" option
          let collegeValue = p1Data.college || '';
          let otherCollegeName = '';

          // If the saved college is not in the predefined options, it was entered as "Other"
          if (p1Data.college && !COLLEGE_OPTIONS.includes(p1Data.college)) {
            collegeValue = 'Other';
            otherCollegeName = p1Data.college;
          }

          setFormData(prevData => ({
            ...prevData,
            name: p1Data.name || '',
            email: p1Data.email || '',
            college: collegeValue,
            otherCollegeName: otherCollegeName,
            branch: p1Data.branch || '',
            phone: p1Data.phone || '',
            rollNumber: p1Data.rollNumber || '',
            year: p1Data.year || ''
          }));
        }
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    };

    loadSavedData();
  }, []);


  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
      isValid = false;
    }

    if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!validatePassword(formData.password)) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Validate college field
    if (!formData.college) {
      errors.college = 'Please select your college';
      isValid = false;
    } else if (formData.college === 'Other' && !formData.otherCollegeName?.trim()) {
      errors.college = 'Please enter your college name';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    setLoading(true);

    try {
      // Check if user has already registered for Odyssey using the same email
      const odysseyQuery = query(collection(db, "odysseyParticipants"), where("email", "==", formData.email));
      const querySnapshot = await getDocs(odysseyQuery);
      
      if (!querySnapshot.empty) {
        setLoading(false);
        setError("You have already registered for Odyssey with this email. You cannot register for the same event twice.");
        return;
      }

      // Generate a simple ID for tracking (without Firebase Auth)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const participantData = {
        name: formData.name,
        email: formData.email,
        college: formData.college === 'Other' ? formData.otherCollegeName : formData.college,
        branch: formData.branch,
        phone: formData.phone,
        rollNumber: formData.rollNumber,
        year: formData.year,
        timestamp: new Date(),
        userId: userId // Simple generated ID instead of Firebase Auth UID
      };

      await addDoc(collection(db, "odysseyParticipants"), participantData);

      // Track the registration for statistics
      try {
        await registrationTracker.trackRegistration("odyssey", formData.college);
      } catch (trackingError) {
        console.error("Error tracking registration:", trackingError);
        // Don't fail the registration if tracking fails
      }

      const dataToSave = {
        name: formData.name,
        email: formData.email,
        college: formData.college === 'Other' ? formData.otherCollegeName : formData.college,
        branch: formData.branch,
        phone: formData.phone,
        rollNumber: formData.rollNumber,
        year: formData.year
      };
      localStorage.setItem('odyssey_participant1Data', JSON.stringify(dataToSave));
      localStorage.setItem('registeredForOdyssey', 'true');

      setSuccess(true);
      setFormData(initialFormState);
    } catch (err) {
      console.error('Registration error:', err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    setValidationErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  };

  const handleSignOut = async () => {
    localStorage.removeItem('odyssey_participant1Data');
    localStorage.removeItem('registeredForOdyssey');
    setSuccess(false);
    setFormData(initialFormState);
    navigate('/');
  };

  if (success) {
    return (
      <div className="min-h-screen font-sora px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <PostRegistrationOptions onRegisterAnother={handleSignOut} eventType="odyssey" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sora px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-3">
            <img src="/LogoCOSC.svg" alt="COSC" className="h-8 sm:h-10" />
            <span className="text-white/40">|</span>
            <img src="/logo4x.png" alt="OpenSys" className="h-8 sm:h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Odyssey
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Solve every level before time runs out and prove you are the sharpest.          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 rounded-2xl p-8 md:p-10 border border-white/10 backdrop-blur-sm md:backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              icon={User}
              field="name"
              label="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              error={validationErrors.name}
              staticLabel
              uiVariant="premium"
              required
            />
            <Input
              icon={Mail}
              field="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={validationErrors.email}
              staticLabel
              uiVariant="premium"
              required
            />
            <Input
              icon={Key}
              field="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={validationErrors.password}
              staticLabel
              uiVariant="premium"
              required
            />
            <Input
              icon={Key}
              field="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={validationErrors.confirmPassword}
              staticLabel
              uiVariant="premium"
              required
            />
            <Input
              icon={GraduationCap}
              field="college"
              label="College"
              value={formData.college}
              onChange={handleInputChange}
              formData={formData}
              options={COLLEGE_OPTIONS}
              isCheckbox={false}
              error={validationErrors.college}
              staticLabel
              uiVariant="premium"
              required
            />
            <Input
              icon={GraduationCap}
              field="branch"
              label="Branch"
              value={formData.branch}
              onChange={handleInputChange}
              options={BRANCH_OPTIONS}
              error={validationErrors.branch}
              staticLabel
              uiVariant="premium"
              required
            />
            <Input
              icon={Phone}
              field="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              error={validationErrors.phone}
              staticLabel
              uiVariant="premium"
              required
            />
            <Input
              icon={Hash}
              field="rollNumber"
              label="Roll Number"
              value={formData.rollNumber}
              onChange={handleInputChange}
              error={validationErrors.rollNumber}
              staticLabel
              uiVariant="premium"
              required
            />
            <Input
              icon={Calendar}
              field="year"
              label="Year"
              value={formData.year}
              onChange={handleInputChange}
              options={YEAR_OPTIONS}
              error={validationErrors.year}
              staticLabel
              uiVariant="premium"
              required
            />
          </div>
          <div className="bg-violet-500/10 border border-violet-400/20 text-violet-200 px-4 py-3 rounded-xl flex items-center gap-2">
            <Key className="w-5 h-5 flex-shrink-0" />
            <span>Remember your credentials! You'll need them to access the game.</span>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full py-3.5 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                <span>Registering...</span>
              </span>
            ) : (
              <span>Register Now</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OdysseyRegistration;