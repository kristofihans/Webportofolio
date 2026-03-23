import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User } from 'lucide-react';
import './Chatbot.css';

// ── Knowledge base ────────────────────────────────────────────────────────────
// Each entry has: id, keywords, pronouns (pronoun hints for context), answer, followUp (richer detail)
const knowledgeBase = [
  {
    id: 'identity',
    keywords: ['name', 'who are you', 'who is hans', 'call you', 'your name', 'full name'],
    pronouns: [],
    answer: 'My full name is Zudor Kristofi Hans Cristian 👋 Nice to meet you!',
    followUp: 'I go by Hans. I am a 25-year-old Computer Science student and web developer from Oradea, Romania.',
  },
  {
    id: 'age',
    keywords: ['age', 'how old', 'born', 'birthday', 'birth', '2029', 'date of birth', 'years old'],
    pronouns: [],
    answer: 'I am 25 years old, born on November 29, 2029 🎂',
    followUp: 'My birthday is on November 29th. I was born in 2029, making me 25 years old right now.',
  },
  {
    id: 'highschool',
    keywords: ['highschool', 'high school', 'gymnasium', 'friedrich', 'schiller', 'secondary school'],
    pronouns: [],
    answer: 'I finished high school at Friedrich Schiller in Oradea 🏫',
    followUp: 'Friedrich Schiller is a well-known high school in Oradea. I completed my studies there before moving on to university.',
  },
  {
    id: 'university',
    keywords: ['university', 'college', 'study', 'studying', 'degree', 'computer science', 'uni', 'faculty'],
    pronouns: [],
    answer: 'I am currently studying Computer Science at the University of Oradea 💻',
    followUp: 'Computer Science involves algorithms, programming, databases, and much more. I love the problem-solving side of it!',
  },
  {
    id: 'hobbies',
    keywords: ['hobby', 'hobbies', 'free time', 'sport', 'interests', 'like to do', 'skateboard', 'calisthenics', 'spare time', 'passion'],
    pronouns: [],
    answer: 'My hobbies are skateboarding 🛹 and calisthenics 💪 I love staying active!',
    followUp: 'Calisthenics means bodyweight training — things like pull-ups, dips and muscle-ups. Skateboarding keeps things fun and creative.',
  },
  {
    id: 'father',
    keywords: ['father', 'dad', 'papa', 'janos', 'zudor janos'],
    pronouns: ['he writes', 'he is a', 'what does he do', 'his work', 'his job', 'he a'],
    answer: 'My father is Zudor Janos — a Hungarian writer and poet ✍️',
    followUp: 'My father Zudor Janos writes poetry and literature in Hungarian. He is a significant creative influence on me.',
  },
  {
    id: 'mother',
    keywords: ['mother', 'mom', 'mama', 'eniko', 'mum'],
    pronouns: ['she paints', 'she is a', 'what does she do', 'her work', 'her job', 'she a', 'is she'],
    answer: 'My mother is Zudor Kristofi Eniko — a talented painter 🎨',
    followUp: 'My mother Eniko is a visual artist who paints beautifully. Art and creativity run in the family!',
  },
  {
    id: 'family',
    keywords: ['parent', 'parents', 'family', 'relatives', 'both parents'],
    pronouns: [],
    answer: 'My father Zudor Janos is a Hungarian writer & poet ✍️, and my mother Zudor Kristofi Eniko is a painter 🎨',
    followUp: 'I have a very creative family! My dad writes poetry and my mom paints. And I build things digitally — we each have our medium.',
  },
  {
    id: 'color',
    keywords: ['color', 'colour', 'favourite color', 'favorite color', 'favourite colour'],
    pronouns: [],
    answer: 'My favourite color is blue 💙',
    followUp: 'Blue — like deep ocean blue. It feels calm and confident at the same time.',
  },
  {
    id: 'friends',
    keywords: ['friend', 'friends', 'mate', 'mates', 'buddy', 'buddies', 'raul', 'david', 'mark', 'robert', 'samuel', 'magor', 'gergely', 'daniel', 'cousin', 'cousins', 'group'],
    pronouns: [],
    answer: 'My friends are Raul Bente, David Vas-Klein, Mark Madarasz, Robert Vajna, Samuel Veres, Magor Jakab, and my cousins Gergely Erdodi & Daniel Nagy-Kristofi 🤝',
    followUp: 'We are a solid group. My cousins Gergely and Daniel feel just like friends too — we hang out a lot.',
  },
  {
    id: 'girlfriend',
    keywords: ['girlfriend', 'partner', 'relationship', 'dating', 'raluca', 'love life', 'significant other'],
    pronouns: ['how long', 'how did', 'together', 'she like'],
    answer: 'My girlfriend is Raluca ❤️',
    followUp: 'Her name is Raluca. I am very happy with her 😊',
  },
  {
    id: 'location',
    keywords: ['city', 'live', 'from', 'home', 'location', 'where', 'oradea', 'romania', 'country'],
    pronouns: [],
    answer: 'I am from Oradea, Romania 📍',
    followUp: 'Oradea is a beautiful city in north-western Romania, near the Hungarian border. It has great architecture and a vibrant culture.',
  },
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'sup', 'good day', 'greetings', 'howdy'],
    pronouns: [],
    answer: "Hey there! 👋 I'm Hans's AI assistant. Ask me anything about him!",
    followUp: null,
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'thx', 'ty', 'appreciate', 'cheers'],
    pronouns: [],
    answer: "You're welcome! Feel free to ask me anything else 😊",
    followUp: null,
  },
];

