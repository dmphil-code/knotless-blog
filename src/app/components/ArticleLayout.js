"use client";

import BaseLayout from './BaseLayout';

export default function ArticleLayout({ children }) {
  return (
    <BaseLayout pageType="article">
      {children}
    </BaseLayout>
  );
}