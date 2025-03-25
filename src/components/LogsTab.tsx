'use client';

import React from 'react';

interface LogsTabProps {
  user: any; // Replace with proper User type if available
}

export default function LogsTab({ user }: LogsTabProps) {
  return (
    <div className="logs-tab">
      <p>Logs component placeholder. Display logs for {user.username} here.</p>
    </div>
  );
}