import * as bcrypt from "bcryptjs";

export async function compareHash(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string, saltRound = 10) {
  const salt = await bcrypt.genSalt(saltRound);
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
}
