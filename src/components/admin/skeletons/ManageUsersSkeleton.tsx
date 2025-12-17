import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

export function ManageUsersSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="mb-6">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="h-4 w-96 mt-2 rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
            <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-7 w-12 mt-1" />
                    <Skeleton className="h-3 w-32 mt-2" />
                </CardContent>
            </Card>
        ))}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Skeleton className="h-9 w-[250px]" />
                <Skeleton className="h-9 w-24" />
            </div>
            <div className="flex items-center space-x-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-32" />
            </div>
        </div>
        <div className="rounded-md border">
            <div className="p-4">
                <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-5 w-5 rounded-sm" />
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-5 flex-1" />
                            <Skeleton className="h-5 flex-1" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-8 w-8" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="flex items-center justify-between px-2">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center space-x-6">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-32" />
            </div>
        </div>
      </div>
    </div>
  )
}
