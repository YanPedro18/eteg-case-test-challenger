import { useState, useEffect } from "react";
import { fetchColors, type ColorOption } from "../lib/api";

export function useColors() {
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchColors()
      .then(setColors)
      .catch(() => setError("Não foi possível carregar as cores"))
      .finally(() => setLoading(false));
  }, []);

  return { colors, loading, error };
}
