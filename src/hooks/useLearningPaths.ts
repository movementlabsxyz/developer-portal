import LearningPath from '../../content/learning-paths.json'
import { LearningPathType } from '@/types/content'

export default function useLearningPaths(): LearningPathType {
    return LearningPath
}