import React from "react";
import { formatQuestionText } from "@/lib/utils";

const arabicBlockRegex = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\u060C\u061B\u061F\u0640]+)/g;
const arabicTest = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function QuestionText({ text }: { text: string }) {
  const formatted = formatQuestionText(text);
  return (
    <>
      {formatted.split("\n").map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(arabicBlockRegex).map((part, index) =>
            arabicTest.test(part) ? (
              <span key={index} className="arabic-text" dir="rtl">{part}</span>
            ) : (
              <React.Fragment key={index}>{part}</React.Fragment>
            )
          )}
        </React.Fragment>
      ))}
    </>
  );
}
