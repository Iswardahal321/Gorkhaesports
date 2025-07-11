// src/pages/UploadResult.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const UploadResult = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState([]);
  const [popupImage, setPopupImage] = useState(null);
  const [winners, setWinners] = useState({
    first: "",
    second: "",
    third: "",
    fourth: "",
    fifth: "",
  });

  const API_KEY = process.env.REACT_APP_IMGBB_API_KEY;

  const fetchResults = async () => {
    const snap = await getDocs(collection(db, "results"));
    const resultData = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setResults(resultData);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!image) return setMessage("❌ Please select an image.");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${API_KEY}`,
        formData
      );

      const url = res.data.data.url;

      await addDoc(collection(db, "results"), {
        imageUrl: url,
        winners,
        createdAt: new Date(),
      });

      setImage(null);
      setWinners({ first: "", second: "", third: "", fourth: "", fifth: "" });
      setMessage("✅ Image uploaded successfully!");
      fetchResults();
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "results", id));
    fetchResults();
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">📸 Upload Result Image</h2>
      <form onSubmit={handleImageUpload} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border rounded"
          required
        />

        {/* Winner Team Inputs */}
        {["first", "second", "third", "fourth", "fifth"].map((place, idx) => (
          <input
            key={place}
            type="text"
            placeholder={`${idx + 1}st Place Team`}
            value={winners[place]}
            onChange={(e) =>
              setWinners({ ...winners, [place]: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        ))}

        {message && (
          <p
            className={`text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Upload
        </button>
      </form>

      {/* Results List */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">🖼️ Uploaded Results</h3>
        {results.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded mb-4 bg-white shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">🖼️ Image:</span>
              <button
                onClick={() => setPopupImage(item.imageUrl)}
                className="text-blue-600 underline"
              >
                View
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 ml-3"
              >
                Delete
              </button>
            </div>
            <div className="text-sm text-gray-700 space-y-1 mt-2">
              <p>🥇 1st: {item.winners.first}</p>
              <p>🥈 2nd: {item.winners.second}</p>
              <p>🥉 3rd: {item.winners.third}</p>
              <p>🏅 4th: {item.winners.fourth}</p>
              <p>🎖️ 5th: {item.winners.fifth}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Popup View */}
      {popupImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setPopupImage(null)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ×
            </button>
            <img
              src={popupImage}
              alt="Result"
              className="max-h-[80vh] max-w-[90vw] rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadResult;
