export function encodeId(id: number | string): string {
  const salt = "mituni_secure_";
  const text = `${salt}${id}`;
  if (typeof window === "undefined") {
    // Server-side
    return Buffer.from(text).toString("base64url");
  } else {
    // Client-side
    return btoa(text)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}

export function decodeId(encodedId: string): string {
  try {
    const salt = "mituni_secure_";
    let decoded = "";
    
    if (typeof window === "undefined") {
      // Server-side
      decoded = Buffer.from(encodedId, "base64url").toString("utf-8");
    } else {
      // Client-side
      const base64 = encodedId.replace(/-/g, "+").replace(/_/g, "/");
      decoded = atob(base64);
    }

    if (decoded.startsWith(salt)) {
      return decoded.slice(salt.length);
    }
    return encodedId; // Return original if salt mismatch (fallback)
  } catch (e) {
    console.error("Failed to decode ID:", e);
    return encodedId; // Fallback to original
  }
}
