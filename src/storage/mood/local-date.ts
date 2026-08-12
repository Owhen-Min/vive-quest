export interface LocalDateRange {
  startDate: string;
  endDate: string;
}

export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getRecentLocalDateRange(
  days: number,
  referenceDate = new Date(),
): LocalDateRange {
  if (!Number.isInteger(days) || days < 1) {
    throw new Error("조회 일수는 1 이상의 정수여야 합니다.");
  }

  const end = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));

  return {
    startDate: toLocalDateKey(start),
    endDate: toLocalDateKey(end),
  };
}
