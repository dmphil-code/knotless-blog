"use client";

import BaseLayout from './BaseLayout';

export default function PageLayout({ children, title, description }) {
  return (
    <BaseLayout pageType="page" title={title} description={description}>
      {children}
    </BaseLayout>
  );
}