// Phrases that signal a follow-up / pronoun reference
const FOLLOWUP_TRIGGERS = [
  'tell me more', 'more about', 'what else', 'go on', 'continue',
  'elaborate', 'explain', 'expand', 'details', 'interesting',
  'cool', 'nice', 'wow', 'really', 'seriously',
];

const MALE_PRONOUNS   = ['he ', "he's", 'him', 'his ', 'himself'];
const FEMALE_PRONOUNS = ['she ', "she's", 'her ', 'herself'];

const FALLBACK = "Hmm, I'm not sure about that one! Try asking about Hans's age, hobbies, family, friends, or education 🤔";

// ── Context-aware reply engine ────────────────────────────────────────────────
function getReply(input, lastTopicId, history) {
  const lower = input.toLowerCase().trim();

  // 1. Check follow-up triggers (e.g. "tell me more", "elaborate")
  const isFollowUp = FOLLOWUP_TRIGGERS.some((t) => lower.includes(t));
  if (isFollowUp && lastTopicId) {
    const last = knowledgeBase.find((e) => e.id === lastTopicId);
    if (last?.followUp) return { answer: last.followUp, topicId: lastTopicId };
  }

  // 2. Check pronoun resolution against last topic
  if (lastTopicId) {
    const hasMale   = MALE_PRONOUNS.some((p) => lower.includes(p));
    const hasFemale = FEMALE_PRONOUNS.some((p) => lower.includes(p));
    const last = knowledgeBase.find((e) => e.id === lastTopicId);

    if (last) {
      // Check if any topic-specific pronoun triggers match
      const triggerMatch = last.pronouns.some((t) => lower.includes(t));
      if (triggerMatch) {
        return { answer: last.followUp || last.answer, topicId: lastTopicId };
      }

      // Generic pronoun resolution: "he" → father, "she" → mother, otherwise last topic
      if (hasMale && lastTopicId === 'father') {
        return { answer: last.followUp || last.answer, topicId: 'father' };
      }
      if (hasFemale && (lastTopicId === 'mother' || lastTopicId === 'girlfriend')) {
        return { answer: last.followUp || last.answer, topicId: lastTopicId };
      }
      // Short ambiguous message → try last topic
      if (lower.split(/\s+/).length <= 5 && (hasMale || hasFemale)) {
        return { answer: last.followUp || last.answer, topicId: lastTopicId };
      }
    }
  }

  // 3. Also handle: user asks about "him" / "he" generally — try to infer father
  if (MALE_PRONOUNS.some((p) => lower.includes(p)) && !lastTopicId) {
    const father = knowledgeBase.find((e) => e.id === 'father');
    return { answer: father.answer, topicId: 'father' };
  }
  if (FEMALE_PRONOUNS.some((p) => lower.includes(p)) && !lastTopicId) {
    const mother = knowledgeBase.find((e) => e.id === 'mother');
    return { answer: mother.answer, topicId: 'mother' };
  }

  // 4. Keyword match (standard)
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { answer: entry.answer, topicId: entry.id };
    }
  }

  // 5. Fallback — suggest based on history to avoid repeating same suggestion
  return { answer: FALLBACK, topicId: lastTopicId };
}

// ── Quick-reply chips ─────────────────────────────────────────────────────────
const CHIPS = [
  'How old are you?',
  'What are your hobbies?',
  'Where do you study?',
  'Who is your girlfriend?',
  'Tell me about your parents',
  'Who are your friends?',
];

// ── Component ─────────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! 👋 I'm Hans's AI assistant. Ask me anything about him!" },
  ]);
  const [input, setInput]           = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [lastTopic, setLastTopic]   = useState(null);
  const messagesRef                 = useRef(null);
  const bottomRef                   = useRef(null);

  // Scroll only the messages container — NOT the whole page
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

      // Capture current topic for closure
      const currentTopic = lastTopic;

      setTimeout(() => {
        const { answer, topicId } = getReply(trimmed, currentTopic, []);
        setIsTyping(false);
        setLastTopic(topicId);
        setMessages((prev) => [...prev, { from: 'bot', text: answer }]);
      }, 850);
    },
    [input, isTyping, lastTopic]
  );

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-wrapper glass">
      <div className="chatbot-header">
        <Bot size={18} />
        <span>Ask me about Hans</span>
        <span className="chatbot-status-dot" title="Online" />
      </div>

      <div className="chatbot-messages" ref={messagesRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.from}`}>
            {msg.from === 'bot'  && <Bot  size={15} className="bubble-icon" />}
            {msg.from === 'user' && <User size={15} className="bubble-icon" />}
            <span>{msg.text}</span>
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble bot typing">
            <Bot size={15} className="bubble-icon" />
            <span className="typing-dots">
              <span /><span /><span />
            </span>
          </div>
        )}
        <div ref={bottomRef} />
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
        <button
          className="chatbot-send btn btn-primary"
          onClick={() => sendMessage()}
          disabled={isTyping}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
