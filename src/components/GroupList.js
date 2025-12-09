import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  deleteDoc
} from "firebase/firestore";

export default function GroupList({ showOnlyMyGroups = false }) {
  const [groups, setGroups] = useState([]);
  const [membersMap, setMembersMap] = useState({});

  const userId = auth.currentUser.uid;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "studyGroups"), async (snapshot) => {
      let groupsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter to only my groups if prop is true
      if (showOnlyMyGroups) {
        groupsData = groupsData.filter(g => g.members?.includes(userId));
      }

      setGroups(groupsData);

      // Build member UID → email map
      const allMemberIds = [...new Set(groupsData.flatMap(g => g.members || []))];
      const map = {};
      await Promise.all(
        allMemberIds.map(async (uid) => {
          const userDoc = await getDoc(doc(db, "users", uid));
          map[uid] = userDoc.exists() ? userDoc.data().email : "Unknown";
        })
      );
      setMembersMap(map);
    });

    return unsub;
  }, [showOnlyMyGroups]);

  // Join group
  const joinGroup = async (groupId) => {
    await updateDoc(doc(db, "studyGroups", groupId), {
      members: arrayUnion(userId)
    });
  };

  // Leave group
  const leaveGroup = async (groupId) => {
    await updateDoc(doc(db, "studyGroups", groupId), {
      members: arrayRemove(userId)
    });
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteDoc(doc(db, "studyGroups", groupId));
      alert("Group deleted successfully!");
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group.");
    }
  };

  return (
    <div className="space-y-4">
      {groups.length === 0 && (
        <p className="text-gray-500 text-center">No groups found.</p>
      )}

      {groups.map((g) => {
        const isMember = g.members?.includes(userId);
        const isCreator = g.createdBy === userId;

        return (
          <div
            key={g.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{g.groupName}</h3>
              <p className="text-gray-600"><b>Subject:</b> {g.subject}</p>
              <p className="text-gray-600">{g.description}</p>
              <p className="text-gray-500 text-sm">
                <b>Members:</b> {g.members?.map(uid => membersMap[uid] || uid).join(", ")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {isMember ? (
                <button
                  onClick={() => leaveGroup(g.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={() => joinGroup(g.id)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                >
                  Join
                </button>
              )}

              {isCreator && (
                <button
                  onClick={() => deleteGroup(g.id)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
