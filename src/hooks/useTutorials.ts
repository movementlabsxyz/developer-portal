import Tutorials from '../../content/tutorials.json'
import { TutorialType } from '@/types/content'

export default function useTutorials(): TutorialType {
    return Tutorials as TutorialType
}