import React from "react";
import { formatQuestionText } from "@/lib/utils";

const arabicPart = /[\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]/;

export function QuestionText({ text }: { text: string }) {
  const formatted = formatQuestionText(text);
  return (
    <>
      {formatted.split("\n").map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.split(/([\u0600-\u06ff\u0750-\u077f\u08a0-\u08ff]+)/g).map((part, index) =>
            arabicPart.test(part) ? (
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
