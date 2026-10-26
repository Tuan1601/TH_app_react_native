import type { Course, Grade } from '../types/models';

/** Quy đổi điểm hệ 10 sang hệ 4 theo bảng của TH3.md. */
export function toScale4(score10: number): number {
  if (score10 >= 8.5) {
    return 4;
  }
  if (score10 >= 8) {
    return 3.5;
  }
  if (score10 >= 7) {
    return 3;
  }
  if (score10 >= 6.5) {
    return 2.5;
  }
  if (score10 >= 5.5) {
    return 2;
  }
  if (score10 >= 5) {
    return 1.5;
  }
  if (score10 >= 4) {
    return 1;
  }
  return 0;
}

/** Quy đổi điểm hệ 10 sang điểm chữ. */
export function toLetter(score10: number): string {
  if (score10 >= 8.5) {
    return 'A';
  }
  if (score10 >= 8) {
    return 'B+';
  }
  if (score10 >= 7) {
    return 'B';
  }
  if (score10 >= 6.5) {
    return 'C+';
  }
  if (score10 >= 5.5) {
    return 'C';
  }
  if (score10 >= 5) {
    return 'D+';
  }
  if (score10 >= 4) {
    return 'D';
  }
  return 'F';
}

/** total = 10% chuyên cần + 30% giữa kỳ + 60% cuối kỳ */
export function calcTotal(attendance: number, midterm: number, final: number): number {
  return Math.round((attendance * 0.1 + midterm * 0.3 + final * 0.6) * 100) / 100;
}

/**
 * GPA = tổng (điểm hệ 4 × tín chỉ) / tổng tín chỉ.
 * Môn điểm F không tính vào số tín chỉ tích lũy.
 */
export function calcGpa(
  grades: Grade[] = [],
  courses: Course[] = [],
): { gpa: number; totalCredits: number } {
  let weighted = 0;
  let gradedCredits = 0;
  let earnedCredits = 0;

  grades.forEach(grade => {
    const course = grade.course ?? courses.find(item => String(item.id) === String(grade.courseId));
    const credits = Number(course?.credits ?? 0);
    if (!credits) {
      return;
    }
    const scale4 = toScale4(Number(grade.total));
    weighted += scale4 * credits;
    gradedCredits += credits;
    if (scale4 > 0) {
      earnedCredits += credits;
    }
  });

  return {
    gpa: gradedCredits ? weighted / gradedCredits : 0,
    totalCredits: earnedCredits,
  };
}
