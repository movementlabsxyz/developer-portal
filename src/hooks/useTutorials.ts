import Tutorials from '../../content/tutorials.json'

interface TutorialType {
    [key: string]: {
        category: string
        title: string
        description: string
        amt: string
        link: string
        tags: string[]
    }
}

export default function useTutorials(): TutorialType {
    return Tutorials
}