import { Button } from "@/components/ui/button"
import { PlusCircle, File } from "lucide-react"

export default function VaultPage() {
  // Sample documents data
  const documents = [
    {
      id: 1,
      name: "Project Proposal.pdf",
      type: "PDF",
      size: "2.4 MB",
      lastUpdated: "May 1, 2025",
    },
    {
      id: 2,
      name: "Financial Report Q1.xlsx",
      type: "Excel",
      size: "1.8 MB",
      lastUpdated: "April 28, 2025",
    },
    {
      id: 3,
      name: "Meeting Notes.docx",
      type: "Word",
      size: "540 KB",
      lastUpdated: "April 25, 2025",
    },
    {
      id: 4,
      name: "Product Roadmap.pptx",
      type: "PowerPoint",
      size: "3.2 MB",
      lastUpdated: "April 22, 2025",
    },
    {
      id: 5,
      name: "Research Data.csv",
      type: "CSV",
      size: "1.1 MB",
      lastUpdated: "April 20, 2025",
    },
  ]

  return (
    <div className="flex flex-col h-full p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Vault</h1>

          <Button className="flex items-center space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-500">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Last Updated</div>
          </div>

          {documents.map((doc) => (
            <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50">
              <div className="col-span-6 flex items-center">
                <File className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doc.name}</span>
              </div>
              <div className="col-span-2 text-gray-500">{doc.type}</div>
              <div className="col-span-2 text-gray-500">{doc.size}</div>
              <div className="col-span-2 text-gray-500">{doc.lastUpdated}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
