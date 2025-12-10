// 🔥 CreateTicketForm.jsx – Full UX Validation (Step 6 of 8)
// Mode C: validation, disabled button, red borders, inline helper text.

import React, { useState } from "react";

export default function CreateTicketForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [touched, setTouched] = useState({ title: false, desc: false });

  const isTitleValid = title.trim().length > 0;
  const isDescValid = desc.trim().length > 0;
  const formValid = isTitleValid && isDescValid;

  const handleSubmit = () => {
    if (!formValid) return;
    onCreate({ title, description: desc });
    setTitle("");
    setDesc("");
    setTouched({ title: false, desc: false });
  };

  return (
    <div className="space-y-3">
      {/* Title Field */}
      <div>
        <input
          className={`w-full border rounded px-3 py-2 ${touched.title && !isTitleValid ? "border-red-500" : "border-gray-300"}`}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
        />
        {touched.title && !isTitleValid && (
          <p className="text-xs text-red-600 mt-1">A title is required.</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <textarea
          className={`w-full border rounded px-3 py-2 ${touched.desc && !isDescValid ? "border-red-500" : "border-gray-300"}`}
          placeholder="Description"
          rows={4}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, desc: true }))}
        />
        {touched.desc && !isDescValid && (
          <p className="text-xs text-red-600 mt-1">Please enter a description.</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!formValid}
          className={`px-4 py-2 rounded text-white transition ${
            formValid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Create Ticket
        </button>
      </div>
    </div>
  );
}