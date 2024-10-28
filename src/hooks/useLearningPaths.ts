import LearningPath from '../../content/learning-paths.json'

interface LearningPathType {
    [key: string]: {
        mainBlurb: string
        extendedBlurb: string
        learningPoints: string[]
    }
}

export default function useLearningPaths(): LearningPathType {
    return LearningPath
}