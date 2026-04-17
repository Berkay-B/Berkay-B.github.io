"use client";

import { useState, useTransition } from "react";
import { toggleFavorite } from "@/app/actions/toggle-favorite";

type Props = {
  courseId: string;
  initialIsFavorite: boolean;
};

export default function FavoriteButton({
  courseId,
  initialIsFavorite,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);

          startTransition(async () => {
            const result = await toggleFavorite(courseId);

            if (result?.error) {
              setError(result.error);
              return;
            }

            setIsFavorite((prev) => !prev);
          });
        }}
        className="rounded border px-3 py-1 text-sm"
      >
        {isPending
          ? "Bezig..."
          : isFavorite
            ? "Verwijder uit favorieten"
            : "Voeg toe aan favorieten"}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}