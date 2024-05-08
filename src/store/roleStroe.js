import { persistentAtom } from "@nanostores/persistent";

export const roleStore = persistentAtom("role", "", {
  encode: JSON.stringify,
  decode: JSON.parse,
});
