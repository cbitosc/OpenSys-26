import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Phone, GraduationCap, Calendar, Hash, AlertTriangle } from "lucide-react";
import {
  db,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "../../firebase/firebaseConfig";
import registrationTracker from "../../firebase/registrationTracker";
import {
  validatePhone,
  validateEmail,
  BRANCH_OPTIONS,
  COLLEGE_OPTIONS,
  YEAR_OPTIONS,
  getFirebaseErrorMessage,
} from "../../utils/validation";
import Input from "../Input";
import PostRegistrationOptions from "../PostRegistrationOptions";

const GitarcanaRegistration = () => {
  const navigate = useNavigate();

  const createParticipant = () => ({
    name: "",
    email: "",
    college: "",
    otherCollegeName: "",
    branch: "",
    phone: "",
    rollNumber: "",
    year: "",
  });

  const initialFormState = {
    participant1: createParticipant(),
    participant2: createParticipant(),
  };

  const [formData, setFormData] = useState(initialFormState);
  const [teamType, setTeamType] = useState("solo");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const loadSavedData = () => {
      // Use event-specific localStorage keys to prevent conflicts with other events
      const participant1Data = localStorage.getItem("gitarcana_participant1Data");
      const participant2Data = localStorage.getItem("gitarcana_participant2Data");
      const savedTeamType = localStorage.getItem("gitarcanaTeamType");

      try {
        if (participant1Data) {
          const p1Data = JSON.parse(participant1Data);

          let collegeValue = p1Data.college || "";
          let otherCollegeName = "";

          if (p1Data.college && !COLLEGE_OPTIONS.includes(p1Data.college)) {
            collegeValue = "Other";
            otherCollegeName = p1Data.college;
          }

          setFormData((prevData) => ({
            ...prevData,
            participant1: {
              ...prevData.participant1,
              name: p1Data.name || "",
              email: p1Data.email || "",
              college: collegeValue,
              otherCollegeName: otherCollegeName,
              branch: p1Data.branch || "",
              phone: p1Data.phone || "",
              rollNumber: p1Data.rollNumber || "",
              year: p1Data.year || "",
            },
          }));
        }

        if (participant2Data) {
          const p2Data = JSON.parse(participant2Data);

          let collegeValue = p2Data.college || "";
          let otherCollegeName = "";

          if (p2Data.college && !COLLEGE_OPTIONS.includes(p2Data.college)) {
            collegeValue = "Other";
            otherCollegeName = p2Data.college;
          }

          setFormData((prevData) => ({
            ...prevData,
            participant2: {
              ...prevData.participant2,
              name: p2Data.name || "",
              email: p2Data.email || "",
              college: collegeValue,
              otherCollegeName: otherCollegeName,
              branch: p2Data.branch || "",
              phone: p2Data.phone || "",
              rollNumber: p2Data.rollNumber || "",
              year: p2Data.year || "",
            },
          }));
        }

        if (savedTeamType) {
          setTeamType(savedTeamType);
        } else if (participant2Data) {
          setTeamType("duo");
        }
      } catch (e) {
        console.error("Error parsing saved form data:", e);
      }
    };

    loadSavedData();
  }, []);

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    const participantsToValidate =
      teamType === "duo" ? ["participant1", "participant2"] : ["participant1"];

    participantsToValidate.forEach((participant) => {
      errors[participant] = {};

      if (!validatePhone(formData[participant].phone)) {
        errors[participant].phone = "Please enter a valid 10-digit phone number";
        isValid = false;
      }

      if (!validateEmail(formData[participant].email)) {
        errors[participant].email = "Please enter a valid email address";
        isValid = false;
      }

      if (!formData[participant].college) {
        errors[participant].college = "Please select your college";
        isValid = false;
      } else if (
        formData[participant].college === "Other" &&
        !formData[participant].otherCollegeName?.trim()
      ) {
        errors[participant].college = "Please enter your college name";
        isValid = false;
      }
    });

    // Additional validation for duo teams to ensure different participants
    if (teamType === "duo") {
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
    setError("");

    if (!validateForm()) {
      setError("Please fix the validation errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Check if user has already registered for Git Arcana using the same email
      const gitArcanaQuery = query(collection(db, "gitarcanaParticipants"));
      const querySnapshot = await getDocs(gitArcanaQuery);
      
      for (const doc of querySnapshot.docs) {
        const existingParticipants = doc.data().participants;
        const hasExistingRegistration = existingParticipants.some(existingParticipant => 
          existingParticipant.email === formData.participant1.email ||
          (teamType === "duo" && existingParticipant.email === formData.participant2.email)
        );
        
        if (hasExistingRegistration) {
          setLoading(false);
          setError("You have already registered for Git Arcana with this email. You cannot register for the same event twice.");
          return;
        }
      }

      const participantsToSave =
        teamType === "duo" ? ["participant1", "participant2"] : ["participant1"];

      const participants = participantsToSave.map((participant) => {
        const data = formData[participant];
        return {
          name: data.name,
          email: data.email,
          college: data.college === "Other" ? data.otherCollegeName : data.college,
          branch: data.branch,
          phone: data.phone,
          rollNumber: data.rollNumber,
          year: data.year,
        };
      });

      // Generate a simple ID for tracking (without Firebase Auth)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const participantData = {
        teamType,
        participants,
        teamSize: participants.length,
        timestamp: new Date(),
        userId: userId // Simple generated ID instead of Firebase Auth UID
      };

      await addDoc(collection(db, "gitarcanaParticipants"), participantData);

      // Track the registration for statistics
      try {
        await registrationTracker.trackRegistration("gitarcana", formData.participant1.college);
      } catch (trackingError) {
        console.error("Error tracking registration:", trackingError);
        // Don't fail the registration if tracking fails
      }

      // Use event-specific localStorage keys to prevent conflicts with other events
      localStorage.setItem("gitarcana_participant1Data", JSON.stringify(participants[0]));
      if (teamType === "duo" && participants[1]) {
        localStorage.setItem("gitarcana_participant2Data", JSON.stringify(participants[1]));
      } else {
        localStorage.removeItem("gitarcana_participant2Data");
      }
      localStorage.setItem("gitarcanaTeamType", teamType);
      localStorage.setItem("registeredForGitarcana", "true");

      setSuccess(true);
      setFormData(initialFormState);
      setTeamType("solo");
    } catch (err) {
      console.error("Registration error:", err);
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (participant, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        [field]: value,
      },
    }));

    setValidationErrors((prev) => ({
      ...prev,
      [participant]: {
        ...prev[participant],
        [field]: undefined,
      },
    }));
  };

  const handleTeamTypeChange = (value) => {
    setTeamType(value);
    setValidationErrors({});
  };

  const handleSignOut = async () => {
    // Use event-specific localStorage keys to prevent conflicts with other events
    localStorage.removeItem("gitarcana_participant1Data");
    localStorage.removeItem("gitarcana_participant2Data");
    localStorage.removeItem("gitarcanaTeamType");
    localStorage.removeItem("registeredForGitarcana");
    setSuccess(false);
    setFormData(initialFormState);
    setTeamType("solo");
    navigate("/");
  };

  if (success) {
    return (
      <div className="min-h-screen font-sora px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <PostRegistrationOptions onRegisterAnother={handleSignOut} eventType="gitarcana" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sora px-6 py-10">
      <div className={`${teamType === "duo" ? "max-w-7xl" : "max-w-4xl"} mx-auto w-full`}>
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-3">
            <img src="/LogoCOSC.svg" alt="COSC" className="h-8 sm:h-10" />
            <span className="text-white/40">|</span>
            <img src="/logo4x.png" alt="OpenSys" className="h-8 sm:h-10" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">Git Arcana</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Decode the repository and uncover the hidden secret.
          </p>
        </div>

        <div className="w-full rounded-[22px] border border-violet-400/20 bg-white/[0.05] shadow-lg md:shadow-[0_20px_50px_rgba(7,2,15,0.45)] backdrop-blur-sm md:backdrop-blur-[18px]">
          <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-10">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-widest text-violet-300/80 font-semibold">
                Team Type
              </p>
              <div className="relative grid grid-cols-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
                <span
                  className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-violet-500/40 to-fuchsia-500/30 transition-transform duration-300 ${teamType === "duo" ? "translate-x-full" : "translate-x-0"}`}
                />
                <button
                  type="button"
                  onClick={() => handleTeamTypeChange("solo")}
                  className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${teamType === "solo" ? "text-white" : "text-white/60"}`}
                >
                  Solo
                </button>
                <button
                  type="button"
                  onClick={() => handleTeamTypeChange("duo")}
                  className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${teamType === "duo" ? "text-white" : "text-white/60"}`}
                >
                  Duo
                </button>
              </div>
            </div>

            {teamType === "duo" ? (
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="hidden md:block absolute left-1/2 top-3 h-[calc(100%-24px)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-violet-400/20 to-transparent" />
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-wider text-violet-200">
                    Participant 1
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      icon={User}
                      participant="participant1"
                      field="name"
                      label="Full Name"
                      value={formData.participant1.name}
                      onChange={handleInputChange}
                      error={validationErrors?.participant1?.name}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={Mail}
                      participant="participant1"
                      field="email"
                      label="Email"
                      type="email"
                      value={formData.participant1.email}
                      onChange={handleInputChange}
                      error={validationErrors?.participant1?.email}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={GraduationCap}
                      participant="participant1"
                      field="college"
                      label="College"
                      value={formData.participant1.college}
                      onChange={handleInputChange}
                      formData={formData.participant1}
                      options={COLLEGE_OPTIONS}
                      isCheckbox={false}
                      error={validationErrors?.participant1?.college}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={GraduationCap}
                      participant="participant1"
                      field="branch"
                      label="Branch"
                      value={formData.participant1.branch}
                      onChange={handleInputChange}
                      options={BRANCH_OPTIONS}
                      error={validationErrors?.participant1?.branch}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={Phone}
                      participant="participant1"
                      field="phone"
                      label="Phone Number"
                      value={formData.participant1.phone}
                      onChange={handleInputChange}
                      error={validationErrors?.participant1?.phone}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={Hash}
                      participant="participant1"
                      field="rollNumber"
                      label="Roll Number"
                      value={formData.participant1.rollNumber}
                      onChange={handleInputChange}
                      error={validationErrors?.participant1?.rollNumber}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={Calendar}
                      participant="participant1"
                      field="year"
                      label="Year"
                      value={formData.participant1.year}
                      onChange={handleInputChange}
                      options={YEAR_OPTIONS}
                      error={validationErrors?.participant1?.year}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-wider text-violet-200">
                    Participant 2
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      icon={User}
                      participant="participant2"
                      field="name"
                      label="Full Name"
                      value={formData.participant2.name}
                      onChange={handleInputChange}
                      error={validationErrors?.participant2?.name}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={Mail}
                      participant="participant2"
                      field="email"
                      label="Email"
                      type="email"
                      value={formData.participant2.email}
                      onChange={handleInputChange}
                      error={validationErrors?.participant2?.email}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={GraduationCap}
                      participant="participant2"
                      field="college"
                      label="College"
                      value={formData.participant2.college}
                      onChange={handleInputChange}
                      formData={formData.participant2}
                      options={COLLEGE_OPTIONS}
                      isCheckbox={false}
                      error={validationErrors?.participant2?.college}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={GraduationCap}
                      participant="participant2"
                      field="branch"
                      label="Branch"
                      value={formData.participant2.branch}
                      onChange={handleInputChange}
                      options={BRANCH_OPTIONS}
                      error={validationErrors?.participant2?.branch}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={Phone}
                      participant="participant2"
                      field="phone"
                      label="Phone Number"
                      value={formData.participant2.phone}
                      onChange={handleInputChange}
                      error={validationErrors?.participant2?.phone}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={Hash}
                      participant="participant2"
                      field="rollNumber"
                      label="Roll Number"
                      value={formData.participant2.rollNumber}
                      onChange={handleInputChange}
                      error={validationErrors?.participant2?.rollNumber}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                    <Input
                      icon={Calendar}
                      participant="participant2"
                      field="year"
                      label="Year"
                      value={formData.participant2.year}
                      onChange={handleInputChange}
                      options={YEAR_OPTIONS}
                      error={validationErrors?.participant2?.year}
                      staticLabel
                      uiVariant="premium"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-violet-200">
                  Participant
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    icon={User}
                    participant="participant1"
                    field="name"
                    label="Full Name"
                    value={formData.participant1.name}
                    onChange={handleInputChange}
                    error={validationErrors?.participant1?.name}
                    staticLabel
                    uiVariant="premium"
                    required
                  />
                  <Input
                    icon={Mail}
                    participant="participant1"
                    field="email"
                    label="Email"
                    type="email"
                    value={formData.participant1.email}
                    onChange={handleInputChange}
                    error={validationErrors?.participant1?.email}
                    staticLabel
                    uiVariant="premium"
                    required
                  />
                  <Input
                    icon={GraduationCap}
                    participant="participant1"
                    field="college"
                    label="College"
                    value={formData.participant1.college}
                    onChange={handleInputChange}
                    formData={formData.participant1}
                    options={COLLEGE_OPTIONS}
                    isCheckbox={false}
                    error={validationErrors?.participant1?.college}
                    staticLabel
                    uiVariant="premium"
                    required
                  />
                  <Input
                    icon={GraduationCap}
                    participant="participant1"
                    field="branch"
                    label="Branch"
                    value={formData.participant1.branch}
                    onChange={handleInputChange}
                    options={BRANCH_OPTIONS}
                    error={validationErrors?.participant1?.branch}
                    staticLabel
                    uiVariant="premium"
                    required
                  />
                  <Input
                    icon={Phone}
                    participant="participant1"
                    field="phone"
                    label="Phone Number"
                    value={formData.participant1.phone}
                    onChange={handleInputChange}
                    error={validationErrors?.participant1?.phone}
                    staticLabel
                    uiVariant="premium"
                    required
                  />
                  <Input
                    icon={Hash}
                    participant="participant1"
                    field="rollNumber"
                    label="Roll Number"
                    value={formData.participant1.rollNumber}
                    onChange={handleInputChange}
                    error={validationErrors?.participant1?.rollNumber}
                    staticLabel
                    uiVariant="premium"
                    required
                  />
                  <Input
                    icon={Calendar}
                    participant="participant1"
                    field="year"
                    label="Year"
                    value={formData.participant1.year}
                    onChange={handleInputChange}
                    options={YEAR_OPTIONS}
                    error={validationErrors?.participant1?.year}
                    staticLabel
                    uiVariant="premium"
                    required
                  />
                </div>
              </div>
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
              className={`btn-primary w-full py-3.5 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
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

export default GitarcanaRegistration;
