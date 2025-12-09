import React, { useState } from "react";
import { addSentence } from "./api/sentenceApi";

const SentenceForm = ({ refreshTrigger }) => {
  const [hassaniya, setHassaniya] = useState("");
  const [arabic, setArabic] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hassaniya || !arabic) return;
    try {
      await addSentence({ hassaniya, arabic });
      setHassaniya("");
      setArabic("");
      refreshTrigger();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="sentence-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="الجملة الحسانية"
        value={hassaniya}
        onChange={(e) => setHassaniya(e.target.value)}
      />
      <input
        type="text"
        placeholder="المرادف بالعربية"
        value={arabic}
        onChange={(e) => setArabic(e.target.value)}
      />
      <button type="submit">إضافة</button>
    </form>
  );
};

export default SentenceForm;