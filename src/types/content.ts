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

export interface TutorialType {
    [key: string]: {
        category: string
        title: string
        description: string
        amt: string
        link: string
        tags: string[]
        featured?: boolean | false
    }
}
