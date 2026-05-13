export function formatMinutesToTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let result = `${hours} hour${hours !== 1 ? "s" : ""}`;

  if (remainingMinutes > 0) {
    result += ` and ${remainingMinutes} minute${remainingMinutes !== 1 ? "s" : ""}`;
  }

  return result;
}
