import * as React from "react";

import { cn } from "@/lib/utils";

function Block({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden className={cn("animate-pulse rounded-lg bg-muted", className)} style={style} />;
}

function PageHeading() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <Block className="h-3 w-20" />
        <Block className="h-9 w-48" />
        <Block className="h-4 w-72 max-w-full" />
      </div>
      <Block className="h-10 w-32" />
    </div>
  );
}

function TableSkeleton({ rows = 7 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex gap-6 border-b border-border p-4">
        {[28, 20, 24, 16, 20].map((width, index) => (
          <Block key={index} className="h-4" style={{ width: `${width * 4}px` }} />
        ))}
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex items-center gap-6 p-4">
            <Block className="h-4 w-32" />
            <Block className="h-4 w-24" />
            <Block className="h-4 w-28" />
            <Block className="h-6 w-20 rounded-full" />
            <Block className="ml-auto h-8 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-6">
      <PageHeading />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border bg-card p-5">
            <Block className="h-4 w-28" />
            <Block className="mt-4 h-8 w-24" />
            <Block className="mt-3 h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border border-border bg-card p-5">
          <Block className="h-5 w-40" />
          <Block className="mt-2 h-4 w-64" />
          <Block className="mt-6 h-40 w-full" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <Block className="h-5 w-40" />
          <Block className="mt-2 h-4 w-56" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => <Block key={index} className="h-12 w-full" />)}
          </div>
        </div>
      </div>
      <TableSkeleton rows={4} />
    </div>
  );
}

export function ListPageSkeleton() {
  return (
    <div role="status" aria-label="Loading page" className="space-y-6">
      <PageHeading />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Block key={index} className="h-24 w-full rounded-xl" />)}
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Block className="h-10 flex-1" />
          <Block className="h-10 w-32" />
          <Block className="h-10 w-28" />
        </div>
      </div>
      <TableSkeleton />
    </div>
  );
}

export function CardListPageSkeleton() {
  return (
    <div role="status" aria-label="Loading page" className="space-y-6">
      <PageHeading />
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Block className="h-10 flex-1" />
          <Block className="h-10 w-28" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-border bg-card p-5">
            <Block className="h-5 w-36" />
            <Block className="mt-4 h-4 w-52" />
            <Block className="mt-8 h-8 w-28" />
            <Block className="mt-6 h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div role="status" aria-label="Loading details" className="space-y-6">
      <PageHeading />
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl border border-border bg-card p-6">
          <Block className="h-16 w-16 rounded-full" />
          <Block className="mt-5 h-6 w-48" />
          <Block className="mt-3 h-4 w-64" />
          <div className="mt-8 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => <Block key={index} className="h-10 w-full" />)}
          </div>
        </div>
        <TableSkeleton rows={5} />
      </div>
    </div>
  );
}

export function FormPageSkeleton() {
  return (
    <div role="status" aria-label="Loading form" className="space-y-6">
      <PageHeading />
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Block className="h-4 w-28" />
              <Block className="h-10 w-full" />
            </div>
          ))}
        </div>
        <Block className="mt-8 h-10 w-32" />
      </div>
    </div>
  );
}
