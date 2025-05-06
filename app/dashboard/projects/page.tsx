import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Folder, MoreHorizontal } from "lucide-react"

export default function ProjectsPage() {
  // Sample projects data
  const projects = [
    {
      id: 1,
      name: "Marketing Campaign",
      description: "Q2 2025 product launch campaign",
      items: 12,
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "Research Paper",
      description: "AI ethics research for conference",
      items: 8,
      lastUpdated: "Yesterday",
    },
    {
      id: 3,
      name: "Website Redesign",
      description: "Company website refresh project",
      items: 15,
      lastUpdated: "3 days ago",
    },
    {
      id: 4,
      name: "Product Development",
      description: "New feature planning and research",
      items: 24,
      lastUpdated: "1 week ago",
    },
  ]

  return (
    <div className="flex flex-col h-full p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>

          <Button className="flex items-center space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{project.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-500">
                    <Folder className="h-4 w-4 mr-1" />
                    <span>{project.items} items</span>
                  </div>
                  <span className="text-gray-500">Updated {project.lastUpdated}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
