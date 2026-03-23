import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User } from 'lucide-react';
import './Chatbot.css';

// ── Knowledge base ─────────────────────────────────────────────────────────────
// Rule: prefer MULTI-WORD, SPECIFIC keyword phrases to avoid false-positive grabs.
// Single-word keywords are only used when truly unambiguous.
const knowledgeBase = [
  {
    id: 'phone',
    keywords: [
      'phone number', 'telephone', 'phone', 'mobile number', 'contact number',
      'how to reach', 'how can i reach', 'how to call', 'call hans', '0775',
    ],
    answer: 'You can reach Hans by phone at 📞 0775 139 223.',
    followUp: 'Feel free to call or text him directly at 0775 139 223.',
  },
  {
    id: 'identity',
    keywords: [
      'your name', 'full name', 'who are you', 'who is hans', 'introduce yourself',
      'what is your name', "what's your name", 'tell me about yourself',
    ],
    answer: 'My full name is Zudor Kristofi Hans Cristian. I am a 25-year-old Computer Science student and web developer from Oradea, Romania 👋',
    followUp: 'I go by Hans. I study Computer Science at the University of Oradea and I have hands-on work experience in IT support and customer relations.',
  },
  {
    id: 'age',
    keywords: [
      'how old', 'date of birth', 'birth date', 'when were you born',
      'your birthday', 'your age', 'years old', 'when is your birthday',
    ],
    answer: 'Hans is 25 years old, born on November 29, 2000 in Oradea, Romania 🎂',
    followUp: 'His birthday falls on 29 November. He has been living in Oradea since birth.',
  },
  {
    id: 'location',
    keywords: [
      'where are you from', 'where do you live', 'where were you born',
      'what city', 'which city', 'hometown', 'your city', 'your country',
      'oradea', 'romania',
    ],
    answer: 'Hans is from Oradea, Romania — a beautiful city in the north-west of the country, near the Hungarian border 📍',
    followUp: 'Oradea is known for its stunning Art Nouveau architecture and vibrant cultural scene. Hans has lived there his whole life.',
  },
  {
    id: 'highschool',
    keywords: [
      'high school', 'highschool', 'secondary school', 'friedrich schiller',
      'schiller', 'liceu', 'gymnasium', 'where did you go to school',
      'which school', 'what school',
    ],
    answer: 'Hans completed high school at the German Theoretical Lyceum "Friedrich Schiller" in Oradea, from 2015 to 2019 🏫',
    followUp: 'Friedrich Schiller is a prestigious German-language school in Oradea. Attending it is also the main reason Hans speaks German at an advanced C1 level.',
  },
  {
    id: 'university',
    keywords: [
      'where do you study', 'what do you study', 'university', 'college',
      'computer science degree', 'faculty', 'studying at', 'what are you studying',
      'your degree', 'your major', 'uni', 'student',
    ],
    answer: 'Hans is currently studying Computer Science at the University of Oradea 💻',
    followUp: 'His studies cover algorithms, programming, databases, and software engineering. He combines university with real-world professional experience in IT.',
  },
  {
    id: 'experience',
    keywords: [
      'work experience', 'work history', 'job history', 'career', 'employment',
      'where have you worked', 'previous jobs', 'past jobs', 'your cv',
      'your resume', 'jobs you have had', 'professional experience', 'all jobs',
    ],
    answer: 'Hans has a solid work history:\n• 🖥️ IT Support Technician at Everience (Nov 2025 – Feb 2026)\n• 🎧 Customer Support Agent at Teleperformance-Majorel (Aug 2023 – Oct 2024)\n• 🎬 Video Ads Creator at Web Push SRL (Summer 2018)\n• 🎥 Video Editor at AZHOME (Summer 2017)\n• 🤖 JavaScript Internship at Cylex (Summer 2017)',
    followUp: 'His background spans IT support, customer relations, video production, and software development — making him a versatile professional.',
  },
  {
    id: 'everience',
    keywords: [
      'everience', 'it support', 'it technician', 'support technician',
      'tech support job', 'it job', 'most recent job', 'last job', 'latest job',
      'current job', '2025 job', '2026 job',
    ],
    answer: 'From November 2025 to February 2026, Hans worked as an IT Support Technician at Everience 🖥️ — providing technical assistance and maintaining IT systems.',
    followUp: 'At Everience he handled hardware and software troubleshooting, user support tickets, and system maintenance on a daily basis.',
  },
  {
    id: 'teleperformance',
    keywords: [
      'teleperformance', 'majorel', 'customer support job', 'customer service job',
      'support agent', 'customer relations job', '2023 job', '2024 job', 'call centre',
    ],
    answer: 'From August 2023 to October 2024, Hans worked as a Customer Support Agent at Teleperformance-Majorel 🎧 — handling client relations and resolving customer issues.',
    followUp: 'This role sharpened his communication skills across multiple languages and gave him experience in a fast-paced, international environment.',
  },
  {
    id: 'webpush',
    keywords: [
      'web push', 'video ads', 'video advertising', 'mobile games job',
      'marketing videos', '2018 job', 'summer 2018', 'advertising job',
    ],
    answer: 'In the summer of 2018, Hans worked at Web Push SRL creating video advertisements for mobile games 🎬',
    followUp: 'It was his first paid job in a creative field, where he learned video production, storytelling for ads, and the mobile gaming market.',
  },
  {
    id: 'azhome',
    keywords: [
      'azhome', 'az home', 'video editor', 'cooking show', 'video editing job',
      '2017 video', 'summer 2017 editing',
    ],
    answer: 'In the summer of 2017, Hans worked as a video editor at AZHOME, editing footage for a cooking show 🎥',
    followUp: 'The role involved cutting, colour-grading, and syncing audio for TV-style cooking segments — great experience in professional video editing.',
  },
  {
    id: 'cylex',
    keywords: [
      'cylex', 'alexa skills', 'alexa', 'javascript internship', 'intern',
      'internship', 'cylex internship', '2017 internship',
    ],
    answer: 'In 2017, Hans did an internship at Cylex where he received JavaScript training and built Amazon Alexa skills 🤖',
    followUp: 'Building Alexa skills was his very first hands-on experience with voice interfaces and JavaScript — it sparked his passion for software development.',
  },
  {
    id: 'languages',
    keywords: [
      'what languages', 'which languages', 'languages do you speak', 'speak',
      'fluent in', 'german level', 'english level', 'language skills',
      'linguistic', 'multilingual', 'bilingual', 'c1', 'b2', 'german', 'english',
      'hungarian', 'romanian language',
    ],
    answer: 'Hans speaks four languages:\n• 🇷🇴 Romanian — native\n• 🇭🇺 Hungarian — native\n• 🇩🇪 German — advanced (C1)\n• 🇬🇧 English — advanced (B2)',
    followUp: 'Growing up in Oradea — a multicultural city with strong Hungarian and German roots — made multilingualism a natural part of his life.',
  },
  {
    id: 'hobbies',
    keywords: [
      'hobbies', 'hobby', 'what do you do for fun', 'free time', 'spare time',
      'interests', 'outside work', 'what are your hobbies', 'what do you enjoy',
      'skateboarding', 'skateboard', 'calisthenics', 'sport',
    ],
    answer: 'Hans\'s hobbies are skateboarding 🛹 and calisthenics 💪 — he loves staying active and challenging himself physically.',
    followUp: 'Calisthenics covers bodyweight exercises like pull-ups, dips, and muscle-ups. Combined with skateboarding, it keeps him both fit and creative in his free time.',
  },
  {
    id: 'father',
    keywords: [
      'your father', 'your dad', 'who is your father', 'who is your dad',
      'what does your father do', 'his father', 'zudor janos', 'dad do',
    ],
    pronouns: ['he writes', 'he is a writer', 'what does he do', 'his work', 'is he a poet'],
    answer: 'Hans\'s father is Zudor Janos — a Hungarian writer and poet ✍️ He has a deep passion for literature and the Hungarian language.',
    followUp: 'Zudor Janos writes poetry and prose in Hungarian. His creative work has been a major cultural influence on Hans.',
  },
  {
    id: 'mother',
    keywords: [
      'your mother', 'your mom', 'who is your mother', 'who is your mom',
      'what does your mother do', 'his mother', 'zudor eniko', 'eniko', 'mom do',
    ],
    pronouns: ['she paints', 'she is a painter', 'what does she do', 'her work', 'is she an artist'],
    answer: 'Hans\'s mother is Zudor Kristofi Eniko — a talented painter 🎨 She expresses herself through visual art.',
    followUp: 'Eniko\'s paintings reflect deep emotion and colour. Growing up around her art gave Hans a strong appreciation for creativity and aesthetics.',
  },
  {
    id: 'family',
    keywords: [
      'your family', 'your parents', 'tell me about your family', "hans's family",
      'both parents', 'mom and dad', 'mother and father',
    ],
    answer: 'Hans comes from a creative family: his father Zudor Janos is a Hungarian writer & poet ✍️, and his mother Zudor Kristofi Eniko is a painter 🎨',
    followUp: 'With a poet for a father and a painter for a mother, creativity runs deep in the family. Hans channels that into web development and technology.',
  },
  {
    id: 'color',
    keywords: [
      'favourite color', 'favorite color', 'favourite colour', 'favorite colour',
      'what color', 'what colour', 'fav color', 'color is',
    ],
    answer: 'Hans\'s favourite color is blue 💙 — calm, confident, and deep, just like the ocean.',
    followUp: 'He tends to favour blue tones in his design work too — it conveys trust and clarity.',
  },
  {
    id: 'greeting',
    keywords: [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
      'howdy', "what's up", 'sup', 'greetings',
    ],
    answer: 'Hey there! 👋 I\'m Hans\'s AI assistant. Ask me about his background, work, education, hobbies, languages, and more!',
    followUp: null,
  },
  {
    id: 'thanks',
    keywords: [
      'thank you', 'thanks', 'cheers', 'appreciate it', 'thx', 'ty',
      'that was helpful', 'great answer',
    ],
    answer: 'You\'re welcome! Feel free to ask me anything else about Hans 😊',
    followUp: null,
  },
];

