import { createContext, useContext, useEffect, useState } from "react";
import { setGuestId, clearGuestId, readGuestId } from "../api";

const GuestContext = createContext(null);

const normalize = (id) => (id || "").trim().toLowerCase();

export function GuestProvider({ children }) {
  const [guestId, setGuestIdState] = useState("");

  useEffect(() => {
    const stored = readGuestId();
    if (stored) setGuestIdState(stored);
  }, []);

  const signIn = (rawId) => {
    const id = normalize(rawId);
    if (!id) return { ok: false, error: "Please enter an ID" };
    if (id.length < 3)
      return { ok: false, error: "ID must be at least 3 characters" };
    if (!/^[a-z0-9_.-]+$/i.test(id))
      return {
        ok: false,
        error: "Only letters, numbers, dot, dash and underscore allowed",
      };
    setGuestId(id);
    setGuestIdState(id);
    return { ok: true };
  };

  const signOut = () => {
    clearGuestId();
    setGuestIdState("");
  };

  return (
    <GuestContext.Provider
      value={{
        guestId,
        isSignedIn: Boolean(guestId),
        signIn,
        signOut,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest must be used inside GuestProvider");
  return ctx;
}
