"use client";

import BaseLayout from './BaseLayout';

export default function StoreLayout({ children }) {
  return (
    <BaseLayout pageType="store">
      {/* This layout now handles the hero section directly from the page component */}
      {children}
    </BaseLayout>
  );
}