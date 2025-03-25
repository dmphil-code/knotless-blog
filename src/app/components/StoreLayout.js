"use client";

import BaseLayout from './BaseLayout';

export default function StoreLayout({ children, title, description }) {
  return (
    <BaseLayout pageType="page" title={title} description={description}>
      {children}
    </BaseLayout>
  );
}