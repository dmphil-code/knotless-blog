"use client";

import BaseLayout from './BaseLayout';

export default function HomeLayout({ children, onSearchSubmit }) {
  return (
    <BaseLayout pageType="home" onSearchSubmit={onSearchSubmit}>
      {children}
    </BaseLayout>
  );
}