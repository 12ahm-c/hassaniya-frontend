import React, { useState } from "react";
import { deleteSentence, updateSentence } from "../api/sentenceApi";

const SentenceRow = ({ sentence, refreshTrigger }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hassaniya, setHassaniya] = useState(sentence.hassaniya);
  const [arabic, setArabic] = useState(sentence.arabic);

  const handleDelete = async () => {
    if (window.confirm("هل تريد حذف هذه الجملة؟")) {
      await deleteSentence(sentence._id);
      refreshTrigger();
    }
  };

  const handleUpdate = async () => {
    await updateSentence(sentence._id, { hassaniya, arabic });
    setIsEditing(false);
    refreshTrigger();
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input value={hassaniya} onChange={(e) => setHassaniya(e.target.value)} />
        ) : (
          sentence.hassaniya
        )}
      </td>
      <td>
        {isEditing ? (
          <input value={arabic} onChange={(e) => setArabic(e.target.value)} />
        ) : (
          sentence.arabic
        )}
      </td>
      <td>{new Date(sentence.createdAt).toLocaleString()}</td>
      <td>
        {isEditing ? (
          <>
            <button onClick={handleUpdate}>حفظ</button>
            <button onClick={() => setIsEditing(false)}>إلغاء</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>✏️</button>
            <button onClick={handleDelete}>🗑️</button>
          </>
        )}
      </td>
    </tr>
  );
};

export default SentenceRow;