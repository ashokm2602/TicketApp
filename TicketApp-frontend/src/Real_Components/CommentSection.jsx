// 🔥 CommentSection.jsx — Redux-Aware Display Component (Step 5 of 8)
// MODE A — Simple display: parent passes comments, loading, and error.
// This component does NOT dispatch Redux actions. That is handled in dashboards.

import React, { useState } from "react";

export default function CommentSection({ ticket, comments, loading, error, onComment }) {
  const [text, setText] = useState("");

  return (
    <div className="mt-3">
      {/* Loading Indicator */}
      {loading && (
        <div className="text-blue-600 text-xs mb-2">Loading comments...</div>
      )}

      {/* Error Indicator */}
      {error && (
        <div className="text-red-600 text-xs mb-2">{error}</div>
      )}

      {/* Comments List */}
      <div className="space-y-2">
        {(comments || []).map((c, idx) => (
          <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
            <div className="font-semibold text-xs">
              {c.createdByName || c.by || "User"}
              <span className="text-gray-400"> • {c.createdAt || c.time}</span>
            </div>
            <div className="text-gray-700">{c.commentText || c.text}</div>
          </div>
        ))}

        {comments?.length === 0 && !loading && (
          <div className="text-xs text-gray-500">No comments yet.</div>
        )}
      </div>

      {/* Add Comment Input */}
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded px-2 py-1"
        />

        <button
          onClick={() => {
            if (!text.trim()) return;
            onComment(text);
            setText("");
          }}
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          Comment
        </button>
      </div>
    </div>
  );
}