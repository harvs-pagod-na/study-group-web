import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signup({ onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Save user profile to Firestore
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        createdAt: new Date()
      });

      alert("Signup successful!");
      onSignup();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Email:</label>
        <input
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 font-medium text-gray-700">Password:</label>
        <input
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button
        className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        onClick={signup}
      >
        Create Account
      </button>
    </div>
  );
}
