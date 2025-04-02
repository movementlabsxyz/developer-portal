export interface DeveloperToolType {
    [key: string]: {
        title: string
        description: string
        link: string
        tags: string[]
    }
}

export interface LearningPathType {
    [key: string]: {
        mainBlurb: string
        extendedBlurb: string
        learningPoints: string[]
    }
}

export interface Tutorial {
    category: string
    title: string
    description: string
    amt: string
    type: 'written' | 'external'
    link?: string
    markdownFile?: string
    tags: string[]
    featured?: boolean
    image?: string
}

export type TutorialType = {
    [key: string]: Tutorial
}
