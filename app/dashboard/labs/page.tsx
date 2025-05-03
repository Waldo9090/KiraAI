import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FlaskRoundIcon as Flask, Sparkles, Zap, Brain, BotIcon as Robot, Lightbulb } from "lucide-react"

export default function LabsPage() {
  const features = [
    {
      id: 1,
      title: "Advanced Image Generation",
      description: "Generate high-quality images with more control and options",
      status: "Beta",
      icon: Sparkles,
      color: "bg-purple-100",
    },
    {
      id: 2,
      title: "Code Interpreter",
      description: "Execute and debug code in real-time with AI assistance",
      status: "New",
      icon: Zap,
      color: "bg-blue-100",
    },
    {
      id: 3,
      title: "Neural Search",
      description: "Search through your documents with advanced neural networks",
      status: "Experimental",
      icon: Brain,
      color: "bg-green-100",
    },
    {
      id: 4,
      title: "Custom AI Assistants",
      description: "Create and train your own AI assistants for specific tasks",
      status: "Alpha",
      icon: Robot,
      color: "bg-yellow-100",
    },
    {
      id: 5,
      title: "Idea Generator",
      description: "Generate creative ideas for projects, content, and more",
      status: "Beta",
      icon: Lightbulb,
      color: "bg-red-100",
    },
  ]

  return (
    <div className="flex flex-col h-full p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex items-center mb-6">
          <Flask className="h-6 w-6 mr-2 text-purple-600" />
          <h1 className="text-2xl font-bold">Labs</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Explore experimental features and provide feedback to help us improve. Note that these features may change or
          be removed at any time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className={`${feature.color} p-3 rounded-lg mr-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium text-lg mr-2">{feature.title}</h3>
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{feature.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                    <button className="mt-4 text-sm text-purple-600 font-medium">Try it out →</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
