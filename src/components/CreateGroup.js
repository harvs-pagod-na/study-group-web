import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const createGroup = async () => {
    if (!groupName || !subject || !description) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "studyGroups"), {
        groupName,
        subject,
        description,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
        members: [auth.currentUser.uid],
      });

      setGroupName("");
      setSubject("");
      setDescription("");
      alert("Group created successfully!");
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Create Study Group</h2>
      <input
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <input
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      <textarea
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        onClick={createGroup}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
      >
        Create Group
      </button>
    </div>
  );
}
