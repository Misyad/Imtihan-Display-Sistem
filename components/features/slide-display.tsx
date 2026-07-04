import React from "react";
import Image from "next/image";
import { QuestionEntry } from "@/data/mock";

interface SlideDisplayProps {
  question: QuestionEntry;
  showAnswer: boolean;
}

export function SlideDisplay({ question, showAnswer }: SlideDisplayProps) {
  const imageToShow = showAnswer 
    ? (question.jawabanImage || question.soalImage)
    : question.soalImage;

  // Check if question has image
  const hasImage = question.soalImage || question.jawabanImage;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      {hasImage && imageToShow ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-6xl h-full">
            <Image
              src={imageToShow}
              alt={showAnswer ? "Jawaban" : "Soal"}
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>
      ) : (
        // Fallback to text if no image
        <div className="text-center space-y-8">
          <div className="text-6xl font-bold text-emerald-400 mb-8">
            Soal #{question.nomor}
          </div>
          <div className="text-4xl font-semibold text-white mb-12">
            {question.soal}
          </div>
          {showAnswer && (
            <div className="text-5xl font-bold text-emerald-400 animate-fade-in">
              {question.jawaban}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
