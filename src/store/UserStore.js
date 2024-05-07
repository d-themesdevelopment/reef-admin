import { atom } from "nanostores";
import { persistentAtom } from "@nanostores/persistent";

export const userStore = persistentAtom("user", "", {
  encode: JSON.stringify,
  decode: JSON.parse,
});
export const isLoggedIn = atom(false);

export function addUser(userData) {
  userStore.set(userData);
}
