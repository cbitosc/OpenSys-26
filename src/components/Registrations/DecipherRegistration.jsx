import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Mail, User, Phone, GraduationCap, Calendar, Hash, Sparkles, Share2, ListChecks, MessageCircle, ArrowRight, AlertTriangle, XCircle } from 'lucide-react';
import { db, collection, addDoc, query, where, getDocs } from '../../firebase/firebaseConfig';
import registrationTracker from '../../firebase/registrationTracker';
import { validatePhone, validateEmail, BRANCH_OPTIONS, COLLEGE_OPTIONS, YEAR_OPTIONS, getFirebaseErrorMessage } from '../../utils/validation';
import Input from '../Input';
import PostRegistrationOptions from '../PostRegistrationOptions';

const ParticipantFields = ({ number, title, formData, onInputChange, errors }) => (
  <div className="space-y-4">
    <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-200">
      {title || `Participant ${number}`}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        icon={User}
        participant={`participant${number}`}
        field="name"
        label="Full Name"
        value={formData[`participant${number}`].name}
        onChange={onInputChange}
        error={errors?.[`participant${number}`]?.name}
        staticLabel
        uiVariant="premium"
        required
      />
      <Input
        icon={Mail}
        participant={`participant${number}`}
        field="email"
        label="Email"
        type="email"
        value={formData[`participant${number}`].email}
        onChange={onInputChange}
        error={errors?.[`participant${number}`]?.email}
        staticLabel
        uiVariant="premium"
        required
      />
      <Input
        icon={GraduationCap}
        participant={`participant${number}`}
        field="college"
        label="College"
        value={formData[`participant${number}`].college}
        onChange={onInputChange}
        formData={formData[`participant${number}`]}
        options={COLLEGE_OPTIONS}
        isCheckbox={false}
        error={errors?.[`participant${number}`]?.college}
        staticLabel
        uiVariant="premium"
        required
      />
      <Input
        icon={GraduationCap}
        participant={`participant${number}`}
        field="branch"
        label="Branch"
        value={formData[`participant${number}`].branch}
        onChange={onInputChange}
        options={BRANCH_OPTIONS}
        error={errors?.[`participant${number}`]?.branch}
        staticLabel
        uiVariant="premium"
        required
      />
      <Input
        icon={Phone}
        participant={`participant${number}`}
        field="phone"
        label="Phone Number"
        value={formData[`participant${number}`].phone}
        onChange={onInputChange}
        error={errors?.[`participant${number}`]?.phone}
        staticLabel
        uiVariant="premium"
        required
      />
      <Input
        icon={Hash}
        participant={`participant${number}`}
        field="rollNumber"
        label="Roll Number"
        value={formData[`participant${number}`].rollNumber}
        onChange={onInputChange}
        error={errors?.[`participant${number}`]?.rollNumber}
        staticLabel
        uiVariant="premium"
        required
      />
      <Input
        icon={Calendar}
        participant={`participant${number}`}
        field="year"
        label="Year"
        value={formData[`participant${number}`].year}
        onChange={onInputChange}
        options={YEAR_OPTIONS}
        error={errors?.[`participant${number}`]?.year}
        staticLabel
        uiVariant="premium"
        required
      />
    </div>
  </div>
);

