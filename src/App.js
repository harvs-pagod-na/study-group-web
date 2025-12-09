import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import Signup from "./components/Signup";
import Login from "./components/Login";
import CreateGroup from "./components/CreateGroup";
import GroupList from "./components/GroupList";
import { signOut } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "my" | "create"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return unsub;
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
          {showSignup ? (
            <>
              <Signup onSignup={() => setShowSignup(false)} />
              <p className="mt-4 text-sm text-gray-500">
                Already have an account?{" "}
                <button className="text-indigo-600 hover:underline" onClick={() => setShowSignup(false)}>Login</button>
              </p>
            </>
          ) : (
            <>
              <Login onLogin={() => {}} />
              <p className="mt-4 text-sm text-gray-500">
                No account?{" "}
                <button className="text-indigo-600 hover:underline" onClick={() => setShowSignup(true)}>Sign Up</button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 text-2xl font-bold text-gray-800">
              Study Group Finder
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              <button
                className={`px-3 py-2 rounded-md font-medium ${activeTab === "all" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setActiveTab("all")}
              >
                All Groups
              </button>
              <button
                className={`px-3 py-2 rounded-md font-medium ${activeTab === "my" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setActiveTab("my")}
              >
                My Groups
              </button>
              <button
                className={`px-3 py-2 rounded-md font-medium ${activeTab === "create" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setActiveTab("create")}
              >
                Create Group
              </button>
              <button
                onClick={() => signOut(auth)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
              >
                Logout
              </button>
            </div>
            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
            <button className={`block w-full text-left px-3 py-2 rounded-md ${activeTab === "all" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`} onClick={() => {setActiveTab("all"); setMobileMenuOpen(false)}}>All Groups</button>
            <button className={`block w-full text-left px-3 py-2 rounded-md ${activeTab === "my" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`} onClick={() => {setActiveTab("my"); setMobileMenuOpen(false)}}>My Groups</button>
            <button className={`block w-full text-left px-3 py-2 rounded-md ${activeTab === "create" ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-200"}`} onClick={() => {setActiveTab("create"); setMobileMenuOpen(false)}}>Create Group</button>
            <button onClick={() => signOut(auth)} className="block w-full text-left px-3 py-2 bg-red-500 text-white rounded-md">Logout</button>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-6xl mx-auto p-4 space-y-6">
        {activeTab === "all" && <GroupList showOnlyMyGroups={false} />}
        {activeTab === "my" && <GroupList showOnlyMyGroups={true} />}
        {activeTab === "create" && <CreateGroup />}
      </main>
    </div>
  );
}
