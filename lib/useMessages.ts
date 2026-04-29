export interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  messages: Message[];
}

export function parseTimeToMinutes(ts: string): number {
  const [h, m] = ts.split(":").map(Number);
  return h * 60 + m;
}

export const mockConversations: Contact[] = [
  {
    id: "1",
    name: "Jane Smith",
    avatar: "https://picsum.photos/seed/jane/100/100",
    online: true,
    messages: [
      { id: "1", text: "Hey! Are you going to the Tech Conference next week?", sender: "them", timestamp: "10:01" },
      { id: "2", text: "Yes! I just signed up actually. Are you presenting?", sender: "me", timestamp: "10:03" },
      {
        id: "3",
        text: "I am! Doing a talk on AI in web development. Should be fun.",
        sender: "them",
        timestamp: "10:04"
      },
      { id: "4", text: "That sounds awesome, I'll make sure to catch your talk.", sender: "me", timestamp: "10:05" },
      {
        id: "5",
        text: "Thanks! Let me know if you want to grab coffee before it starts.",
        sender: "them",
        timestamp: "10:06"
      },
      { id: "6", text: "Definitely, let's do that!", sender: "me", timestamp: "10:07" },
      { id: "7", text: "okay", sender: "them", timestamp: "10:10" },
      { id: "8", text: "thx", sender: "them", timestamp: "10:11" },
      { id: "9", text: "bye", sender: "them", timestamp: "10:12" },
      { id: "10", text: "Do you know if the conference has a workshop track this year?", sender: "them", timestamp: "15:15" },
      { id: "11", text: "I think so, I saw something about hands-on AI sessions in the schedule.", sender: "me", timestamp: "15:16" },
      { id: "12", text: "Oh nice! I might sign up for one of those after my talk.", sender: "them", timestamp: "15:17" },
      { id: "13", text: "You should, it'd be good to step back and just learn for a bit.", sender: "me", timestamp: "15:18" },
      { id: "14", text: "Exactly. Presenting is great but I miss just being an attendee sometimes.", sender: "them", timestamp: "15:20" },
      { id: "15", text: "Ha, I know that feeling. What hotel are you staying at?", sender: "me", timestamp: "15:21" },
      { id: "16", text: "The Grand Meridian, right across from the venue.", sender: "them", timestamp: "15:22" },
      { id: "17", text: "Same one! We can walk over together in the mornings.", sender: "me", timestamp: "15:23" },
      { id: "18", text: "Perfect, that's settled then. See you there!", sender: "them", timestamp: "15:24" },
    ],
  },
  {
    id: "2",
    name: "Chef Marco",
    avatar: "https://picsum.photos/seed/marco/100/100",
    online: false,
    messages: [
      { id: "1", text: "Did you try the new restaurant downtown?", sender: "them", timestamp: "09:15" },
      { id: "2", text: "Not yet, is it good?", sender: "me", timestamp: "09:20" },
      { id: "3", text: "It's incredible, best pasta I've had in years.", sender: "them", timestamp: "09:21" },
      { id: "4", text: "We should go together sometime!", sender: "me", timestamp: "09:25" },
    ],
  },
  {
    id: "3",
    name: "Lisa Green",
    avatar: "https://picsum.photos/seed/lisa/100/100",
    online: true,
    messages: [
      { id: "1", text: "See you at yoga tomorrow!", sender: "them", timestamp: "08:00" },
      { id: "2", text: "Can't wait, I've been so stressed lately.", sender: "me", timestamp: "08:05" },
      { id: "3", text: "The morning session is always the best, very calm.", sender: "them", timestamp: "08:06" },
    ],
  },
  {
    id: "4",
    name: "Alex Turner",
    avatar: "https://picsum.photos/seed/alex/100/100",
    online: true,
    messages: [
      { id: "1", text: "Did you finish the project report?", sender: "them", timestamp: "14:00" },
      { id: "2", text: "Almost, just need to add the charts.", sender: "me", timestamp: "14:02" },
      { id: "3", text: "Let me know if you need the data exports.", sender: "them", timestamp: "14:03" },
      { id: "4", text: "Yes please, that would save me a lot of time.", sender: "me", timestamp: "14:04" },
      { id: "5", text: "Sending them over now.", sender: "them", timestamp: "14:05" },
    ],
  },
  {
    id: "5",
    name: "Sofia Patel",
    avatar: "https://picsum.photos/seed/sofia/100/100",
    online: false,
    messages: [
      { id: "1", text: "Are you coming to the gallery opening Friday?", sender: "them", timestamp: "16:30" },
      { id: "2", text: "I think so! What time does it start?", sender: "me", timestamp: "16:45" },
      { id: "3", text: "Doors open at 7, there's free wine 🍷", sender: "them", timestamp: "16:46" },
      { id: "4", text: "I'll be there!", sender: "me", timestamp: "16:50" },
    ],
  },
  {
    id: "6",
    name: "Tom Nguyen",
    avatar: "https://picsum.photos/seed/tom/100/100",
    online: true,
    messages: [
      { id: "1", text: "Hey, can you review my pull request?", sender: "them", timestamp: "11:00" },
      { id: "2", text: "Sure, link it and I'll take a look.", sender: "me", timestamp: "11:05" },
      {
        id: "3",
        text: "Thanks, I think the auth flow might need a second pair of eyes.",
        sender: "them",
        timestamp: "11:06"
      },
      { id: "4", text: "Left some comments, mostly minor stuff.", sender: "me", timestamp: "11:40" },
      { id: "5", text: "Perfect, fixing them now.", sender: "them", timestamp: "11:42" },
    ],
  },
  {
    id: "7",
    name: "Emma Wilson",
    avatar: "https://picsum.photos/seed/emma/100/100",
    online: false,
    messages: [
      { id: "1", text: "Happy birthday!! 🎂🎉", sender: "them", timestamp: "09:00" },
      { id: "2", text: "Thank you so much Emma!!", sender: "me", timestamp: "09:30" },
      { id: "3", text: "Hope you have a wonderful day!", sender: "them", timestamp: "09:31" },
    ],
  },
  {
    id: "8",
    name: "Carlos Ruiz",
    avatar: "https://picsum.photos/seed/carlos/100/100",
    online: true,
    messages: [
      { id: "1", text: "The match last night was insane!", sender: "them", timestamp: "08:15" },
      { id: "2", text: "I know! That last-minute goal was unreal.", sender: "me", timestamp: "08:17" },
      { id: "3", text: "We need to watch the next one together.", sender: "them", timestamp: "08:18" },
      { id: "4", text: "Absolutely, my place next Saturday?", sender: "me", timestamp: "08:20" },
      { id: "5", text: "I'll bring snacks 🍕", sender: "them", timestamp: "08:21" },
    ],
  },
  {
    id: "9",
    name: "Nadia Hoffman",
    avatar: "https://picsum.photos/seed/nadia/100/100",
    online: false,
    messages: [
      { id: "1", text: "I read the book you recommended.", sender: "them", timestamp: "19:00" },
      { id: "2", text: "What did you think?", sender: "me", timestamp: "19:05" },
      { id: "3", text: "Couldn't put it down! Finished it in two days.", sender: "them", timestamp: "19:06" },
      { id: "4", text: "Right? The ending is so unexpected.", sender: "me", timestamp: "19:08" },
    ],
  },
  {
    id: "10",
    name: "Ben Foster",
    avatar: "https://picsum.photos/seed/ben/100/100",
    online: true,
    messages: [
      { id: "1", text: "Can we move the meeting to Thursday?", sender: "them", timestamp: "13:00" },
      { id: "2", text: "Thursday works for me, morning or afternoon?", sender: "me", timestamp: "13:10" },
      { id: "3", text: "Afternoon, say 2pm?", sender: "them", timestamp: "13:11" },
      { id: "4", text: "Perfect, I'll update the calendar.", sender: "me", timestamp: "13:12" },
    ],
  },
  {
    id: "11",
    name: "Priya Sharma",
    avatar: "https://picsum.photos/seed/priya/100/100",
    online: true,
    messages: [
      { id: "1", text: "The new office space looks amazing!", sender: "them", timestamp: "10:30" },
      { id: "2", text: "I know, the rooftop terrace is my favourite part.", sender: "me", timestamp: "10:33" },
      { id: "3", text: "We should have lunch up there sometime.", sender: "them", timestamp: "10:34" },
    ],
  },
  {
    id: "12",
    name: "Jake Morrison",
    avatar: "https://picsum.photos/seed/jake/100/100",
    online: false,
    messages: [
      { id: "1", text: "You still up for the hike this weekend?", sender: "them", timestamp: "17:00" },
      { id: "2", text: "Yes! I've been looking forward to it all week.", sender: "me", timestamp: "17:05" },
      { id: "3", text: "Trail starts at 8am, don't be late 😄", sender: "them", timestamp: "17:06" },
      { id: "4", text: "I'll set three alarms just to be safe.", sender: "me", timestamp: "17:08" },
    ],
  },
  {
    id: "13",
    name: "Olivia Chen",
    avatar: "https://picsum.photos/seed/olivia/100/100",
    online: true,
    messages: [
      { id: "1", text: "Did you see the new design mockups?", sender: "them", timestamp: "15:00" },
      { id: "2", text: "Just opened them, they look really clean.", sender: "me", timestamp: "15:05" },
      { id: "3", text: "The colour palette was your idea originally!", sender: "them", timestamp: "15:06" },
      { id: "4", text: "Ha, glad it worked out.", sender: "me", timestamp: "15:07" },
    ],
  },
  {
    id: "14",
    name: "Ravi Kumar",
    avatar: "https://picsum.photos/seed/ravi/100/100",
    online: false,
    messages: [
      { id: "1", text: "Server's down again.", sender: "them", timestamp: "03:12" },
      { id: "2", text: "On it, checking the logs now.", sender: "me", timestamp: "03:15" },
      { id: "3", text: "Looks like a memory leak in the worker process.", sender: "me", timestamp: "03:22" },
      { id: "4", text: "Fixed, deploying the patch.", sender: "me", timestamp: "03:35" },
      { id: "5", text: "You're a lifesaver, thanks!", sender: "them", timestamp: "03:37" },
    ],
  },
  {
    id: "15",
    name: "Hannah Berg",
    avatar: "https://picsum.photos/seed/hannah/100/100",
    online: true,
    messages: [
      { id: "1", text: "How was your trip to Copenhagen?", sender: "them", timestamp: "12:00" },
      { id: "2", text: "Absolutely loved it. The food scene is incredible.", sender: "me", timestamp: "12:10" },
      { id: "3", text: "Did you go to that natural wine bar I mentioned?", sender: "them", timestamp: "12:11" },
      { id: "4", text: "Yes! Spent three hours there.", sender: "me", timestamp: "12:13" },
    ],
  },
  {
    id: "16",
    name: "Marcus Lee",
    avatar: "https://picsum.photos/seed/marcus/100/100",
    online: false,
    messages: [
      { id: "1", text: "Are you joining the study group tonight?", sender: "them", timestamp: "14:30" },
      { id: "2", text: "I can't tonight, got a deadline tomorrow.", sender: "me", timestamp: "14:35" },
      { id: "3", text: "No worries, I'll share the notes.", sender: "them", timestamp: "14:36" },
      { id: "4", text: "You're the best, thank you!", sender: "me", timestamp: "14:37" },
    ],
  },
  {
    id: "17",
    name: "Zoe Adams",
    avatar: "https://picsum.photos/seed/zoe/100/100",
    online: true,
    messages: [
      { id: "1", text: "I just adopted a dog!! 🐶", sender: "them", timestamp: "11:00" },
      { id: "2", text: "NO WAY! What breed?", sender: "me", timestamp: "11:02" },
      { id: "3", text: "A golden retriever, his name is Biscuit.", sender: "them", timestamp: "11:03" },
      { id: "4", text: "This is the best news I've heard all week.", sender: "me", timestamp: "11:04" },
      { id: "5", text: "You have to come meet him soon!", sender: "them", timestamp: "11:05" },
    ],
  },
  {
    id: "18",
    name: "David Park",
    avatar: "https://picsum.photos/seed/david/100/100",
    online: true,
    messages: [
      { id: "1", text: "Did you get the tickets for the concert?", sender: "them", timestamp: "09:45" },
      { id: "2", text: "Yes, front row! Cost a fortune but worth it.", sender: "me", timestamp: "09:50" },
      { id: "3", text: "Front row?! How did you manage that?", sender: "them", timestamp: "09:51" },
      { id: "4", text: "Was refreshing the page for an hour 😅", sender: "me", timestamp: "09:52" },
    ],
  },
  {
    id: "19",
    name: "Isabel Cruz",
    avatar: "https://picsum.photos/seed/isabel/100/100",
    online: false,
    messages: [
      { id: "1", text: "Can you proofread my cover letter?", sender: "them", timestamp: "20:00" },
      { id: "2", text: "Of course, send it over.", sender: "me", timestamp: "20:05" },
      { id: "3", text: "It's really good, just a few small tweaks.", sender: "me", timestamp: "20:30" },
      {
        id: "4",
        text: "Thank you so much, I'm so nervous about this application.",
        sender: "them",
        timestamp: "20:32"
      },
      { id: "5", text: "You'll do great, they'd be lucky to have you.", sender: "me", timestamp: "20:33" },
    ],
  },
  {
    id: "20",
    name: "Finn O'Brien",
    avatar: "https://picsum.photos/seed/finn/100/100",
    online: true,
    messages: [
      { id: "1", text: "Sailing trip is confirmed for next month!", sender: "them", timestamp: "13:00" },
      { id: "2", text: "Finally! How many people are coming?", sender: "me", timestamp: "13:05" },
      { id: "3", text: "Six of us, should be a great crew.", sender: "them", timestamp: "13:06" },
      { id: "4", text: "I need to buy some seasickness tablets just in case 😂", sender: "me", timestamp: "13:07" },
      { id: "5", text: "Ha! Don't worry, the boat is very stable.", sender: "them", timestamp: "13:08" },
    ],
  },
  {
    id: "21",
    name: "Mia Johnson",
    avatar: "https://picsum.photos/seed/mia/100/100",
    online: false,
    messages: [
      { id: "1", text: "The podcast episode we recorded is live!", sender: "them", timestamp: "18:00" },
      { id: "2", text: "Just listened, it turned out really well!", sender: "me", timestamp: "18:30" },
      { id: "3", text: "We should do a follow-up episode next month.", sender: "them", timestamp: "18:31" },
      { id: "4", text: "Already have topic ideas, let's plan it.", sender: "me", timestamp: "18:33" },
    ],
  },
  {
    id: "22",
    name: "Liam Scott",
    avatar: "https://picsum.photos/seed/liam/100/100",
    online: true,
    messages: [
      { id: "1", text: "Gym at 6?", sender: "them", timestamp: "05:30" },
      { id: "2", text: "Make it 6:30 and I'm in.", sender: "me", timestamp: "05:35" },
      { id: "3", text: "Deal. Leg day today 💪", sender: "them", timestamp: "05:36" },
      { id: "4", text: "I was afraid you'd say that.", sender: "me", timestamp: "05:37" },
    ],
  },
  {
    id: "23",
    name: "Amara Diallo",
    avatar: "https://picsum.photos/seed/amara/100/100",
    online: false,
    messages: [
      { id: "1", text: "I got the scholarship!", sender: "them", timestamp: "16:00" },
      { id: "2", text: "I KNEW IT! Congratulations, you deserve it so much!", sender: "me", timestamp: "16:02" },
      { id: "3", text: "I literally cried when I got the email.", sender: "them", timestamp: "16:03" },
      { id: "4", text: "We're celebrating this weekend, no excuses.", sender: "me", timestamp: "16:04" },
    ],
  },
];
