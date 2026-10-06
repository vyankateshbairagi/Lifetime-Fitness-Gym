function parts(date: Date, timeZone: string) {
  const values = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(date);
  return Object.fromEntries(values.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)])) as Record<string, number>;
}

export function businessDateKey(date: Date, timeZone: string) {
  const value = parts(date, timeZone);
  return `${value.year}-${String(value.month).padStart(2, "0")}-${String(value.day).padStart(2, "0")}`;
}

export function localBoundaryUtc(dateKey: string, timeZone: string, endOfDay = false) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const target = Date.UTC(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);
  const observed = parts(new Date(target), timeZone);
  const observedUtc = Date.UTC(observed.year, observed.month - 1, observed.day, observed.hour, observed.minute, observed.second, endOfDay ? 999 : 0);
  return new Date(target + (target - observedUtc));
}

export function previousBusinessDayEnd(date: Date, timeZone: string) {
  const current = businessDateKey(date, timeZone);
  const [year, month, day] = current.split("-").map(Number);
  const previous = new Date(Date.UTC(year, month - 1, day - 1));
  return localBoundaryUtc(businessDateKey(previous, "UTC"), timeZone, true);
}
