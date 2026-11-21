import { useState } from "react";
import { authApi } from "@/lib/api";

/** Turn the signed-in user (from the API) into the flat shape the profile form works with. */
export const formFromUser = (user) => ({
  firstName: user.profile?.firstName || "",
  lastName: user.profile?.lastName || "",
  username: user.profile?.username || "",
  dob: user.profile?.dob || "",
  gender: user.profile?.gender || "",
  phone: user.profile?.phone || "",
  email: user.email || "",
  location: user.profile?.location || "",
  address: user.profile?.address || "",
  internId: user.code || "",
  headline: user.profile?.headline || "",
  company: user.profile?.company || "",
  internshipStatus: user.status || "",
  internshipDuration: user.cohort || "",
  joinDate: user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "",
  bio: user.profile?.bio || "",
  careerInterests: user.profile?.careerInterests || "",
  areasOfInterest: user.profile?.areasOfInterest || "",
  professionalGoals: user.profile?.professionalGoals || "",
  linkedin: user.profile?.linkedin || "",
  github: user.profile?.github || "",
  portfolio: user.profile?.portfolio || "",
  website: user.profile?.website || "",
  otherLinks: user.profile?.otherLinks || [],
});

/** Only these fields are editable and stored; the rest (email, id, status, ...) come from the account. */
export const EDITABLE = [
  "firstName", "lastName", "username", "dob", "gender", "phone", "location", "address", "headline",
  "company", "bio", "careerInterests", "areasOfInterest", "professionalGoals", "linkedin", "github",
  "portfolio", "website", "otherLinks",
];

export function useProfileForm(user, onSaved, onError) {
  const [formData, setFormData] = useState(() => formFromUser(user));
  const [initialState, setInitialState] = useState(() => formFromUser(user));
  const [skills, setSkills] = useState(user.skills || []);
  const [initialSkills, setInitialSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [newProfessionalLink, setNewProfessionalLink] = useState({
    name: "",
    url: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (!skill || skills.includes(skill)) return;
    setSkills((prev) => [...prev, skill]);
    setNewSkill("");
  };

  const handleRemoveSkill = (skill) =>
    setSkills((prev) => prev.filter((item) => item !== skill));

  const handleProfessionalLinkChange = (field, value) =>
    setNewProfessionalLink((prev) => ({ ...prev, [field]: value }));

  const handleAddProfessionalLink = () => {
    const { name, url } = newProfessionalLink;
    if (!name.trim() || !url.trim()) return;
    setFormData((prev) => ({
      ...prev,
      otherLinks: [
        ...(prev.otherLinks || []),
        { name: name.trim(), url: url.trim() },
      ],
    }));
    setNewProfessionalLink({ name: "", url: "" });
  };

  const handleRemoveProfessionalLink = (index) =>
    setFormData((prev) => ({
      ...prev,
      otherLinks: prev.otherLinks.filter((_, idx) => idx !== index),
    }));

  const handleCancel = () => {
    setFormData(initialState);
    setSkills(initialSkills);
    setNewProfessionalLink({ name: "", url: "" });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const payload = Object.fromEntries(EDITABLE.map((key) => [key, formData[key]]));
    try {
      const updated = await authApi.updateProfile({ ...payload, skills });
      const next = formFromUser(updated);
      setFormData(next);
      setInitialState(next);
      setSkills(updated.skills || []);
      setInitialSkills(updated.skills || []);
      setNewProfessionalLink({ name: "", url: "" });
      setIsEditing(false);
      onSaved?.(updated);
    } catch (error) {
      onError?.(error);
    }
  };

  return {
    formData,
    skills,
    newSkill,
    setNewSkill,
    isEditing,
    setIsEditing,
    newProfessionalLink,
    handleChange,
    handleAddSkill,
    handleRemoveSkill,
    handleProfessionalLinkChange,
    handleAddProfessionalLink,
    handleRemoveProfessionalLink,
    handleCancel,
    handleSave,
  };
}
