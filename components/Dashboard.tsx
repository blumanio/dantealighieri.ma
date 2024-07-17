import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Dashboard: React.FC = () => {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='mb-6 text-3xl font-bold'>Student Dashboard</h1>
      <Tabs defaultValue='overview'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='applications'>Applications</TabsTrigger>
          <TabsTrigger value='documents'>Documents</TabsTrigger>
        </TabsList>
        <TabsContent value='overview'>Overview Content</TabsContent>
        <TabsContent value='applications'>Applications Content</TabsContent>
        <TabsContent value='documents'>Documents Content</TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard
