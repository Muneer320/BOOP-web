import React from "react";
import "./PuzzleDetails.css";

const GRID_SIZES = { normal: 13, hard: 17 };

const PuzzleDetails = ({ formData, wordsPayload }) => {
  const { normal = 0, hard = 0, bonus_normal = 0, bonus_hard = 0 } = formData;
  const totalNormal = normal + bonus_normal;
  const totalHard = hard + bonus_hard;
  const totalPuzzles = totalNormal + totalHard;
  const wordsPerPuzzle = { normal: 10, hard: 15 };
  const totalWords = (normal + bonus_normal) * wordsPerPuzzle.normal
    + (hard + bonus_hard) * wordsPerPuzzle.hard;
  const totalPages = totalPuzzles * 2 + 2;
  const selectedWordCount = wordsPayload
    ? Object.values(wordsPayload).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  if (totalPuzzles === 0) {
    return (
      <div className="puzzle-details stale">
        <div className="details-empty">
          <p>Add at least one puzzle to see details</p>
        </div>
      </div>
    );
  }

  const DetailRow = ({ label, value }) => (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );

  return (
    <div className="puzzle-details">
      <h3 className="details-title">{formData.name || "My Word Search"}</h3>
      <hr className="details-divider" />
      <DetailRow label="Normal puzzles (13×13)" value={normal} />
      <DetailRow label="Hard puzzles (17×17)" value={hard} />
      <DetailRow label="Bonus normal (13×13)" value={bonus_normal} />
      <DetailRow label="Bonus hard (17×17)" value={bonus_hard} />
      <hr className="details-divider" />
      <DetailRow label="Total puzzles" value={totalPuzzles} />
      <DetailRow label="Total words" value={totalWords} />
      <DetailRow label="Est. pages" value={totalPages} />
      {selectedWordCount > 0 && (
        <>
          <hr className="details-divider" />
          <DetailRow label="Words selected" value={selectedWordCount} />
        </>
      )}
      <hr className="details-divider" />
      <div className="details-grid-size">
        {bonus_hard + hard > 0 && (
          <span className="grid-tag hard-tag">Hard: {GRID_SIZES.hard}×{GRID_SIZES.hard}</span>
        )}
        {bonus_normal + normal > 0 && (
          <span className="grid-tag normal-tag">Normal: {GRID_SIZES.normal}×{GRID_SIZES.normal}</span>
        )}
      </div>
    </div>
  );
};

export default PuzzleDetails;
