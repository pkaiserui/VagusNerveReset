import { Practice, PracticeType } from '@/lib/types'

export type { PracticeType }

export const PRACTICES: Practice[] = [
  // Daily Mood Record
  {
    id: 'mood-record',
    type: 'mood_record',
    variant: 'daily',
    name: 'Daily Mood Record',
    description: 'Track your daily emotional state and nervous system regulation',
    durationMinutes: 5,
    isPremium: false,
  },
  // Containment Exercises
  {
    id: 'containment-container',
    type: 'containment',
    variant: 'container_visualization',
    name: 'Container Visualization',
    description: 'A guided visualization practice to create a safe mental container',
    durationMinutes: 5,
    isPremium: false,
  },
  {
    id: 'containment-box-breathing',
    type: 'containment',
    variant: 'box_breathing',
    name: 'Box Breathing',
    description: '4-4-4-4 breathing pattern to calm your nervous system',
    durationMinutes: 5,
    isPremium: true,
  },
  {
    id: 'containment-body-scan',
    type: 'containment',
    variant: 'body_scan',
    name: 'Body Scan',
    description: 'Mindful awareness practice scanning through your body',
    durationMinutes: 10,
    isPremium: true,
  },
  {
    id: 'containment-pmr',
    type: 'containment',
    variant: 'progressive_muscle_relaxation',
    name: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and release muscle groups for deep relaxation',
    durationMinutes: 15,
    isPremium: true,
  },
  // Body Exercises
  {
    id: 'body-bee-breathing',
    type: 'body_exercise',
    variant: 'bee_breathing',
    name: 'Bee Breathing',
    description: 'Bhramari pranayama - humming breath to activate the vagus nerve',
    durationMinutes: 3,
    isPremium: false,
  },
  {
    id: 'body-arm-swings',
    type: 'body_exercise',
    variant: 'arm_swings',
    name: 'Arm Swings',
    description: 'Gentle swinging movements to regulate your nervous system',
    durationMinutes: 2,
    isPremium: true,
  },
  {
    id: 'body-butterfly-hug',
    type: 'body_exercise',
    variant: 'butterfly_hug',
    name: 'Butterfly Hug',
    description: 'Bilateral stimulation technique for self-soothing',
    durationMinutes: 5,
    isPremium: true,
  },
  {
    id: 'body-pendulation',
    type: 'body_exercise',
    variant: 'pendulation',
    name: 'Pendulation',
    description: 'Gentle movement practice to find your natural rhythm',
    durationMinutes: 5,
    isPremium: true,
  },
  // Regulating Resources
  {
    id: 'resource-proprioceptive',
    type: 'regulating_resource',
    variant: 'proprioceptive_input',
    name: 'Proprioceptive Input',
    description: 'Weighted blanket, self-massage, and deep pressure techniques',
    durationMinutes: 10,
    isPremium: true,
  },
  {
    id: 'resource-cold-exposure',
    type: 'regulating_resource',
    variant: 'cold_exposure',
    name: 'Cold Exposure',
    description: 'Cold shower protocol and ice on face for nervous system activation',
    durationMinutes: 5,
    isPremium: true,
  },
  {
    id: 'resource-singing',
    type: 'regulating_resource',
    variant: 'singing',
    name: 'Singing',
    description: 'Vocal exercises and grounding songs to activate the vagus nerve',
    durationMinutes: 5,
    isPremium: true,
  },
  {
    id: 'resource-natural-light',
    type: 'regulating_resource',
    variant: 'natural_light',
    name: 'Natural Light',
    description: 'Sunlight exposure timer and morning light reminders',
    durationMinutes: 15,
    isPremium: true,
  },
  {
    id: 'resource-relaxing-music',
    type: 'regulating_resource',
    variant: 'relaxing_music',
    name: 'Relaxing Music',
    description: 'Curated playlists and ambient soundscapes for regulation',
    durationMinutes: 20,
    isPremium: true,
  },
  {
    id: 'resource-hot-shower',
    type: 'regulating_resource',
    variant: 'hot_shower_bath',
    name: 'Hot Shower/Bath',
    description: 'Guided relaxation ritual with warm water',
    durationMinutes: 15,
    isPremium: true,
  },
  // Hyperarousal Resources
  {
    id: 'hyperarousal-cold',
    type: 'hyperarousal_resource',
    variant: 'cold_exposure',
    name: 'Cold Exposure',
    description: 'Quick ice protocol for immediate activation relief',
    durationMinutes: 2,
    isPremium: true,
  },
  {
    id: 'hyperarousal-singing',
    type: 'hyperarousal_resource',
    variant: 'singing',
    name: 'Singing',
    description: 'Specific grounding songs for activated states',
    durationMinutes: 3,
    isPremium: true,
  },
  {
    id: 'hyperarousal-proprioception',
    type: 'hyperarousal_resource',
    variant: 'intense_proprioception',
    name: 'Intense Proprioception',
    description: 'Wall push, grip squeezes, and pressure techniques',
    durationMinutes: 5,
    isPremium: true,
  },
  // Hypoarousal Resources
  {
    id: 'hypoarousal-natural-light',
    type: 'hypoarousal_resource',
    variant: 'natural_light',
    name: 'Natural Light',
    description: 'Get outside reminder for morning sunlight',
    durationMinutes: 15,
    isPremium: true,
  },
  {
    id: 'hypoarousal-music',
    type: 'hypoarousal_resource',
    variant: 'uplifting_music',
    name: 'Uplifting Music',
    description: 'Energizing playlists to lift your mood',
    durationMinutes: 10,
    isPremium: true,
  },
  {
    id: 'hypoarousal-hot-shower',
    type: 'hypoarousal_resource',
    variant: 'hot_shower',
    name: 'Hot Shower Ritual',
    description: 'Warm water ritual for gentle activation',
    durationMinutes: 15,
    isPremium: true,
  },
  {
    id: 'hypoarousal-movement',
    type: 'hypoarousal_resource',
    variant: 'gentle_movement',
    name: 'Gentle Movement',
    description: 'Stretching prompts and gentle exercises',
    durationMinutes: 10,
    isPremium: true,
  },
  // Other Practices
  {
    id: 'worry-record',
    type: 'worry_record',
    variant: 'cognitive_restructuring',
    name: 'Worry Record',
    description: 'Cognitive restructuring for anxious thoughts',
    durationMinutes: 10,
    isPremium: true,
  },
  {
    id: 'emotion-recognition',
    type: 'emotion_recognition',
    variant: 'sit_with_emotion',
    name: 'Recognize & Sit with Emotions',
    description: 'Emotional tolerance practice with 90-second timer',
    durationMinutes: 2,
    isPremium: false,
  },
  {
    id: 'basic-needs-journal',
    type: 'basic_needs_journal',
    variant: 'needs_assessment',
    name: 'Basic Needs Journal',
    description: 'Identify unmet needs and generate action items',
    durationMinutes: 15,
    isPremium: true,
  },
]

export function getPracticesByType(type: PracticeType): Practice[] {
  return PRACTICES.filter(p => p.type === type)
}

export function getPracticeById(id: string): Practice | undefined {
  return PRACTICES.find(p => p.id === id)
}

export function getPracticeByTypeAndVariant(
  type: PracticeType,
  variant: string
): Practice | undefined {
  return PRACTICES.find(p => p.type === type && p.variant === variant)
}
