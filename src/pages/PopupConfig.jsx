// 📁 src/pages/PopupConfig.jsx
import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function PopupConfig() {
  const [imageUrl, setImageUrl] = useState("");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      const docRef = doc(db, "popup_config", "global");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setImageUrl(snap.data().imageUrl || "");
        setActive(snap.data().active || false);
      }
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "popup_config", "global"), {
        imageUrl,
        active,
      });
      alert("✅ Saved Successfully");
    } catch (err) {
      alert("❌ Failed to Save");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">📢 Popup Config</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Popup Image URL</label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        <label className="font-medium">Enable Popup for Users</label>
      </div>

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Save
      </button>
    </div>
  );
}

export default PopupConfig;
