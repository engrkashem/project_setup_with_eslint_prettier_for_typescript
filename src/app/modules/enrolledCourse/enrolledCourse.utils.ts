export const calculateGradeAndPoints = (totalMarks: number) => {
  let result: { grade: string; points: number } = {
    grade: 'NA',
    points: 0.0,
  };

  if (totalMarks >= 80) {
    result = {
      grade: 'A',
      points: 4.0,
    };
  } else if (totalMarks < 80 && totalMarks >= 60) {
    result = {
      grade: 'B',
      points: 3.5,
    };
  } else if (totalMarks < 60 && totalMarks >= 40) {
    result = {
      grade: 'C',
      points: 3.0,
    };
  } else if (totalMarks < 40 && totalMarks >= 20) {
    result = {
      grade: 'D',
      points: 2.0,
    };
  } else {
    result = {
      grade: 'F',
      points: 0.0,
    };
  }

  return result;
};
