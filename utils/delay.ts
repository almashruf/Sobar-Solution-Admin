// utils/delay.ts
export const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));
