"use client";

import { useState, useTransition } from "react";
import { changePassword } from "@/app/actions/change-password";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        startTransition(async () => {
          const result = await changePassword({
            currentPassword,
            newPassword,
          });

          if (result?.error) {
            setError(result.error);
            return;
          }

          setMessage("Wachtwoord succesvol gewijzigd.");
          setCurrentPassword("");
          setNewPassword("");
        });
      }}
    >
      <div>
        <label
          htmlFor="currentPassword"
          className="block text-sm font-medium mb-1"
        >
          Huidig wachtwoord
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="block text-sm font-medium mb-1"
        >
          Nieuw wachtwoord
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
          required
          minLength={6}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-green-600">{message}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
      >
        {isPending ? "Opslaan..." : "Wachtwoord wijzigen"}
      </button>
    </form>
  );
}