// Follow-up triggers
const FOLLOWUP_TRIGGERS = [
  'tell me more', 'more about', 'what else', 'go on', 'elaborate',
  'explain more', 'expand on that', 'more details', 'interesting, and',
  'cool, and', 'continue', 'and then',
];

const FALLBACK = "I'm not sure about that! Try asking about Hans's work experience, education, hobbies, languages, or family 🤔";

// ── Scoring-based matcher ─────────────────────────────────────────────────────
// Sum the LENGTH of each matching keyword. Longer matches = more specific = higher score.
function scoreEntry(entry, lower) {
  let score = 0;
  for (const kw of entry.keywords) {
    if (lower.includes(kw)) score += kw.length;
  }
  return score;
}

function getReply(input, lastTopicId) {
  const lower = input.toLowerCase().trim();

  // 1. Follow-up → serve richer answer for the same topic
  if (FOLLOWUP_TRIGGERS.some((t) => lower.includes(t)) && lastTopicId) {
    const last = knowledgeBase.find((e) => e.id === lastTopicId);
    if (last?.followUp) return { answer: last.followUp, topicId: lastTopicId };
  }

  // 2. Pronoun resolution against last topic
  const MALE_P   = ['he ', "he's", 'him', 'his '];
  const FEMALE_P = ['she ', "she's", 'her '];
  if (lastTopicId) {
    const last = knowledgeBase.find((e) => e.id === lastTopicId);
    if (last?.pronouns) {
      const triggerMatch = last.pronouns.some((t) => lower.includes(t));
      if (triggerMatch) return { answer: last.followUp || last.answer, topicId: lastTopicId };
    }
    const hasMale   = MALE_P.some((p) => lower.includes(p));
    const hasFemale = FEMALE_P.some((p) => lower.includes(p));
    if (hasMale   && lastTopicId === 'father')     return { answer: last?.followUp || last?.answer, topicId: 'father' };
    if (hasFemale && lastTopicId === 'mother')
      return { answer: last?.followUp || last?.answer, topicId: lastTopicId };
  }

  // 3. Score every entry — pick the highest scoring one
  let bestEntry = null;
  let bestScore = 0;
  for (const entry of knowledgeBase) {
    const s = scoreEntry(entry, lower);
    if (s > bestScore) { bestScore = s; bestEntry = entry; }
  }

  if (bestEntry) return { answer: bestEntry.answer, topicId: bestEntry.id };
  return { answer: FALLBACK, topicId: lastTopicId };
}

