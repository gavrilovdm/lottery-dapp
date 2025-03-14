'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface RoundCardProps {
  title: string;
  children: ReactNode;
}

export function RoundCard({ title, children }: RoundCardProps) {
  return (
    <Card>
      <CardHeader className="p-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        {children}
      </CardContent>
    </Card>
  );
} 