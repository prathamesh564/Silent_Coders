"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StudentRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    usn: "",
    name: "",
    branch: "",
    stream: "",
    college: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      ...formData,
      usn: formData.usn.trim(),
      name: formData.name.trim(),
      branch: formData.branch.trim(),
      stream: formData.stream.trim(),
      college: formData.college.trim(),
      phoneNumber: formData.phoneNumber.trim(),
    };

    if (
      !cleanedData.usn ||
      !cleanedData.name ||
      !cleanedData.branch ||
      !cleanedData.stream ||
      !cleanedData.college ||
      !cleanedData.phoneNumber ||
      !cleanedData.password
    ) {
      alert("All fields are required!");
      return;
    }

    if (cleanedData.password !== cleanedData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!/^[0-9]{10}$/.test(cleanedData.phoneNumber)) {
      alert("Enter valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace this with Firebase / backend logic
      console.log("Student Data:", cleanedData);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Registration Successful!");
      router.push("/Students/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 border border-blue-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-950">
            Student Registration
          </h1>
          <p className="text-gray-500 mt-2">
            Join the platform to track your quiz performance
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* USN */}
          <Input
            label="USN"
            name="usn"
            placeholder="1DS22CS001"
            value={formData.usn}
            onChange={handleChange}
          />

          {/* Name */}
          <Input
            label="Full Name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />

          {/* College */}
          <div className="md:col-span-2">
            <Input
              label="College Name"
              name="college"
              placeholder="Institute of Technology..."
              value={formData.college}
              onChange={handleChange}
            />
          </div>

          {/* Stream */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stream
            </label>
            <select
              name="stream"
              required
              value={formData.stream}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Stream</option>
              <option value="BE/B.Tech">B.E / B.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="M.Tech">M.Tech</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Branch */}
          <Input
            label="Branch"
            name="branch"
            placeholder="CSE, ECE..."
            value={formData.branch}
            onChange={handleChange}
          />

          {/* Phone */}
          <div className="md:col-span-2">
            <Input
              label="Phone Number"
              name="phoneNumber"
              placeholder="9999999999"
              value={formData.phoneNumber}
              onChange={handleChange}
              type="tel"
            />
          </div>

          {/* Password */}
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* Confirm Password */}
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          {/* Submit */}
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-700 text-white font-bold py-3 rounded-xl transition-transform ${
                loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-green-800 hover:scale-[0.99]"
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/Students/login"
            className="text-blue-700 font-semibold hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
