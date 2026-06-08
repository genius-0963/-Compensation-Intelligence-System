"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';

// Placeholder UI component
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="bg-green-500 text-white p-2 rounded" />
);

export default function SaveButton({ entityType, entityId }: { entityType: string; entityId: string }) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!session) {
      // Redirect to login or show a modal
      alert("Please log in to save items.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    let apiUrl;
    let body;

    switch (entityType) {
      case 'company':
        apiUrl = '/api/saved-companies';
        body = { companyId: entityId };
        break;
      case 'level':
        apiUrl = '/api/saved-levels';
        body = { levelId: entityId };
        break;
      case 'location':
        apiUrl = '/api/saved-locations';
        body = { locationId: entityId };
        break;
      default:
        setError("Invalid entity type");
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) { // Already saved
          setIsSaved(true);
        } else {
          throw new Error(errorData.message || `Failed to save ${entityType}`);
        }
      } else {
        setIsSaved(true);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSaved) {
    return <Button disabled>Saved</Button>;
  }
  
  if (error) {
    // Optionally display the error
    return <Button disabled>Error</Button>
  }

  return (
    <Button onClick={handleSave} disabled={isSubmitting}>
      {isSubmitting ? 'Saving...' : 'Save'}
    </Button>
  );
}
