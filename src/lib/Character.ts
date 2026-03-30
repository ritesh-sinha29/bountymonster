// Static file for character info.
export const Characters = [
    {
        id: 1,
        name: "Ares",
        title: "God of war",
        description: "born in the fire , raised in the fire. Always ready to hunt.",
        theme: "orange",
        image: "/dragon.png",
        type: "available", //locked for locking
        maxLevel: 4,
        Power: {
            "Blood Streak": "Consecutive task completions increase XP per task",
            "No-Sleep Protocol": "Increases the amount of XP gained from tasks",
            "Dexterity": "Increases the amount of XP gained from tasks",
        },
    },
    {
        id: 2,
        name: "AEGIS",
        title: "The Proof warden",
        description: "Truth is my weapon",
        theme: "purple",
        image: "/3.png",
        type: "available",
        maxLevel: 4,
        Power: {
            "Blood Streak": "Consecutive task completions increase XP per task",
            "No-Sleep Protocol": "Increases the amount of XP gained from tasks",
            "Dexterity": "Increases the amount of XP gained from tasks",
        }
    },
    {
        id: 3,
        name: "RAXX",
        title: "Goodnes of Wisdom",
        description: "born in the fire , raised in the fire. Always ready to hunt.",
        theme: "blue",
        image: "/4.png",
        type: "available",
        maxLevel: 4,
        Power: {
            "Blood Streak": "Consecutive task completions increase XP per task",
            "No-Sleep Protocol": "Increases the amount of XP gained from tasks",
            "Dexterity": "Increases the amount of XP gained from tasks",
        },
    },
    {
        id: 4,
        name: "VYREX",
        title: "Master of the void",
        description: "Attention is currency. I mint it.",
        theme: "green",
        image: "/5.png",
        type: "available",
        maxLevel: 4,
        Power: {
            "Blood Streak": "Consecutive task completions increase XP per task",
            "No-Sleep Protocol": "Increases the amount of XP gained from tasks",
            "Dexterity": "Increases the amount of XP gained from tasks",
        }
    },
    {
        id: 5,
        name: "EVA",
        title: "The Proof warden",
        description: "Truth is my weapon",
        theme: "rose",
        image: "/6.png",
        type: "available",
        maxLevel: 4,
        Power: {
            "Blood Streak": "Consecutive task completions increase XP per task",
            "No-Sleep Protocol": "Increases the amount of XP gained from tasks",
            "Dexterity": "Increases the amount of XP gained from tasks",
        }
    }
]


// CAHARCTERS COLORS 
export const themeColors = {
  orange: {
    glow: "from-orange-500/40 via-amber-500/40 to-yellow-600/40",
    text: "text-orange-400",
    bg: "bg-orange-500",
    accent: "text-orange-400",
    bar: "from-orange-600 to-amber-400",
    shadow: "shadow-[0_0_12px_rgba(249,115,22,0.4)]",
    border: "border-orange-500/20",
    iconBg: "bg-orange-500/10",
  },
  green: {
    glow: "from-green-500/40 via-emerald-500/40 to-teal-600/40",
    text: "text-green-400",
    bg: "bg-green-500",
    accent: "text-green-400",
    bar: "from-green-600 to-emerald-400",
    shadow: "shadow-[0_0_12px_rgba(34,197,94,0.4)]",
    border: "border-green-500/20",
    iconBg: "bg-green-500/10",
  },
  red: {
    glow: "from-red-500/40 via-orange-500/40 to-rose-600/40",
    text: "text-red-400",
    bg: "bg-red-500",
    accent: "text-red-400",
    bar: "from-red-600 to-orange-400",
    shadow: "shadow-[0_0_12px_rgba(239,68,68,0.4)]",
    border: "border-red-500/20",
    iconBg: "bg-red-500/10",
  },
  blue: {
    glow: "from-blue-500/40 via-cyan-500/40 to-indigo-600/40",
    text: "text-blue-400",
    bg: "bg-blue-500",
    accent: "text-blue-400",
    bar: "from-blue-600 to-cyan-400",
    shadow: "shadow-[0_0_12px_rgba(59,130,246,0.4)]",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10",
  },
  yellow: {
    glow: "from-yellow-500/40 via-amber-500/40 to-orange-600/40",
    text: "text-yellow-400",
    bg: "bg-yellow-500",
    accent: "text-yellow-400",
    bar: "from-yellow-600 to-amber-400",
    shadow: "shadow-[0_0_12px_rgba(234,179,8,0.4)]",
    border: "border-yellow-500/20",
    iconBg: "bg-yellow-500/10",
  },
  purple: {
    glow: "from-purple-500/40 via-pink-500/40 to-violet-600/40",
    text: "text-purple-400",
    bg: "bg-purple-500",
    accent: "text-purple-400",
    bar: "from-purple-600 to-pink-400",
    shadow: "shadow-[0_0_12px_rgba(168,85,247,0.4)]",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/10",
  },
  rose: {
    glow: "from-rose-500 via-rose-500/40 to-violet-600/40",
    text: "text-rose-400",
    bg: "bg-rose-500",
    accent: "text-rose-400",
    bar: "from-rose-600 to-rose-400",
    shadow: "shadow-[0_0_12px_rgba(236,72,153,0.4)]",
    border: "border-pink-500/20",
    iconBg: "bg-pink-500/10",
  },
};