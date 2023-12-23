import { randomUUID } from 'crypto';

export async function getDatabaseConnection() {
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000));

  return randomUUID();
}
