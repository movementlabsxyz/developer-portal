import DeveloperTool from '../../content/developer-tools.json'

interface DeveloperToolType {
    [key: string]: {
        title: string
        description: string
        link: string
        tags: string[]
    }
}

export default function useDeveloperTools(): DeveloperToolType {
    return DeveloperTool
}