export type QuizOption = {
  id: 'A' | 'B' | 'C';
  text: string;
};

export type QuizQuestion = {
  id: number;
  question: string;
  options: QuizOption[];
  correct: 'A' | 'B' | 'C';
};

export type QuizLevel = {
  id: number;
  title: string;
  reward: number;
  questions: QuizQuestion[];
};

export const STORY_QUIZ_LEVELS: QuizLevel[] = [
  {
    id: 1,
    title: 'Story of the Fisherman',
    reward: 10,
    questions: [
      {
        id: 1,
        question: 'When did the fisherman wake up?',
        options: [
          { id: 'A', text: 'After breakfast' },
          { id: 'B', text: 'Before the sun' },
          { id: 'C', text: 'At noon' },
        ],
        correct: 'B',
      },
      {
        id: 2,
        question: 'What was the river like in the story?',
        options: [
          { id: 'A', text: 'Very noisy' },
          { id: 'B', text: 'Frozen' },
          { id: 'C', text: 'Very quiet' },
        ],
        correct: 'C',
      },
      {
        id: 3,
        question: 'What could the fisherman almost hear?',
        options: [
          { id: 'A', text: 'The worm thinking' },
          { id: 'B', text: 'A boat engine' },
          { id: 'C', text: 'Rain on the roof' },
        ],
        correct: 'A',
      },
      {
        id: 4,
        question: 'What did he pull out first?',
        options: [
          { id: 'A', text: 'A silver fish' },
          { id: 'B', text: 'An old shoe' },
          { id: 'C', text: 'A lantern' },
        ],
        correct: 'B',
      },
      {
        id: 5,
        question: 'What did the fisherman say to the shoe?',
        options: [
          { id: 'A', text: 'So, you again?' },
          { id: 'B', text: 'Please help me' },
          { id: 'C', text: 'Where is my hat?' },
        ],
        correct: 'A',
      },
      {
        id: 6,
        question: 'What happened after he released the shoe?',
        options: [
          { id: 'A', text: 'It floated away forever' },
          { id: 'B', text: 'He caught it again later' },
          { id: 'C', text: 'It sank immediately' },
        ],
        correct: 'B',
      },
      {
        id: 7,
        question: 'How did the fisherman feel about the shoe in the end?',
        options: [
          { id: 'A', text: 'He thought it was watching him' },
          { id: 'B', text: 'He forgot about it' },
          { id: 'C', text: 'He took it home' },
        ],
        correct: 'A',
      },
      {
        id: 8,
        question: 'What is the mood of this story?',
        options: [
          { id: 'A', text: 'Serious and tragic' },
          { id: 'B', text: 'Quiet and humorous' },
          { id: 'C', text: 'Fast and angry' },
        ],
        correct: 'B',
      },
      {
        id: 9,
        question: 'What did the river morning feel like?',
        options: [
          { id: 'A', text: 'Calm and strange' },
          { id: 'B', text: 'Crowded and loud' },
          { id: 'C', text: 'Dangerous and stormy' },
        ],
        correct: 'A',
      },
      {
        id: 10,
        question: 'What was unusual about the catch in the story?',
        options: [
          { id: 'A', text: 'It was a talking fish' },
          { id: 'B', text: 'It was the same old shoe again' },
          { id: 'C', text: 'It was a broken net' },
        ],
        correct: 'B',
      },
    ],
  },
  {
    id: 2,
    title: 'Story of the Stork',
    reward: 10,
    questions: [
      {
        id: 11,
        question: 'How long had the stork been standing there?',
        options: [
          { id: 'A', text: '30 minutes' },
          { id: 'B', text: '3 hours' },
          { id: 'C', text: 'All night' },
        ],
        correct: 'B',
      },
      {
        id: 12,
        question: 'What do people think about themselves near the water?',
        options: [
          { id: 'A', text: 'They are quiet' },
          { id: 'B', text: 'They are invisible' },
          { id: 'C', text: 'They are lucky' },
        ],
        correct: 'A',
      },
      {
        id: 13,
        question: 'How many times did the fisherman look at the water in a self-important way?',
        options: [
          { id: 'A', text: 'Three times' },
          { id: 'B', text: 'One time' },
          { id: 'C', text: 'Seven times' },
        ],
        correct: 'A',
      },
      {
        id: 14,
        question: 'What did the fisherman do once to himself?',
        options: [
          { id: 'A', text: 'He saluted' },
          { id: 'B', text: 'He winked' },
          { id: 'C', text: 'He shouted' },
        ],
        correct: 'B',
      },
      {
        id: 15,
        question: 'Who laughs at the fisherman under the water?',
        options: [
          { id: 'A', text: 'The fish' },
          { id: 'B', text: 'The reeds' },
          { id: 'C', text: 'The moon' },
        ],
        correct: 'A',
      },
      {
        id: 16,
        question: 'What does the fisherman think he is?',
        options: [
          { id: 'A', text: 'A guide' },
          { id: 'B', text: 'A hunter' },
          { id: 'C', text: 'A bird watcher' },
        ],
        correct: 'B',
      },
      {
        id: 17,
        question: 'According to the stork, what can the river do?',
        options: [
          { id: 'A', text: 'Hunt him back' },
          { id: 'B', text: 'Sing to him' },
          { id: 'C', text: 'Build a boat' },
        ],
        correct: 'A',
      },
      {
        id: 18,
        question: 'What tone does the stork use in the story?',
        options: [
          { id: 'A', text: 'Admiring' },
          { id: 'B', text: 'Teasing and observant' },
          { id: 'C', text: 'Fearful' },
        ],
        correct: 'B',
      },
      {
        id: 19,
        question: 'What is one main idea of the stork story?',
        options: [
          { id: 'A', text: 'Nature notices more than people think' },
          { id: 'B', text: 'Fishing is impossible with birds nearby' },
          { id: 'C', text: 'The fisherman should stop coming' },
        ],
        correct: 'A',
      },
      {
        id: 20,
        question: 'What does the stork notice that the fisherman misses?',
        options: [
          { id: 'A', text: 'Everything around him' },
          { id: 'B', text: 'A hidden bridge' },
          { id: 'C', text: 'A second fisherman' },
        ],
        correct: 'A',
      },
    ],
  },
  {
    id: 3,
    title: 'Story of the Lifesaving Circle',
    reward: 10,
    questions: [
      {
        id: 21,
        question: 'How did the circle describe itself at first?',
        options: [
          { id: 'A', text: 'Old and damaged' },
          { id: 'B', text: 'New, clean, and perfectly round' },
          { id: 'C', text: 'Heavy and broken' },
        ],
        correct: 'B',
      },
      {
        id: 22,
        question: 'Where was the circle hung?',
        options: [
          { id: 'A', text: 'On a wooden pole by the water' },
          { id: 'B', text: 'Inside the boat' },
          { id: 'C', text: 'Near the road' },
        ],
        correct: 'A',
      },
      {
        id: 23,
        question: 'How did the fisherman first look at the circle?',
        options: [
          { id: 'A', text: 'With respect' },
          { id: 'B', text: 'With suspicion' },
          { id: 'C', text: 'With excitement' },
        ],
        correct: 'B',
      },
      {
        id: 24,
        question: 'What did the fisherman say?',
        options: [
          { id: 'A', text: 'I hope I do not need you' },
          { id: 'B', text: 'You look expensive' },
          { id: 'C', text: 'Can you float?' },
        ],
        correct: 'A',
      },
      {
        id: 25,
        question: 'What happened one day near the water?',
        options: [
          { id: 'A', text: 'He dropped his rod' },
          { id: 'B', text: 'He slipped' },
          { id: 'C', text: 'He fell asleep' },
        ],
        correct: 'B',
      },
      {
        id: 26,
        question: 'Did the fisherman actually fall?',
        options: [
          { id: 'A', text: 'Yes' },
          { id: 'B', text: 'No' },
          { id: 'C', text: 'The story does not say' },
        ],
        correct: 'B',
      },
      {
        id: 27,
        question: 'What did the circle see in his eyes?',
        options: [
          { id: 'A', text: 'Fear' },
          { id: 'B', text: 'Laughter' },
          { id: 'C', text: 'Sleepiness' },
        ],
        correct: 'A',
      },
      {
        id: 28,
        question: 'How did the fisherman look at the circle after that?',
        options: [
          { id: 'A', text: 'He ignored it' },
          { id: 'B', text: 'With respect' },
          { id: 'C', text: 'With anger' },
        ],
        correct: 'B',
      },
      {
        id: 29,
        question: 'What does the circle say about itself?',
        options: [
          { id: 'A', text: 'I am always ready' },
          { id: 'B', text: 'I am only decoration' },
          { id: 'C', text: 'I am too old to help' },
        ],
        correct: 'A',
      },
      {
        id: 30,
        question: 'What is the main message of this story?',
        options: [
          { id: 'A', text: 'Safety matters even before an accident happens' },
          { id: 'B', text: 'Fishing without equipment is better' },
          { id: 'C', text: 'The circle wanted to be used' },
        ],
        correct: 'A',
      },
    ],
  },
  {
    id: 4,
    title: 'Story of the Fish',
    reward: 10,
    questions: [
      {
        id: 31,
        question: 'How often does the fish see the fisherman?',
        options: [
          { id: 'A', text: 'Every day' },
          { id: 'B', text: 'Only once a month' },
          { id: 'C', text: 'Only at night' },
        ],
        correct: 'A',
      },
      {
        id: 32,
        question: 'What does the water do according to the fish?',
        options: [
          { id: 'A', text: 'It hides everything' },
          { id: 'B', text: 'It tells the fish everything' },
          { id: 'C', text: 'It scares the fish away' },
        ],
        correct: 'B',
      },
      {
        id: 33,
        question: 'What does the fisherman look at after casting?',
        options: [
          { id: 'A', text: 'The trees' },
          { id: 'B', text: 'The surface' },
          { id: 'C', text: 'His boots' },
        ],
        correct: 'B',
      },
      {
        id: 34,
        question: 'How close did the fish swim one day?',
        options: [
          { id: 'A', text: 'Very close to the fisherman' },
          { id: 'B', text: 'Only to the reeds' },
          { id: 'C', text: 'To the boat only' },
        ],
        correct: 'A',
      },
      {
        id: 35,
        question: 'What did the fish do with the bait?',
        options: [
          { id: 'A', text: 'Swallowed it' },
          { id: 'B', text: 'Touched it and swam away' },
          { id: 'C', text: 'Dragged it away' },
        ],
        correct: 'B',
      },
      {
        id: 36,
        question: 'How did the fish describe the fisherman’s reaction?',
        options: [
          { id: 'A', text: 'Priceless' },
          { id: 'B', text: 'Boring' },
          { id: 'C', text: 'Dangerous' },
        ],
        correct: 'A',
      },
      {
        id: 37,
        question: 'What did the fisherman bring the next day?',
        options: [
          { id: 'A', text: 'A new boat' },
          { id: 'B', text: 'A new bait' },
          { id: 'C', text: 'A second rod' },
        ],
        correct: 'B',
      },
      {
        id: 38,
        question: 'According to the fish, why does the fisherman really return?',
        options: [
          { id: 'A', text: 'Only because of the fish' },
          { id: 'B', text: 'Because he likes being there' },
          { id: 'C', text: 'Because he lost money there' },
        ],
        correct: 'B',
      },
      {
        id: 39,
        question: 'How does the fish feel about the place?',
        options: [
          { id: 'A', text: 'It likes being there too' },
          { id: 'B', text: 'It wants to leave forever' },
          { id: 'C', text: 'It is afraid of it' },
        ],
        correct: 'A',
      },
      {
        id: 40,
        question: 'What is the mood of the fish story?',
        options: [
          { id: 'A', text: 'Playful and thoughtful' },
          { id: 'B', text: 'Strict and instructional' },
          { id: 'C', text: 'Fast and dramatic' },
        ],
        correct: 'A',
      },
    ],
  },
  {
    id: 5,
    title: 'Story of the Boat',
    reward: 10,
    questions: [
      {
        id: 41,
        question: 'What creaks louder in the morning?',
        options: [
          { id: 'A', text: 'The lantern' },
          { id: 'B', text: 'The boat boards' },
          { id: 'C', text: 'The dock rope' },
        ],
        correct: 'B',
      },
      {
        id: 42,
        question: 'How does the fisherman step into the boat?',
        options: [
          { id: 'A', text: 'Carefully' },
          { id: 'B', text: 'Without looking' },
          { id: 'C', text: 'Very quickly' },
        ],
        correct: 'A',
      },
      {
        id: 43,
        question: 'What does the boat say it does?',
        options: [
          { id: 'A', text: 'It remembers' },
          { id: 'B', text: 'It complains loudly' },
          { id: 'C', text: 'It sings at dawn' },
        ],
        correct: 'A',
      },
      {
        id: 44,
        question: 'How was the fisherman when he first pushed the boat into the water?',
        options: [
          { id: 'A', text: 'Older and slower' },
          { id: 'B', text: 'Younger and faster' },
          { id: 'C', text: 'More silent than now' },
        ],
        correct: 'B',
      },
      {
        id: 45,
        question: 'How does he behave now compared with before?',
        options: [
          { id: 'A', text: 'He sits more quietly' },
          { id: 'B', text: 'He is more impatient' },
          { id: 'C', text: 'He talks much more' },
        ],
        correct: 'A',
      },
      {
        id: 46,
        question: 'What does he do before casting sometimes?',
        options: [
          { id: 'A', text: 'He pats the seat' },
          { id: 'B', text: 'He splashes water' },
          { id: 'C', text: 'He stands up' },
        ],
        correct: 'A',
      },
      {
        id: 47,
        question: 'How does the fisherman seem to view the boat?',
        options: [
          { id: 'A', text: 'As part of the ritual' },
          { id: 'B', text: 'As a burden' },
          { id: 'C', text: 'As decoration only' },
        ],
        correct: 'A',
      },
      {
        id: 48,
        question: 'What does the boat think about their relationship?',
        options: [
          { id: 'A', text: 'They carry each other' },
          { id: 'B', text: 'They are strangers' },
          { id: 'C', text: 'The fisherman forgot it' },
        ],
        correct: 'A',
      },
      {
        id: 49,
        question: 'What feeling is strongest in the boat story?',
        options: [
          { id: 'A', text: 'Mutual loyalty and quiet companionship' },
          { id: 'B', text: 'Competition between boat and fisherman' },
          { id: 'C', text: 'Fear of deep water only' },
        ],
        correct: 'A',
      },
      {
        id: 50,
        question: 'What changed most in the fisherman over time?',
        options: [
          { id: 'A', text: 'He became calmer and more reflective' },
          { id: 'B', text: 'He stopped fishing completely' },
          { id: 'C', text: 'He became louder and rushed more' },
        ],
        correct: 'A',
      },
    ],
  },
  {
    id: 6,
    title: 'Story of the Frog',
    reward: 10,
    questions: [
      {
        id: 51,
        question: 'Where does the frog live?',
        options: [
          { id: 'A', text: 'Far from the river' },
          { id: 'B', text: 'Close enough to hear every plan' },
          { id: 'C', text: 'Inside a boat' },
        ],
        correct: 'B',
      },
      {
        id: 52,
        question: 'What do people often say every evening?',
        options: [
          { id: 'A', text: 'Today will be different' },
          { id: 'B', text: 'I forgot my bait' },
          { id: 'C', text: 'The fish are gone' },
        ],
        correct: 'A',
      },
      {
        id: 53,
        question: 'What does the story say about those plans?',
        options: [
          { id: 'A', text: 'They usually work perfectly' },
          { id: 'B', text: 'They usually are not different' },
          { id: 'C', text: 'They always fail immediately' },
        ],
        correct: 'B',
      },
      {
        id: 54,
        question: 'What keeps changing in the fisherman?',
        options: [
          { id: 'A', text: 'Bait, place, and hat' },
          { id: 'B', text: 'Boat, shoes, and lantern' },
          { id: 'C', text: 'River, moon, and wind' },
        ],
        correct: 'A',
      },
      {
        id: 55,
        question: 'Who stays clever in the story?',
        options: [
          { id: 'A', text: 'The fisherman' },
          { id: 'B', text: 'The fish' },
          { id: 'C', text: 'The frog only' },
        ],
        correct: 'B',
      },
      {
        id: 56,
        question: 'Where does the frog stay most of the time?',
        options: [
          { id: 'A', text: 'On its stone' },
          { id: 'B', text: 'Under the boat' },
          { id: 'C', text: 'In the reeds far away' },
        ],
        correct: 'A',
      },
      {
        id: 57,
        question: 'What did the fisherman whisper yesterday?',
        options: [
          { id: 'A', text: 'Today I know exactly what I am doing' },
          { id: 'B', text: 'The river owes me a catch' },
          { id: 'C', text: 'I am going home now' },
        ],
        correct: 'A',
      },
      {
        id: 58,
        question: 'What did the frog do then?',
        options: [
          { id: 'A', text: 'It jumped into the boat' },
          { id: 'B', text: 'It slipped into the water laughing' },
          { id: 'C', text: 'It caught a fly' },
        ],
        correct: 'B',
      },
      {
        id: 59,
        question: 'What does the fisherman think that splash was?',
        options: [
          { id: 'A', text: 'A big fish' },
          { id: 'B', text: 'The wind' },
          { id: 'C', text: 'A broken oar' },
        ],
        correct: 'A',
      },
      {
        id: 60,
        question: 'What is the main tone of the frog story?',
        options: [
          { id: 'A', text: 'Dry humor and observation' },
          { id: 'B', text: 'Fear and danger' },
          { id: 'C', text: 'Silence without emotion' },
        ],
        correct: 'A',
      },
    ],
  },
  {
    id: 7,
    title: 'Story of the Lantern',
    reward: 10,
    questions: [
      {
        id: 61,
        question: 'When does the lantern glow?',
        options: [
          { id: 'A', text: 'Only at noon' },
          { id: 'B', text: 'When the path back becomes uncertain' },
          { id: 'C', text: 'Only in winter' },
        ],
        correct: 'B',
      },
      {
        id: 62,
        question: 'When does the fisherman bring the lantern?',
        options: [
          { id: 'A', text: 'When the light is uncertain' },
          { id: 'B', text: 'Only on holidays' },
          { id: 'C', text: 'Every sunny afternoon' },
        ],
        correct: 'A',
      },
      {
        id: 63,
        question: 'Where does he hang it?',
        options: [
          { id: 'A', text: 'On a branch' },
          { id: 'B', text: 'On the boat seat' },
          { id: 'C', text: 'In the reeds' },
        ],
        correct: 'A',
      },
      {
        id: 64,
        question: 'What does the lantern hold for him?',
        options: [
          { id: 'A', text: 'A map' },
          { id: 'B', text: 'A little piece of light' },
          { id: 'C', text: 'A hidden fish' },
        ],
        correct: 'B',
      },
      {
        id: 65,
        question: 'How much does the fisherman speak at night?',
        options: [
          { id: 'A', text: 'A lot' },
          { id: 'B', text: 'He never stops talking' },
          { id: 'C', text: 'Not much' },
        ],
        correct: 'C',
      },
      {
        id: 66,
        question: 'What did he say once while packing?',
        options: [
          { id: 'A', text: 'That was enough' },
          { id: 'B', text: 'I need a bigger boat' },
          { id: 'C', text: 'Tomorrow will be louder' },
        ],
        correct: 'A',
      },
      {
        id: 67,
        question: 'Did he have a big catch that time?',
        options: [
          { id: 'A', text: 'Yes, the biggest one' },
          { id: 'B', text: 'No, there was no big catch' },
          { id: 'C', text: 'The story never mentions fishing' },
        ],
        correct: 'B',
      },
      {
        id: 68,
        question: 'What mattered more in that moment?',
        options: [
          { id: 'A', text: 'A quiet, meaningful outing' },
          { id: 'B', text: 'Winning against other fishermen' },
          { id: 'C', text: 'Testing new equipment' },
        ],
        correct: 'A',
      },
      {
        id: 69,
        question: 'Why does the lantern think he comes back?',
        options: [
          { id: 'A', text: 'For numbers only' },
          { id: 'B', text: 'For moments that feel enough' },
          { id: 'C', text: 'Only to use the lantern' },
        ],
        correct: 'B',
      },
      {
        id: 70,
        question: 'What is the feeling of the lantern story?',
        options: [
          { id: 'A', text: 'Warm and reflective' },
          { id: 'B', text: 'Cold and distant' },
          { id: 'C', text: 'Fast and competitive' },
        ],
        correct: 'A',
      },
    ],
  },
  {
    id: 8,
    title: 'Story of the Reeds',
    reward: 10,
    questions: [
      {
        id: 71,
        question: 'What do the reeds say they do?',
        options: [
          { id: 'A', text: 'They bend, whisper, and notice everything' },
          { id: 'B', text: 'They block every cast' },
          { id: 'C', text: 'They hide the moon completely' },
        ],
        correct: 'A',
      },
      {
        id: 72,
        question: 'What does the fisherman think when he arrives?',
        options: [
          { id: 'A', text: 'The bank is empty' },
          { id: 'B', text: 'The fish are waiting for him' },
          { id: 'C', text: 'The water is too loud' },
        ],
        correct: 'A',
      },
      {
        id: 73,
        question: 'According to the reeds, is the bank ever really empty?',
        options: [
          { id: 'A', text: 'Yes, always' },
          { id: 'B', text: 'No, never' },
          { id: 'C', text: 'Only in winter' },
        ],
        correct: 'B',
      },
      {
        id: 74,
        question: 'Who watches from above?',
        options: [
          { id: 'A', text: 'Birds' },
          { id: 'B', text: 'Shoes' },
          { id: 'C', text: 'Lanterns' },
        ],
        correct: 'A',
      },
      {
        id: 75,
        question: 'Why does the fisherman like standing near the reeds?',
        options: [
          { id: 'A', text: 'The water is deeper there' },
          { id: 'B', text: 'There are benches there' },
          { id: 'C', text: 'He can hide the boat there' },
        ],
        correct: 'A',
      },
      {
        id: 76,
        question: 'What impressed even the reeds yesterday?',
        options: [
          { id: 'A', text: 'He stood still for 15 minutes' },
          { id: 'B', text: 'He sang to the fish' },
          { id: 'C', text: 'He built a bridge' },
        ],
        correct: 'A',
      },
      {
        id: 77,
        question: 'What happened after that?',
        options: [
          { id: 'A', text: 'He caught a giant fish' },
          { id: 'B', text: 'His phone slipped into the grass' },
          { id: 'C', text: 'The reeds fell over' },
        ],
        correct: 'B',
      },
      {
        id: 78,
        question: 'How long did he search for the phone?',
        options: [
          { id: 'A', text: 'About 10 minutes' },
          { id: 'B', text: 'About 1 hour' },
          { id: 'C', text: 'Only 10 seconds' },
        ],
        correct: 'A',
      },
      {
        id: 79,
        question: 'What does the bank return, according to the reeds?',
        options: [
          { id: 'A', text: 'Humility' },
          { id: 'B', text: 'Luck' },
          { id: 'C', text: 'A better phone' },
        ],
        correct: 'A',
      },
      {
        id: 80,
        question: 'What is the main idea of the reeds story?',
        options: [
          { id: 'A', text: 'Nature offers calm but also perspective' },
          { id: 'B', text: 'Phones should never be taken outside' },
          { id: 'C', text: 'Fishing should only happen in deep water' },
        ],
        correct: 'A',
      },
    ],
  },
  {
    id: 9,
    title: 'Story of the Landing Net',
    reward: 10,
    questions: [
      {
        id: 81,
        question: 'How does the net describe itself?',
        options: [
          { id: 'A', text: 'Always brought along' },
          { id: 'B', text: 'Never used' },
          { id: 'C', text: 'Hidden under the reeds' },
        ],
        correct: 'A',
      },
      {
        id: 82,
        question: 'Where does it lie most days?',
        options: [
          { id: 'A', text: 'Beside the bag waiting' },
          { id: 'B', text: 'In the water' },
          { id: 'C', text: 'On the roof of the boat' },
        ],
        correct: 'A',
      },
      {
        id: 83,
        question: 'What does the fisherman like to think?',
        options: [
          { id: 'A', text: 'Positively' },
          { id: 'B', text: 'Pessimistically' },
          { id: 'C', text: 'Only about weather' },
        ],
        correct: 'A',
      },
      {
        id: 84,
        question: 'How often does he glance at the net?',
        options: [
          { id: 'A', text: 'Often' },
          { id: 'B', text: 'Never' },
          { id: 'C', text: 'Only once a year' },
        ],
        correct: 'A',
      },
      {
        id: 85,
        question: 'What does the net say about itself?',
        options: [
          { id: 'A', text: 'I am always ready' },
          { id: 'B', text: 'I am too weak' },
          { id: 'C', text: 'I prefer staying home' },
        ],
        correct: 'A',
      },
      {
        id: 86,
        question: 'What did the fisherman think one day was on the line?',
        options: [
          { id: 'A', text: 'Something enormous' },
          { id: 'B', text: 'A lost phone' },
          { id: 'C', text: 'A frog' },
        ],
        correct: 'A',
      },
      {
        id: 87,
        question: 'How did he move in that moment?',
        options: [
          { id: 'A', text: 'Like a hero from a story' },
          { id: 'B', text: 'As if he were asleep' },
          { id: 'C', text: 'Very slowly and sadly' },
        ],
        correct: 'A',
      },
      {
        id: 88,
        question: 'What was actually on the line?',
        options: [
          { id: 'A', text: 'A branch' },
          { id: 'B', text: 'A catfish' },
          { id: 'C', text: 'An old boot' },
        ],
        correct: 'A',
      },
      {
        id: 89,
        question: 'How does the net describe the branch?',
        options: [
          { id: 'A', text: 'A very confident branch' },
          { id: 'B', text: 'A silent branch' },
          { id: 'C', text: 'A lucky branch' },
        ],
        correct: 'A',
      },
      {
        id: 90,
        question: 'What is the humor of this story built on?',
        options: [
          { id: 'A', text: 'Big expectations and an ordinary result' },
          { id: 'B', text: 'Fear of storms' },
          { id: 'C', text: 'The net breaking apart' },
        ],
        correct: 'A',
      },
    ],
  },
  {
    id: 10,
    title: 'Story of the Moon',
    reward: 10,
    questions: [
      {
        id: 91,
        question: 'From above, how do even patient people look?',
        options: [
          { id: 'A', text: 'Small' },
          { id: 'B', text: 'Faster' },
          { id: 'C', text: 'Invisible' },
        ],
        correct: 'A',
      },
      {
        id: 92,
        question: 'When does the moon see the fisherman arrive?',
        options: [
          { id: 'A', text: 'At midday' },
          { id: 'B', text: 'When it is between night and morning' },
          { id: 'C', text: 'Only in storms' },
        ],
        correct: 'B',
      },
      {
        id: 93,
        question: 'What reflects half the sky?',
        options: [
          { id: 'A', text: 'The river' },
          { id: 'B', text: 'The lantern' },
          { id: 'C', text: 'The circle' },
        ],
        correct: 'A',
      },
      {
        id: 94,
        question: 'What does the fisherman think he is searching for?',
        options: [
          { id: 'A', text: 'Fish' },
          { id: 'B', text: 'The moon itself' },
          { id: 'C', text: 'Lost gear' },
        ],
        correct: 'A',
      },
      {
        id: 95,
        question: 'What else does the moon think he comes for?',
        options: [
          { id: 'A', text: 'Silence and distance' },
          { id: 'B', text: 'Crowds and noise' },
          { id: 'C', text: 'Only competition' },
        ],
        correct: 'A',
      },
      {
        id: 96,
        question: 'What sound is mentioned in the story?',
        options: [
          { id: 'A', text: 'Water against the bank' },
          { id: 'B', text: 'A train whistle' },
          { id: 'C', text: 'Church bells' },
        ],
        correct: 'A',
      },
      {
        id: 97,
        question: 'Did he catch anything that night?',
        options: [
          { id: 'A', text: 'Yes, many fish' },
          { id: 'B', text: 'No, nothing' },
          { id: 'C', text: 'Only a branch' },
        ],
        correct: 'B',
      },
      {
        id: 98,
        question: 'What did he do before leaving?',
        options: [
          { id: 'A', text: 'Turned back and nodded to the river' },
          { id: 'B', text: 'Threw his rod away' },
          { id: 'C', text: 'Called someone' },
        ],
        correct: 'A',
      },
      {
        id: 99,
        question: 'Why does the river remember him?',
        options: [
          { id: 'A', text: 'Because he treated it with quiet respect' },
          { id: 'B', text: 'Because he always won' },
          { id: 'C', text: 'Because he was the loudest person there' },
        ],
        correct: 'A',
      },
      {
        id: 100,
        question: 'What is the strongest feeling in the moon story?',
        options: [
          { id: 'A', text: 'Respectful calm' },
          { id: 'B', text: 'Fear and panic' },
          { id: 'C', text: 'Excitement and speed' },
        ],
        correct: 'A',
      },
    ],
  },
];