const DecipherRegistration = () => {
  const navigate = useNavigate();

  const initialFormState = {
    participant1: {
      name: '',
      email: '',
      college: '',
      otherCollegeName: '', // Added for "Other" college option
      branch: '',
      phone: '',
      rollNumber: '',
      year: ''
    },
    participant2: {
      name: '',
      email: '',
      college: '',
      otherCollegeName: '', // Added for "Other" college option
      branch: '',
      phone: '',
      rollNumber: '',
      year: ''
    }
  };

  const [formData, setFormData] = useState(initialFormState);
  const [teamType, setTeamType] = useState('solo');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const savedData = localStorage.getItem('decipher_participant1Data');
    const participant2Data = localStorage.getItem('decipher_participant2Data');
    const registrationStatus = localStorage.getItem('registeredForDecipher');
    const savedTeamType = localStorage.getItem('decipherTeamType');

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // Determine if the saved college was from "Other" option
        let collegeValue = parsedData.college || '';
        let otherCollegeName = '';

        // If the saved college is not in the predefined options, it was entered as "Other"
        if (parsedData.college && !COLLEGE_OPTIONS.includes(parsedData.college)) {
          collegeValue = 'Other';
          otherCollegeName = parsedData.college;
        }

        setFormData(prev => ({
          ...prev,
          participant1: {
            ...parsedData,
            college: collegeValue,
            otherCollegeName: otherCollegeName
          }
        }));
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }

    if (participant2Data) {
      try {
        const parsedData = JSON.parse(participant2Data);

        let collegeValue = parsedData.college || '';
        let otherCollegeName = '';

        if (parsedData.college && !COLLEGE_OPTIONS.includes(parsedData.college)) {
          collegeValue = 'Other';
          otherCollegeName = parsedData.college;
        }

        setFormData(prev => ({
          ...prev,
          participant2: {
            ...parsedData,
            college: collegeValue,
            otherCollegeName: otherCollegeName
          }
        }));
      } catch (e) {
        console.error('Error parsing saved data:', e);
      }
    }

    if (savedTeamType) {
      setTeamType(savedTeamType);
    } else if (participant2Data) {
      setTeamType('duo');
    }

    setIsRegistered(registrationStatus === 'true');
  }, []);

  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL_DECIPHER;

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    const participantsToValidate = teamType === 'duo'
      ? ['participant1', 'participant2']
      : ['participant1'];

    participantsToValidate.forEach(participant => {
      errors[participant] = {};

      if (!validatePhone(formData[participant].phone)) {
        errors[participant].phone = 'Please enter a valid 10-digit phone number';
        isValid = false;
      }

      if (!validateEmail(formData[participant].email)) {
        errors[participant].email = 'Please enter a valid email address';
        isValid = false;
      }

      if (!formData[participant].college) {
        errors[participant].college = 'Please select your college';
        isValid = false;
      } else if (formData[participant].college === 'Other' && !formData[participant].otherCollegeName?.trim()) {
        errors[participant].college = 'Please enter your college name';
        isValid = false;
      }
    });

    // Additional validation for duo teams to ensure different participants
    if (teamType === 'duo') {
      const p1 = formData.participant1;
      const p2 = formData.participant2;

      // Check if both participants have the same email
      if (p1.email.toLowerCase() === p2.email.toLowerCase()) {
        errors.participant2 = {
          ...errors.participant2,
          email: "Participant 2 must have a different email address from Participant 1"
        };
        isValid = false;
      }

      // Check if both participants have the same phone number
      if (p1.phone === p2.phone) {
        errors.participant2 = {
          ...errors.participant2,
          phone: "Participant 2 must have a different phone number from Participant 1"
        };
        isValid = false;
      }

      // Check if both participants have the same name
      if (p1.name.toLowerCase().trim() === p2.name.toLowerCase().trim()) {
        errors.participant2 = {
          ...errors.participant2,
          name: "Participant 2 must have a different name from Participant 1"
        };
        isValid = false;
      }
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
      // Check if user has already registered for Decipher using the same email
      const decipherQuery = query(collection(db, "decipherTeams"));
      const querySnapshot = await getDocs(decipherQuery);
      
      for (const doc of querySnapshot.docs) {
        const existingParticipants = doc.data().participants;
        const hasExistingRegistration = existingParticipants.some(existingParticipant => 
          existingParticipant.email === formData.participant1.email ||
          (teamType === 'duo' && existingParticipant.email === formData.participant2.email)
        );
        
        if (hasExistingRegistration) {
          setLoading(false);
          setError("You have already registered for Decipher with this email. You cannot register for the same event twice.");
          return;
        }
      }

      const participantsToSave = teamType === 'duo'
        ? ['participant1', 'participant2']
        : ['participant1'];

      const participants = participantsToSave.map((participant) => {
        const data = formData[participant];
        return {
          name: data.name,
          email: data.email,
          college: data.college === 'Other' ? data.otherCollegeName : data.college,
          branch: data.branch,
          phone: data.phone,
          rollNumber: data.rollNumber,
          year: data.year,
        };
      });

      // Generate a simple ID for tracking (without Firebase Auth)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const teamData = {
        teamType,
        participants,
        teamSize: participants.length,
        timestamp: new Date(),
        userId: userId // Simple generated ID instead of Firebase Auth UID
      };

      await addDoc(collection(db, "decipherTeams"), teamData);

      // Track the registration for statistics
      try {
        await registrationTracker.trackRegistration("decipher", formData.participant1.college);
      } catch (trackingError) {
        console.error("Error tracking registration:", trackingError);
        // Don't fail the registration if tracking fails
      }

      // Prepare data for storage, handling "Other" college option
      const participant1DataToSave = {
        ...formData.participant1,
        college: formData.participant1.college === 'Other' ? formData.participant1.otherCollegeName : formData.participant1.college
      };

      localStorage.setItem('decipher_participant1Data', JSON.stringify(participant1DataToSave));
      if (teamType === 'duo') {
        const participant2DataToSave = {
          ...formData.participant2,
          college: formData.participant2.college === 'Other' ? formData.participant2.otherCollegeName : formData.participant2.college
        };
        localStorage.setItem('decipher_participant2Data', JSON.stringify(participant2DataToSave));
      } else {
        localStorage.removeItem('decipher_participant2Data');
      }
      localStorage.setItem('decipherTeamType', teamType);
      localStorage.setItem('registeredForDecipher', 'true');
      setSuccess(true);
      setIsRegistered(true);
      setFormData(initialFormState);
      setTeamType('solo');
    } catch (err) {
      console.error('Registration error:', err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (participant, field, value) => {
    setFormData(prev => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        [field]: value
      }
    }));

    setValidationErrors(prev => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        [field]: undefined
      }
    }));
  };

  const handleTeamTypeChange = (value) => {
    setTeamType(value);
    setValidationErrors({});
  };

  const handleRegisterAnother = () => {
    localStorage.removeItem('registeredForDecipher');
    localStorage.removeItem('decipher_participant1Data');
    localStorage.removeItem('decipher_participant2Data');
    localStorage.removeItem('decipherTeamType');
    setIsRegistered(false);
    setSuccess(false);
    setFormData(initialFormState);
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen font-sora px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <PostRegistrationOptions onRegisterAnother={handleRegisterAnother} eventType="decipher" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sora px-6 py-10">
      <div className={`${teamType === 'duo' ? 'max-w-6xl' : 'max-w-4xl'} mx-auto`}>
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-3">
            <img src="/LogoCOSC.svg" alt="COSC" className="h-8 sm:h-10" />
            <span className="text-white/40">|</span>
            <img src="/logo4x.png" alt="OpenSys" className="h-8 sm:h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Decipher
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Race against time to break ciphers, solve hidden puzzles, and decode your way to victory.          </p>
        </div>

        <div className="rounded-[22px] border border-violet-400/20 bg-white/[0.05] shadow-lg md:shadow-[0_20px_50px_rgba(7,2,15,0.45)] backdrop-blur-sm md:backdrop-blur-[18px]">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-10">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-violet-300/80 font-semibold">
                Team Type
              </p>
              <div className="relative grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
                <span
                  className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-violet-500/40 to-fuchsia-500/30 transition-transform duration-300 ${teamType === 'duo' ? 'translate-x-full' : 'translate-x-0'}`}
                />
                <button
                  type="button"
                  onClick={() => handleTeamTypeChange('solo')}
                  className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${teamType === 'solo' ? 'text-white' : 'text-white/60'}`}
                >
                  Solo
                </button>
                <button
                  type="button"
                  onClick={() => handleTeamTypeChange('duo')}
                  className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${teamType === 'duo' ? 'text-white' : 'text-white/60'}`}
                >
                  Duo
                </button>
              </div>
            </div>

            {teamType === 'duo' ? (
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="hidden md:block absolute left-1/2 top-3 h-[calc(100%-24px)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-violet-400/25 to-transparent" />
                <ParticipantFields
                  number={1}
                  title="Participant 1"
                  formData={formData}
                  onInputChange={handleInputChange}
                  errors={validationErrors}
                />
                <ParticipantFields
                  number={2}
                  title="Participant 2"
                  formData={formData}
                  onInputChange={handleInputChange}
                  errors={validationErrors}
                />
              </div>
            ) : (
              <ParticipantFields
                number={1}
                title="Participant"
                formData={formData}
                onInputChange={handleInputChange}
                errors={validationErrors}
              />
            )}

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
    </div>
  );
};

export default DecipherRegistration;