// ── Quick-reply chips ─────────────────────────────────────────────────────────
const CHIPS = [
  'How old are you?',
  'What are your hobbies?',
  'What work experience do you have?',
  'What languages do you speak?',
  'Tell me about your family',
];

// ── Component ─────────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! 👋 I'm Hans's AI assistant. Ask me about his background, work, education, hobbies, languages, and more!" },
  ]);
  const [input, setInput]         = useState('');
  const [isTyping, setIsTyping]   = useState(false);
  const [lastTopic, setLastTopic] = useState(null);
  const messagesRef               = useRef(null);

  // Scroll only the messages box — not the page
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text) => {
      const trimmed = (text || input).trim();
      if (!trimmed || isTyping) return;
      setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
      setInput('');
      setIsTyping(true);
      const currentTopic = lastTopic;
      setTimeout(() => {
        const { answer, topicId } = getReply(trimmed, currentTopic);
        setIsTyping(false);
        setLastTopic(topicId);
        setMessages((prev) => [...prev, { from: 'bot', text: answer }]);
      }, 850);
    },
    [input, isTyping, lastTopic]
  );

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="chatbot-wrapper glass">
      <div className="chatbot-header">
        <Bot size={20} />
        <span>Ask me about Hans</span>
        <span className="chatbot-status-dot" title="Online" />
      </div>

      <div className="chatbot-messages" ref={messagesRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.from}`}>
            {msg.from === 'bot'  && <Bot  size={16} className="bubble-icon" />}
            {msg.from === 'user' && <User size={16} className="bubble-icon" />}
            <span>{msg.text}</span>
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble bot typing">
            <Bot size={16} className="bubble-icon" />
            <span className="typing-dots"><span /><span /><span /></span>
          </div>
        )}
      </div>

      <div className="chatbot-chips">
        {CHIPS.map((chip) => (
          <button key={chip} className="chip" onClick={() => sendMessage(chip)}>
            {chip}
          </button>
        ))}
      </div>

      <div className="chatbot-input-row">
        <input
          type="text"
          className="chatbot-input"
          placeholder="Ask something about Hans…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="chatbot-send btn btn-primary" onClick={() => sendMessage()} disabled={isTyping}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
