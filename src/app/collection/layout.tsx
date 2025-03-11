import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Album Collection | Frame The Beat",
  description: "Browse the album collection on Frame The Beat.",
};

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
