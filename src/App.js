import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── DESIGN TOKENS (MATRIX GREEN THEME) ───────────────────────────────────────
const C = {
  bg0:'#000000', bg1:'#050505', bg2:'#0a0a0a', bg3:'#111111',
  cyan:'#00FF41', cyanDim:'rgba(0,255,65,0.12)', cyanBorder:'rgba(0,255,65,0.3)',
  purple:'#00D4AA', purpleDim:'rgba(0,212,170,0.10)',
  gold:'#FFDD00', goldDim:'rgba(255,221,0,0.12)',
  green:'#00FF41', greenDim:'rgba(0,255,65,0.10)',
  red:'#FF3366', redDim:'rgba(255,51,102,0.10)',
  text:'#E0FFE0', textSec:'#88AA88', textMuted:'#446644',
  border:'rgba(0,255,65,0.2)', borderSub:'rgba(0,255,65,0.08)',
  glass:'rgba(0,20,0,0.7)', glassLight:'rgba(0,40,0,0.5)',
};
const ease = 'cubic-bezier(0.4,0,0.2,1)';

// ─── IMAGE POOLS ─────────────────────────────────────────────────────────────
const DEF_AI_IMGS = [
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996401/AI1.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996401/AI2.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996400/AI3.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996400/womens_suffrage_2_AI_kfnqe1.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996400/tourist_dzmkpv.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996399/Pangolin_1_AI_pqmqvv.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996398/titantic_1_alfmf7.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996397/northern_lights_1_AI_qqwp3y.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996395/MtFuji_1_AI_eekcck.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/launch_2_AI_o7jtyw.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/hongkong_2_AI_ufdrgd.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/frog_1_AI_dev1iu.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/kids_doing_art_2_AI_x192qj.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/egyptian_papyrus_2_AI_v2wkzj.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996393/DOG_ai_utbgqr.webp",
];
const DEF_REAL_IMGS = [
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996661/womens_suffrage_1_REAL_eyzwim.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996659/Pangolin_2_REAL_dbn0ho.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996658/northern_lights_2_REAL_knmncc.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996655/MtFuji_2_REAL_qk4jaz.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996648/launch_1_REAL_x0t9jb.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996648/kids_doing_art_1_akc14f.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996644/hongkong_1_REAL_yhfmys.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996643/frog_2_rz44cs.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996640/egyptian_papyrus_1_REAL_aekcek.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996639/DOG_ze8dds.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996635/9843_x82dhz.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995876/samples/landscapes/nature-mountains.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995875/samples/food/spices.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995872/samples/people/jazz.jpg",
];

// ─── EXPANDED QUESTIONS (50+) ─────────────────────────────────────────────────
const TQS = [
  {id:1,cat:'Corporate Email',isAI:true,content:"Please find attached herewith the comprehensive documentation pertaining to the aforementioned project deliverables. Kindly revert at your earliest convenience to facilitate the requisite action items.",explanation:"Stacked buzzwords ('aforementioned', 'kindly revert', 'requisite') with zero specific context. AI corporate emails are polished but empty."},
  {id:2,cat:'Corporate Email',isAI:false,content:"Sarah — quick one. The Q3 numbers still aren't matching what finance sent over. I've checked twice. Can you loop in Derek before the 3pm? I'd do it myself but he never replies to my emails.",explanation:"Specific names, a real problem, mild frustration, and the complaint about Derek — all human markers."},
  {id:3,cat:'Blog Post',isAI:true,content:"The intersection of technology and human creativity represents a fascinating paradox in our modern age. As artificial intelligence continues to evolve, we must thoughtfully examine how these innovations reshape our understanding of authenticity.",explanation:"Classic AI blog opener: vague thesis, no personal angle. 'Fascinating paradox' and 'thoughtfully examine' are AI tells."},
  {id:4,cat:'Blog Post',isAI:false,content:"I've been a freelance copywriter for eleven years and the best productivity advice I ever got came from a plumber: 'Bill by the job, not the hour.' Changed everything. Still weird it came from a plumber.",explanation:"Specific detail (11 years, a plumber), irony, and callback humor. AI doesn't naturally set up jokes like this."},
  {id:5,cat:'Social Post',isAI:true,content:"🚀 Excited to share I've completed my certification! This achievement represents months of dedication. Truly grateful for everyone who supported me on this incredible journey! #Growth #Learning #Professional",explanation:"Emoji opener + 'incredible journey' + generic gratitude + hashtag stack = AI LinkedIn formula."},
  {id:6,cat:'Social Post',isAI:false,content:"my coworker just described someone as 'having main character energy' in a performance review and i need everyone to know that it worked and we gave her a raise",explanation:"Timing, surprise, and punchline structure. The twist that it worked subverts expectation perfectly."},
  {id:7,cat:'Chat Message',isAI:false,content:"bro are u still coming tonight\nalso what time\nalso can u get the drinks i'll venmo u\nalso actually nvm i'll get them\nactually no u get them",explanation:"Stream-of-consciousness indecision across multiple 'also' lines is authentic human texting."},
  {id:8,cat:'Chat Message',isAI:true,content:"Hey! Just checking in. It's been a while since we last connected and I wanted to make sure you know I'm thinking of you. Hope everything is going well on your end! 😊",explanation:"'On your end', 'I wanted to make sure you know I'm thinking of you' — textbook AI reconnection message."},
  {id:9,cat:'Story Excerpt',isAI:true,content:"The moonlight cascaded through ancient oak branches, dappling the forest floor with silver light. Elena felt the weight of centuries in the silence, each shadow whispering secrets of lives lived and loves lost.",explanation:"Four metaphors in two sentences. AI stacks poetic imagery without restraint."},
  {id:10,cat:'Story Excerpt',isAI:false,content:"My grandfather kept a jar of peanut butter in his truck for seventeen years. Not emergency peanut butter. Just peanut butter. When I asked why, he looked at me like I'd asked why he needed oxygen.",explanation:"The internal categorization ('not emergency peanut butter') is observed from real life."},
  {id:11,cat:'News Article',isAI:true,content:"Officials confirmed Thursday that preliminary discussions have yielded a framework for dialogue, with parties expressing cautious optimism about the potential for constructive engagement going forward.",explanation:"'Cautious optimism', 'constructive engagement' — AI news-speak that reports nothing specific."},
  {id:12,cat:'News Article',isAI:false,content:"The man who illegally parked in the same handicap spot every Tuesday for six years has been identified as the city's deputy parking enforcement director. He has been placed on administrative leave.",explanation:"The irony is structured with journalistic restraint. Just facts, trusting the reader to feel it."},
  {id:13,cat:'Product Copy',isAI:true,content:"Transform your wellness ritual with our revolutionary blend of adaptogenic botanicals and cutting-edge bioavailable nutrients. Formulated to optimize your body's natural resilience pathways.",explanation:"'Adaptogenic', 'bioavailable', 'resilience pathways' — sounds scientific without saying what it does."},
  {id:14,cat:'Product Copy',isAI:false,content:"This is a good notebook. The paper is thick. Pens don't bleed through. The binding holds up. I've filled four of them. I have nothing interesting to say except that I keep buying it.",explanation:"Deliberate anti-climax is a human rhetorical move. The proof is behavioral."},
  {id:15,cat:'Meeting Notes',isAI:false,content:"NOTES — Marketing sync 11am\n- 40 min spent on logo color (still unresolved)\n- Product roadmap: 8 minutes\n- ACTION: Dave to 'look into' the analytics thing by Friday (he won't)",explanation:"The parenthetical '(he won't)' is human editorializing with institutional knowledge."},
  {id:16,cat:'Support Reply',isAI:true,content:"Thank you for reaching out! I completely understand how frustrating this must be. Your satisfaction is our absolute top priority and we're committed to resolving this. Please allow 3–5 business days.",explanation:"'Absolute top priority', 'completely understand' — standard AI empathy script with zero specifics."},
  {id:17,cat:'Support Reply',isAI:false,content:"Hi — I looked into this. When you clicked 'cancel' it actually submitted the order instead. That's a bug on our end, not user error. I'm refunding you now. Sorry.",explanation:"Specific cause identified, blame accepted, action taken immediately. Human directness."},
  {id:18,cat:'Personal',isAI:false,content:"Here's the thing about anxiety nobody tells you: it's exhausting not because of what it makes you feel, but because of all the work you do making sure nobody can see it.",explanation:"A specific, non-obvious insight that reframes a common experience precisely."},
  {id:19,cat:'Personal',isAI:true,content:"The experience of solitude teaches us profound lessons about the nature of self. In quiet reflection, away from modern connectivity, we discover the rich interior landscape of our authentic being.",explanation:"'Rich interior landscape', 'authentic being' — AI depth without a single specific moment."},
  {id:20,cat:'Social Post',isAI:false,content:"three years sober today. still not sure what to do when people ask what changed. the real answer is i got tired in a way sleep didn't fix. anyway. three years.",explanation:"'Tired in a way sleep didn't fix' is an original metaphor. The three-word ending shows restraint."},
  {id:21,cat:'Corporate Email',isAI:false,content:"Per my last email (sent Monday, Tuesday, and this morning) — I'm following up. Please just let me know if this moved to someone else. I'm not upset. I just need to update the tracker.",explanation:"'I'm not upset' (which implies mild upset) is human passive-aggressive email DNA."},
  {id:22,cat:'Meeting Notes',isAI:true,content:"Key takeaways: Cross-functional alignment was achieved on Q4 priorities. Action items assigned to stakeholders with agreed timelines. Follow-up cadence established to ensure accountability.",explanation:"'Cross-functional alignment', 'follow-up cadence' — corporate placeholders with no real content."},
  {id:23,cat:'Chat Message',isAI:false,content:"can i ask you something weird\nnvm it's fine\nactually: do you think people can tell when you're pretending to be okay or do they just not look closely enough\nnvm ignore that",explanation:"The retraction-ask-retraction spiral is authentic emotional vulnerability in text form."},
  {id:24,cat:'News Article',isAI:false,content:"A retired teacher, 74, has spent a decade cataloging every pothole on the city's north side. She maintains a spreadsheet with 2,300 entries. Three have been fixed. She considers this progress.",explanation:"'She considers this progress' — journalist's choice to end without comment. Numbers do the work."},
  {id:25,cat:'Blog Post',isAI:true,content:"Building authentic human connections in an increasingly digital world requires intentionality and vulnerability. By prioritizing deep, meaningful interactions over surface-level engagement, we cultivate genuine belonging.",explanation:"'Intentionality', 'vulnerability', 'genuine belonging' — therapy buzzwords, no personal story."},
  {id:26,cat:'Review',isAI:true,content:"This product exceeded all my expectations! The quality is outstanding and the customer service was phenomenal. I would highly recommend this to anyone looking for a premium experience. Five stars!",explanation:"Generic superlatives without any specific detail about what made it good. Classic AI review pattern."},
  {id:27,cat:'Review',isAI:false,content:"Bought this for my mom. She called me crying because it reminded her of one my dad got her in 1987. He passed last year. Anyway it works fine. Buttons are a little stiff.",explanation:"Unexpected emotional story followed by mundane product feedback. Humans bury feelings like this."},
  {id:28,cat:'Dating Profile',isAI:true,content:"I'm an adventurous soul who loves exploring new places, trying exotic cuisines, and engaging in meaningful conversations. Looking for someone who shares my passion for life and isn't afraid to be authentic.",explanation:"'Adventurous soul', 'meaningful conversations', 'passion for life' — dating app AI filler."},
  {id:29,cat:'Dating Profile',isAI:false,content:"I have strong opinions about the correct way to load a dishwasher. I will die on this hill. Also I cry at dog commercials but not at funerals and I don't know what that says about me.",explanation:"Specific quirks and self-aware contradictions. Humans share weird specifics; AI stays generic."},
  {id:30,cat:'Apology',isAI:true,content:"I sincerely apologize for any inconvenience this may have caused. Please know that your concerns are valid and I take full responsibility. I am committed to doing better and ensuring this doesn't happen again.",explanation:"'Any inconvenience', 'your concerns are valid', 'committed to doing better' — apology template."},
  {id:31,cat:'Apology',isAI:false,content:"I was wrong. Not 'wrong but also you were mean about it' wrong. Just wrong. I'm sorry. I'll bring beer on Saturday and we don't have to talk about it unless you want to.",explanation:"Preempting defensiveness, specific remedy offered, emotional intelligence about not forcing discussion."},
  {id:32,cat:'Recipe Intro',isAI:true,content:"There's something magical about the aroma of freshly baked bread wafting through your kitchen. This recipe combines traditional techniques with modern convenience to create a loaf that's both rustic and refined.",explanation:"'Something magical', 'rustic and refined' — food blog AI padding before the actual recipe."},
  {id:33,cat:'Recipe Intro',isAI:false,content:"My grandmother made this every Sunday until she forgot how. Then I made it for her and she cried because she remembered. Then I cried. Anyway here's the recipe, it's easy, you need like six things.",explanation:"Emotional context that earns the recipe's significance, then abrupt pivot to practicality."},
  {id:34,cat:'Complaint',isAI:true,content:"I am writing to express my dissatisfaction with the service I received. The experience fell far short of reasonable expectations and I believe this matter requires immediate attention and resolution.",explanation:"Formal complaint language without any specific incident, detail, or demand. AI template."},
  {id:35,cat:'Complaint',isAI:false,content:"Your website charged me twice, then your chatbot apologized 47 times without fixing it, then your phone system played 20 minutes of jazz before disconnecting. I have screenshots. This is absurd.",explanation:"Specific sequence of failures, exact numbers, and barely-contained rage. Human frustration."},
  {id:36,cat:'Cover Letter',isAI:true,content:"I am thrilled to apply for this exciting opportunity. With my strong communication skills and proven track record of excellence, I am confident I would be a valuable addition to your dynamic team.",explanation:"'Thrilled', 'exciting opportunity', 'dynamic team' — AI cover letter buzzword bingo."},
  {id:37,cat:'Cover Letter',isAI:false,content:"I saw this job and thought 'oh no, I actually want this one.' I've been doing adjacent work for three years and I'm good at it but this is the actual thing. I attached my portfolio. It has boats.",explanation:"Vulnerability about wanting the job, self-aware humor, and the inexplicable 'boats' detail."},
  {id:38,cat:'Breakup Text',isAI:true,content:"I've done a lot of reflecting and I think we both deserve to find happiness, even if that means our paths diverge. I'll always cherish the memories we shared and wish you nothing but the best.",explanation:"'Paths diverge', 'cherish the memories', 'wish you the best' — breakup by AI committee."},
  {id:39,cat:'Breakup Text',isAI:false,content:"I've been trying to write this for three days. I keep deleting it. I don't think we work. I don't know why. You didn't do anything. I just feel like I'm performing instead of existing. I'm sorry.",explanation:"Meta-commentary on difficulty writing, admission of confusion, authentic emotional struggle."},
  {id:40,cat:'LinkedIn Post',isAI:true,content:"Humbled and honored to announce I've accepted a new role! This journey has taught me the importance of perseverance, growth mindset, and surrounding yourself with amazing people. Excited for what's next! 🙏",explanation:"'Humbled and honored', 'growth mindset', 'amazing people' — LinkedIn engagement farming."},
  {id:41,cat:'LinkedIn Post',isAI:false,content:"Got laid off today. Two months after my best performance review. At 9am. On Zoom. With 47 other people. The HR lady's camera was off and a dog was barking. Anyway, hiring? I do marketing.",explanation:"Specific humiliating details, dark humor, and immediate pivot to practical need."},
  {id:42,cat:'Thank You Note',isAI:true,content:"I wanted to express my heartfelt gratitude for your thoughtful gift. Your kindness and generosity truly touched my heart. I am so blessed to have you in my life. Thank you from the bottom of my heart!",explanation:"'Heartfelt gratitude', 'truly touched my heart', 'blessed' — AI thank you card generator."},
  {id:43,cat:'Thank You Note',isAI:false,content:"The plant you sent is still alive (3 weeks now, personal record). I put it where I can see it when I'm on calls. It makes me think someone cares if I'm okay. Thank you. I'm okay. Mostly.",explanation:"Specific survival detail, self-deprecating humor, and vulnerable admission buried at the end."},
  {id:44,cat:'Bio',isAI:true,content:"A passionate innovator with expertise in leveraging cutting-edge technologies to drive transformational change. Dedicated to creating synergies between stakeholders and delivering measurable impact across diverse domains.",explanation:"'Passionate innovator', 'transformational change', 'synergies' — AI bio buzzword soup."},
  {id:45,cat:'Bio',isAI:false,content:"I make spreadsheets for a living and I'm weirdly good at it. Outside work I collect vintage calculators (yes, really) and I'm teaching myself to juggle. It's going badly. Two kids, one patient wife.",explanation:"Specific odd hobby, self-deprecation, and affectionate family reference."},
  {id:46,cat:'Email Subject',isAI:true,content:"Exciting Opportunity to Collaborate and Drive Mutual Success",explanation:"Generic corporate buzzwords promising nothing specific. AI subject line generator."},
  {id:47,cat:'Email Subject',isAI:false,content:"re: re: re: the thing (NOT the other thing)",explanation:"Thread continuation with in-joke reference. Only makes sense with shared context."},
  {id:48,cat:'Excuse',isAI:true,content:"Unfortunately, due to unforeseen circumstances beyond my control, I will be unable to attend. I sincerely apologize for any inconvenience and hope we can reschedule at a mutually convenient time.",explanation:"'Unforeseen circumstances', 'beyond my control' — vague excuse template."},
  {id:49,cat:'Excuse',isAI:false,content:"I can't come. My cat learned how to open the fridge and ate an entire rotisserie chicken and now I'm watching her to make sure she doesn't die. She seems fine but smug. Rain check?",explanation:"Absurdly specific situation with personality observation ('smug'). You can't make this up."},
  {id:50,cat:'Motivational',isAI:true,content:"Remember: every setback is a setup for a comeback. Your potential is limitless, and today is the perfect day to take the first step toward becoming the best version of yourself. You've got this!",explanation:"'Setback is a setup for a comeback', 'limitless potential', 'best version' — motivational AI."},
  {id:51,cat:'Motivational',isAI:false,content:"You're not lazy. You're exhausted from trying to meet standards that weren't designed with you in mind. Rest isn't giving up. Sometimes it's the most productive thing you can do.",explanation:"Reframes shame, acknowledges systemic factors, gives permission. Specific emotional insight."},
];

const AI_NEWS = [
  {cat:'Model Capabilities',title:'Frontier Models Cross New Reasoning Benchmarks',body:'Leading AI systems now score above 90% on complex multi-step reasoning that stumped models 18 months ago.'},
  {cat:'Text Generation',title:'AI Writing Passes Expert Blind Reviews',body:'GPT-class models produced prose that editors could not distinguish from human experts across 6 of 10 domains.'},
  {cat:'Image & Video',title:'Synthetic Video Reaches Broadcast Quality',body:'AI-generated clips now pass authenticity checks in 73% of viewer studies.'},
  {cat:'Detection Gap',title:'Deepfake Detectors Fall Behind',body:'Best detectors now flag only 58% of synthetic media — down from 82% in 2023.'},
  {cat:'Workforce',title:'78% of Knowledge Workers Use AI Weekly',body:'Global survey confirms AI tool adoption has crossed mainstream threshold.'},
  {cat:'Regulation',title:'Global Disclosure Standards Converge',body:'EU AI Act and US frameworks align on labeling requirements for AI content.'},
];

const CPU_PLAYERS = [
  {id:'cpu1',nickname:'NeonFox',accuracy:0.75,speed:6},
  {id:'cpu2',nickname:'CircuitSage',accuracy:0.62,speed:9},
  {id:'cpu3',nickname:'DataPhantom',accuracy:0.82,speed:4},
  {id:'cpu4',nickname:'ByteWitch',accuracy:0.70,speed:7},
];
const TAGLINES = ["Can you detect the synthetic?","AI or human — you decide.","The line is fading. Find it.","Trust nothing. Verify everything.","Train your perception."];
const ADMIN_EMAILS = ["admin@aiillusion.com"];

// ─── UTILS ────────────────────────────────────────────────────────────────────
function calcScore(correct, conf, tLeft) {
  if (!correct) return Math.round(-25 - ((conf/100)*15));
  let sc = 100;
  const spent = 15 - tLeft;
  if (spent <= 3) sc += 50; else if (spent <= 5) sc += 30;
  if (conf > 0) sc += Math.round((conf/100)*40);
  return sc;
}
function mkAudio() { try { return new (window.AudioContext||window.webkitAudioContext)(); } catch { return null; } }
function tone(ctx, f, t, d, v=0.06) {
  if (!ctx) return;
  try { const o=ctx.createOscillator(),g=ctx.createGain(); o.connect(g); g.connect(ctx.destination); o.type=t; o.frequency.value=f; g.gain.setValueAtTime(v,ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+d); o.start(); o.stop(ctx.currentTime+d); } catch {}
}
const SFX = {
  click: c => tone(c,900,'sine',0.04,0.05),
  ok: c => { tone(c,523,'sine',0.15,0.07); setTimeout(()=>tone(c,784,'sine',0.2,0.07),80); },
  fail: c => tone(c,220,'sawtooth',0.22,0.09),
  tick: c => tone(c,1100,'square',0.02,0.04),
};
const useIsMobile = () => {
  const [m,setM] = useState(typeof window!=='undefined'?window.innerWidth<768:false);
  useEffect(()=>{ const h=()=>setM(window.innerWidth<768); window.addEventListener('resize',h); return()=>window.removeEventListener('resize',h); },[]);
  return m;
};

// ─── GLOBAL CSS WITH MATRIX EFFECTS ───────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px}
html,body,#root{min-height:100%;min-height:100dvh}
body{background:#000;color:#E0FFE0;font-family:'Inter',system-ui,-apple-system,sans-serif;overflow-x:hidden;-webkit-tap-highlight-color:transparent;-webkit-font-smoothing:antialiased}
::placeholder{color:#446644}
select option{background:#0a0a0a;color:#E0FFE0}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,255,65,0.3);border-radius:2px}
::-webkit-scrollbar-thumb:hover{background:rgba(0,255,65,0.5)}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
@keyframes glow{0%,100%{filter:drop-shadow(0 0 2px #00FF41)}50%{filter:drop-shadow(0 0 12px #00FF41)}}
@keyframes matrixFall{0%{transform:translateY(-100%);opacity:0}10%{opacity:1}90%{opacity:0.3}100%{transform:translateY(100vh);opacity:0}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes countPop{0%{transform:scale(1.4);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes tagIn{0%{opacity:0;transform:translateY(12px)}15%,85%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-12px)}}
@keyframes resultIn{0%{opacity:0;transform:scale(0.9)}100%{opacity:1;transform:none}}
@keyframes scan{0%{top:-10%}100%{top:110%}}
@keyframes borderGlow{0%,100%{border-color:rgba(0,255,65,0.2)}50%{border-color:rgba(0,255,65,0.5)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}

.glass{background:linear-gradient(135deg,rgba(0,30,0,0.8),rgba(0,15,0,0.9));backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(0,255,65,0.15);box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,255,65,0.1),inset 0 -1px 0 rgba(0,0,0,0.3)}
.glass-light{background:linear-gradient(135deg,rgba(0,40,0,0.6),rgba(0,20,0,0.7));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.glow-text{text-shadow:0 0 10px rgba(0,255,65,0.5),0 0 20px rgba(0,255,65,0.3),0 0 30px rgba(0,255,65,0.2)}
.glow-box{box-shadow:0 0 20px rgba(0,255,65,0.15),0 8px 32px rgba(0,0,0,0.4)}
`;

// ─── MATRIX RAIN BACKGROUND ──────────────────────────────────────────────────
function MatrixBg() {
  const cols = 30;
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden',background:'linear-gradient(180deg,#000 0%,#001100 50%,#000 100%)'}}>
      {/* Matrix rain columns */}
      {Array.from({length:cols}).map((_,i)=>(
        <div key={i} style={{
          position:'absolute',
          left:`${(i/cols)*100}%`,
          top:0,
          width:'20px',
          height:'100%',
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          animation:`matrixFall ${8+Math.random()*12}s linear infinite`,
          animationDelay:`${-Math.random()*20}s`,
          opacity:0.15+Math.random()*0.15,
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:'12px',
          color:'#00FF41',
          letterSpacing:'4px',
          writingMode:'vertical-rl',
        }}>
          {Array.from({length:30}).map((_,j)=>(
            <span key={j} style={{opacity:0.3+Math.random()*0.7}}>{Math.random()>0.5?'1':'0'}</span>
          ))}
        </div>
      ))}
      {/* Radial overlay */}
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 50% at 50% 50%,transparent 0%,rgba(0,0,0,0.7) 100%)'}}/>
      {/* Scan line */}
      <div style={{position:'absolute',left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#00FF41,transparent)',animation:'scan 8s linear infinite',opacity:0.3}}/>
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function HexLogo({size=52}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{flexShrink:0,filter:'drop-shadow(0 0 8px rgba(0,255,65,0.4))'}}>
      <defs>
        <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FF41"/>
          <stop offset="100%" stopColor="#00D4AA"/>
        </linearGradient>
      </defs>
      <polygon points="32,3 58,18 58,46 32,61 6,46 6,18" fill="rgba(0,255,65,0.05)" stroke="url(#hg1)" strokeWidth="1.5"/>
      <polygon points="32,12 50,22 50,42 32,52 14,42 14,22" fill="none" stroke="rgba(0,255,65,0.2)" strokeWidth="0.5"/>
      <polygon points="32,20 42,26 42,38 32,44 22,38 22,26" fill="rgba(0,255,65,0.08)" stroke="url(#hg1)" strokeWidth="1"/>
      <circle cx="32" cy="32" r="4" fill="#00FF41"/>
    </svg>
  );
}

// ─── GLASS PANEL ─────────────────────────────────────────────────────────────
function Panel({children, style={}, variant='default'}) {
  const base = {
    background:'linear-gradient(135deg,rgba(0,30,0,0.85),rgba(0,10,0,0.95))',
    backdropFilter:'blur(20px)',
    WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(0,255,65,0.15)',
    borderRadius:'16px',
    boxShadow:'0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(0,255,65,0.08)',
    position:'relative',
    overflow:'hidden',
  };
  const variants = {
    default: base,
    hero: {...base,border:'1px solid rgba(0,255,65,0.25)',boxShadow:'0 0 40px rgba(0,255,65,0.1),0 8px 32px rgba(0,0,0,0.5)'},
    correct: {...base,background:'linear-gradient(135deg,rgba(0,60,20,0.9),rgba(0,30,10,0.95))',border:'1px solid rgba(0,255,65,0.4)'},
    wrong: {...base,background:'linear-gradient(135deg,rgba(60,0,20,0.9),rgba(30,0,10,0.95))',border:'1px solid rgba(255,51,102,0.4)'},
    gold: {...base,background:'linear-gradient(135deg,rgba(40,35,0,0.9),rgba(20,15,0,0.95))',border:'1px solid rgba(255,221,0,0.3)'},
  };
  return (
    <div style={{...variants[variant]||variants.default,...style}}>
      <div style={{position:'absolute',top:0,left:'15%',right:'15%',height:'1px',background:'linear-gradient(90deg,transparent,rgba(0,255,65,0.3),transparent)'}}/>
      {children}
    </div>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
function Btn({children,onClick,variant='primary',disabled,style={},full,size='md'}) {
  const sizes = {
    sm:{padding:'10px 18px',fontSize:'12px',minHeight:'38px',borderRadius:'10px'},
    md:{padding:'14px 24px',fontSize:'14px',minHeight:'50px',borderRadius:'12px'},
    lg:{padding:'18px 32px',fontSize:'16px',minHeight:'58px',borderRadius:'14px'}
  };
  const variants = {
    primary:{background:'linear-gradient(135deg,rgba(0,255,65,0.15),rgba(0,212,170,0.1))',border:'1px solid rgba(0,255,65,0.3)',color:'#00FF41',boxShadow:'0 4px 20px rgba(0,255,65,0.15)'},
    secondary:{background:'rgba(0,255,65,0.05)',border:'1px solid rgba(0,255,65,0.15)',color:'#88AA88'},
    ghost:{background:'transparent',border:'none',color:'#446644',padding:'8px 14px',minHeight:'36px'},
    danger:{background:'rgba(255,51,102,0.1)',border:'1px solid rgba(255,51,102,0.3)',color:'#FF3366'},
  };
  const s = sizes[size]||sizes.md;
  const v = variants[variant]||variants.primary;
  return (
    <button onClick={disabled?undefined:onClick} style={{
      fontFamily:"'Inter',system-ui,sans-serif",fontWeight:600,letterSpacing:'0.02em',
      cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.4:1,
      display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',
      width:full?'100%':'auto',transition:`all 200ms ${ease}`,
      ...s,...v,...style
    }}>{children}</button>
  );
}

// ─── INPUT ────────────────────────────────────────────────────────────────────
function HudInput({style={}, ...props}) {
  return <input {...props} style={{
    fontFamily:"'Inter',system-ui,sans-serif",
    background:'rgba(0,255,65,0.03)',
    border:'1px solid rgba(0,255,65,0.15)',
    borderRadius:'12px',
    color:'#E0FFE0',
    padding:'14px 16px',
    fontSize:'14px',
    width:'100%',
    outline:'none',
    minHeight:'50px',
    transition:`all 200ms ${ease}`,
    ...style
  }}/>;
}

// ─── TIMER RING ───────────────────────────────────────────────────────────────
function TimerRing({t,total=15}) {
  const R=36, CIR=2*Math.PI*R, off=CIR*(1-t/total);
  const col = t<=3?'#FF3366':t<=7?'#FFDD00':'#00FF41';
  return (
    <div style={{position:'relative',width:'96px',height:'96px',flexShrink:0}}>
      <svg width="96" height="96" style={{transform:'rotate(-90deg)',filter:`drop-shadow(0 0 ${t<=5?12:4}px ${col})`}}>
        <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(0,255,65,0.1)" strokeWidth="4"/>
        <circle cx="48" cy="48" r={R} fill="none" stroke={col} strokeWidth="4" strokeLinecap="round" strokeDasharray={CIR} strokeDashoffset={off} style={{transition:'stroke-dashoffset 1s linear, stroke 0.3s'}}/>
      </svg>
      <div key={t} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:'28px',fontWeight:800,color:col,fontFamily:"'Orbitron',monospace",animation:`countPop 0.3s ${ease}`,textShadow:`0 0 20px ${col}`}}>{t}</div>
    </div>
  );
}

// ─── RADAR SCAN ───────────────────────────────────────────────────────────────
function Radar({correct}) {
  const metrics = ['Pattern Recognition','Semantic Analysis','Style Consistency','Emotional Markers'];
  const vals = useRef(metrics.map(()=>Math.round(25+Math.random()*70))).current;
  const col = correct?'#00FF41':'#FF3366';
  return (
    <Panel variant={correct?'correct':'wrong'} style={{padding:'16px 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'14px'}}>
        <div style={{width:'2px',height:'16px',background:col,borderRadius:'1px',boxShadow:`0 0 8px ${col}`}}/>
        <span style={{fontSize:'10px',letterSpacing:'0.14em',color:col,fontWeight:700,textTransform:'uppercase',fontFamily:"'Orbitron',monospace"}}>Analysis Matrix</span>
      </div>
      {metrics.map((m,i)=>(
        <div key={m} style={{marginBottom:i<3?'12px':0}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
            <span style={{fontSize:'11px',color:'#88AA88'}}>{m}</span>
            <span style={{fontSize:'11px',color:col,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{vals[i]}%</span>
          </div>
          <div style={{height:'3px',background:'rgba(0,255,65,0.1)',borderRadius:'2px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${vals[i]}%`,background:`linear-gradient(90deg,${col},${correct?'#00D4AA':'#FF6688'})`,borderRadius:'2px',boxShadow:`0 0 8px ${col}`}}/>
          </div>
        </div>
      ))}
    </Panel>
  );
}

// ─── IMAGE CONTAINER WITH FALLBACK ───────────────────────────────────────────
function ImageContainer({url}) {
  const [status, setStatus] = useState('loading');
  const timeoutRef = useRef();

  useEffect(() => {
    setStatus('loading');
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStatus(s => s === 'loading' ? 'fallback' : s);
    }, 4000);
    return () => clearTimeout(timeoutRef.current);
  }, [url]);

  const openImage = () => window.open(url, '_blank', 'noopener');

  if (status === 'fallback' || status === 'error') {
    return (
      <div style={{width:'100%',aspectRatio:'16/9',borderRadius:'12px',background:'linear-gradient(135deg,rgba(0,40,0,0.8),rgba(0,20,0,0.9))',border:'1px solid rgba(0,255,65,0.2)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px',textAlign:'center'}}>
        <div style={{width:'64px',height:'64px',borderRadius:'16px',background:'rgba(0,255,65,0.1)',border:'1px solid rgba(0,255,65,0.2)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px'}}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00FF41" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
        <div style={{fontSize:'12px',letterSpacing:'0.1em',color:'#00FF41',fontWeight:600,marginBottom:'8px',fontFamily:"'Orbitron',monospace"}}>EXTERNAL IMAGE</div>
        <div style={{fontSize:'13px',color:'#88AA88',marginBottom:'16px',maxWidth:'280px',lineHeight:1.5}}>Click below to view the image and analyze it</div>
        <button onClick={openImage} style={{
          fontFamily:"'Inter',sans-serif",background:'rgba(0,255,65,0.1)',border:'1px solid rgba(0,255,65,0.3)',
          borderRadius:'10px',color:'#00FF41',padding:'12px 24px',fontSize:'13px',fontWeight:600,cursor:'pointer',
          display:'flex',alignItems:'center',gap:'8px'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Open Image
        </button>
      </div>
    );
  }

  return (
    <div style={{width:'100%',aspectRatio:'16/9',borderRadius:'12px',overflow:'hidden',background:'#000',position:'relative'}}>
      {status === 'loading' && (
        <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(0,255,65,0.02),rgba(0,255,65,0.08),rgba(0,255,65,0.02))',backgroundSize:'200% 100%',animation:'shimmer 2s infinite'}}/>
      )}
      <img
        src={url}
        alt="Analyze"
        onLoad={() => {clearTimeout(timeoutRef.current); setStatus('loaded');}}
        onError={() => {clearTimeout(timeoutRef.current); setStatus('error');}}
        style={{width:'100%',height:'100%',objectFit:'cover',opacity:status==='loaded'?1:0,transition:'opacity 0.4s'}}
      />
      {status === 'loaded' && (
        <>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at center,transparent 40%,rgba(0,0,0,0.6) 100%)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',left:0,right:0,height:'1px',background:'linear-gradient(90deg,transparent,#00FF41,transparent)',animation:'scan 6s linear infinite',opacity:0.5}}/>
        </>
      )}
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({user,snd,setSnd,goto,openRules,signOut,clk,scr}) {
  const mob = useIsMobile();
  const noBack = ['landing','auth','mode_select'].includes(scr);
  const hb = {fontFamily:"'Inter',sans-serif",fontSize:'12px',fontWeight:500,background:'rgba(0,255,65,0.05)',border:'1px solid rgba(0,255,65,0.15)',borderRadius:'10px',color:'#88AA88',padding:mob?'8px 12px':'8px 16px',cursor:'pointer',minHeight:'38px',transition:`all 200ms ${ease}`};
  return (
    <header style={{position:'fixed',top:0,left:0,right:0,zIndex:300,height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between',padding:`0 ${mob?'12px':'24px'}`,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(20px)',borderBottom:'1px solid rgba(0,255,65,0.1)'}}>
      <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
        {!noBack && <button onClick={()=>{clk();goto('mode_select');}} style={{...hb,color:'#446644'}}>← Back</button>}
        <button onClick={()=>{clk();goto(user?'mode_select':'landing');}} style={{...hb,display:'flex',alignItems:'center',gap:'8px',color:'#00FF41',fontWeight:700,border:'1px solid rgba(0,255,65,0.3)'}}>
          <HexLogo size={22}/>{!mob&&<span style={{fontFamily:"'Orbitron',monospace",fontSize:'11px',letterSpacing:'0.1em'}}>AI ARENA</span>}
        </button>
      </div>
      <div style={{display:'flex',gap:'6px',alignItems:'center'}}>
        <button onClick={()=>{clk();openRules();}} style={hb}>Rules</button>
        {user&&!mob&&<button onClick={()=>{clk();goto('profile');}} style={hb}>◉ {(user.nickname||user.name).slice(0,10)}</button>}
        {user?.isAdmin&&<button onClick={()=>{clk();goto('admin');}} style={{...hb,color:'#FFDD00',borderColor:'rgba(255,221,0,0.3)'}}>Admin</button>}
        <button onClick={()=>setSnd(s=>!s)} style={hb}>{snd?'🔊':'🔇'}</button>
        {user&&<button onClick={()=>{clk();signOut();}} style={{...hb,color:'#446644'}}>Exit</button>}
      </div>
    </header>
  );
}

// ─── NEWS TICKER ──────────────────────────────────────────────────────────────
function NewsTicker() {
  const [idx,setIdx] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setIdx(i=>(i+1)%AI_NEWS.length),6000); return()=>clearInterval(t); },[]);
  const n = AI_NEWS[idx];
  return (
    <Panel style={{padding:'20px'}}>
      <div style={{fontSize:'9px',letterSpacing:'0.15em',color:'#00FF41',fontWeight:700,marginBottom:'12px',fontFamily:"'Orbitron',monospace"}}>◉ INTEL BRIEF</div>
      <div style={{fontSize:'9px',color:'#446644',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.1em'}}>{n.cat}</div>
      <div style={{fontSize:'14px',fontWeight:700,color:'#E0FFE0',marginBottom:'8px',lineHeight:1.4}}>{n.title}</div>
      <div style={{fontSize:'12px',color:'#88AA88',lineHeight:1.6}}>{n.body}</div>
      <div style={{display:'flex',gap:'4px',marginTop:'14px',justifyContent:'center'}}>
        {AI_NEWS.map((_,i)=><div key={i} style={{width:i===idx?'20px':'6px',height:'3px',borderRadius:'2px',background:i===idx?'#00FF41':'rgba(0,255,65,0.2)',transition:'all 0.3s',boxShadow:i===idx?'0 0 8px #00FF41':'none'}}/>)}
      </div>
    </Panel>
  );
}

// ─── RULES MODAL ─────────────────────────────────────────────────────────────
function RulesModal({close}) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',zIndex:600,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
      <Panel variant="hero" style={{padding:'28px',maxWidth:'460px',width:'100%',maxHeight:'85vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}}>
          <span style={{fontSize:'12px',letterSpacing:'0.14em',color:'#00FF41',fontWeight:700,fontFamily:"'Orbitron',monospace"}}>◉ PROTOCOL</span>
          <button onClick={close} style={{background:'none',border:'none',color:'#446644',cursor:'pointer',fontSize:'24px'}}>×</button>
        </div>
        {[['Mission','Classify each text or image as AI-generated or human-created.'],
          ['Confidence','Optional 50-100% multiplier. Higher = bigger bonus/penalty.'],
          ['Scoring','✓ Correct +100 · ✗ Wrong -25 · Fast bonus: ≤3s +50, ≤5s +30'],
          ['Timer','15 seconds per question. Auto-advances on timeout.'],
        ].map(([t,b])=>(
          <div key={t} style={{background:'rgba(0,255,65,0.03)',border:'1px solid rgba(0,255,65,0.1)',borderRadius:'10px',padding:'14px',marginBottom:'10px'}}>
            <div style={{fontSize:'13px',fontWeight:700,color:'#00FF41',marginBottom:'4px'}}>{t}</div>
            <div style={{fontSize:'12px',color:'#88AA88',lineHeight:1.5}}>{b}</div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg,type='info',onClose}) {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
  const col = {info:'#00FF41',success:'#00FF41',error:'#FF3366'}[type];
  return (
    <div style={{position:'fixed',top:'72px',right:'16px',zIndex:800,animation:`slideRight 0.3s ${ease}`}}>
      <Panel style={{padding:'14px 20px',borderLeft:`3px solid ${col}`}}>
        <div style={{fontSize:'13px',color:'#E0FFE0'}}>{msg}</div>
      </Panel>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const mob = useIsMobile();
  const [aiImgs] = useState(DEF_AI_IMGS);
  const [realImgs] = useState(DEF_REAL_IMGS);
  
  const ALL_QS = useMemo(()=>{
    const imgQ = [
      ...aiImgs.map((url,i)=>({id:`img_ai_${i}`,type:'image',cat:'Visual Analysis',isAI:true,url,explanation:"AI images often show: perfect symmetry, smooth textures, inconsistent lighting, or uncanny details that don't quite cohere."})),
      ...realImgs.map((url,i)=>({id:`img_real_${i}`,type:'image',cat:'Visual Analysis',isAI:false,url,explanation:"Real photos have natural imperfections: organic grain, authentic lens effects, candid moments, and contextual details algorithms struggle to synthesize."})),
    ];
    return [...TQS.map(q=>({...q,type:'text'})),...imgQ];
  },[aiImgs,realImgs]);

  const [scr,setScr] = useState('landing');
  const [users,setUsers] = useState([{id:'admin',name:'Admin',email:'admin@aiillusion.com',password:'admin123',nickname:'SysOp',occupation:'Professional',isAdmin:true,sessions:[],used:[]}]);
  const [me,setMe] = useState(null);
  const [snd,setSnd] = useState(true);
  const [rules,setRules] = useState(false);
  const [authMode,setAuthMode] = useState('login');
  const [form,setForm] = useState({name:'',email:'',password:'',nickname:'',occupation:'Student',consent:false});
  const [formErr,setFormErr] = useState('');
  const [toast,setToast] = useState(null);
  const [gameMode,setGameMode] = useState('solo');
  const [qCount,setQCount] = useState(10);
  const [qs,setQs] = useState([]);
  const [qi,setQi] = useState(0);
  const [tLeft,setTLeft] = useState(15);
  const [conf,setConf] = useState(null);
  const [shown,setShown] = useState(false);
  const [score,setScore] = useState(0);
  const [answers,setAnswers] = useState([]);
  const [qStart,setQStart] = useState(0);
  const [arenaPlayers,setArenaPlayers] = useState([]);
  const [roomCode,setRoomCode] = useState('');
  const [cpuCount,setCpuCount] = useState(2);
  const [tagIdx,setTagIdx] = useState(0);
  const [adminLogin,setAdminLogin] = useState(false);
  const [aForm,setAForm] = useState({email:'',password:''});
  const [aErr,setAErr] = useState('');
  const [aTab,setATab] = useState('users');
  const [pForm,setPForm] = useState({});
  const [joinCode,setJoinCode] = useState('');
  const [lbOpen,setLbOpen] = useState(false);

  const audioRef=useRef(null), timerRef=useRef(null), shownRef=useRef(false), autoRef=useRef(null), scoreRef=useRef(0), answersRef=useRef([]);
  useEffect(()=>{scoreRef.current=score;},[score]);
  useEffect(()=>{answersRef.current=answers;},[answers]);

  const getCtx=useCallback(()=>{ if(!snd)return null; if(!audioRef.current)audioRef.current=mkAudio(); try{audioRef.current?.resume();}catch{} return audioRef.current; },[snd]);
  const clk=useCallback(()=>SFX.click(getCtx()),[getCtx]);
  const doOk=useCallback(()=>SFX.ok(getCtx()),[getCtx]);
  const doFail=useCallback(()=>SFX.fail(getCtx()),[getCtx]);
  const doTick=useCallback(()=>SFX.tick(getCtx()),[getCtx]);
  const showToast=(msg,type='info')=>setToast({msg,type});

  useEffect(()=>{ if(scr!=='landing')return; const t=setInterval(()=>setTagIdx(i=>(i+1)%TAGLINES.length),3500); return()=>clearInterval(t); },[scr]);

  useEffect(()=>{
    const active=['game','arena_game'].includes(scr);
    if(!active||shown){clearInterval(timerRef.current);return;}
    shownRef.current=false; setTLeft(15); setQStart(Date.now());
    timerRef.current=setInterval(()=>{
      setTLeft(t=>{
        const n=t-1;
        if(n<=3&&n>0)doTick();
        if(n<=0){
          clearInterval(timerRef.current);
          if(!shownRef.current){
            shownRef.current=true; doFail();
            setScore(s=>s-25);
            setAnswers(a=>{const q=qs[qi];return[...a,{q,chosen:null,correct:false,sc:-25,conf:0,time:15}];});
            setArenaPlayers(p=>cpuRound(p,-25));
            setShown(true);
          }
          return 0;
        }
        return n;
      });
    },1000);
    return()=>clearInterval(timerRef.current);
  },[scr,qi,shown,doTick,doFail,qs]);

  useEffect(()=>{
    if(!shown||!['game','arena_game'].includes(scr))return;
    clearTimeout(autoRef.current);
    autoRef.current=setTimeout(advance,3200);
    return()=>clearTimeout(autoRef.current);
  },[shown,scr]);

  function cpuRound(players,humanSc){
    return players.map(p=>{
      if(!p.isCPU)return{...p,score:(p.score||0)+humanSc};
      const ok=Math.random()<p.accuracy;
      const cf=[50,70,90][Math.floor(Math.random()*3)];
      const sc=calcScore(ok,cf,15-p.speed);
      return{...p,score:(p.score||0)+sc,lastR:{correct:ok,sc}};
    }).sort((a,b)=>(b.score||0)-(a.score||0));
  }

  const startGame=useCallback((mode,count)=>{
    clk();
    const gm=mode||gameMode, qc=count||qCount;
    const used=me?.used||[];
    let pool=ALL_QS.filter(q=>!used.includes(q.id));
    if(pool.length<qc)pool=ALL_QS;
    const picked=[...pool].sort(()=>Math.random()-.5).slice(0,qc);
    setQs(picked); setQi(0); setScore(0); setAnswers([]);
    setConf(null); setShown(false); setLbOpen(false);
    shownRef.current=false; scoreRef.current=0; answersRef.current=[];
    if(gm==='arena'){
      const human={id:me?.id||'h',nickname:me?.nickname||me?.name||'You',isCPU:false,score:0};
      const cpus=CPU_PLAYERS.slice(0,cpuCount).map(c=>({...c,isCPU:true,score:0}));
      setArenaPlayers([human,...cpus]);
      setScr('arena_game');
    } else setScr('game');
  },[clk,gameMode,qCount,me,cpuCount,ALL_QS]);

  const submit=useCallback((ans)=>{
    if(shown||shownRef.current)return;
    shownRef.current=true; clearInterval(timerRef.current); clearTimeout(autoRef.current);
    const q=qs[qi], correct=(ans==='AI')===q.isAI;
    const tSpent=(Date.now()-qStart)/1000;
    const sc=calcScore(correct,conf||0,15-tSpent);
    setScore(s=>s+sc);
    setAnswers(a=>[...a,{q,chosen:ans,correct,sc,conf:conf||0,time:tSpent.toFixed(1)}]);
    if(correct)doOk(); else doFail();
    setUsers(p=>p.map(u=>u.id===me?.id?{...u,used:[...(u.used||[]),q.id]}:u));
    setMe(p=>p?{...p,used:[...(p.used||[]),q.id]}:p);
    setArenaPlayers(p=>cpuRound(p,sc));
    setShown(true);
  },[shown,conf,qs,qi,qStart,doOk,doFail,me]);

  const advance=useCallback(()=>{
    clearTimeout(autoRef.current); shownRef.current=false;
    setShown(false); setConf(null);
    const next=qi+1;
    if(next>=qs.length){
      const curr=answersRef.current, fs=scoreRef.current;
      const acc=curr.length?Math.round(curr.filter(a=>a.correct).length/curr.length*100):0;
      const sess={score:fs,acc,date:new Date().toISOString()};
      setUsers(p=>p.map(u=>u.id===me?.id?{...u,sessions:[...(u.sessions||[]),sess]}:u));
      setMe(p=>p?{...p,sessions:[...(p.sessions||[]),sess]}:p);
      setScr('end');
    } else setQi(next);
  },[qi,qs.length,me]);

  const doAuth=useCallback(()=>{
    clk();
    if(authMode==='login'){
      const u=users.find(u=>u.email===form.email&&u.password===form.password);
      if(!u){setFormErr('Invalid credentials.');return;}
      setMe(u); setFormErr(''); setScr('mode_select'); showToast(`Welcome, ${u.nickname||u.name}!`,'success');
    } else {
      if(!form.name||!form.email||!form.password||!form.nickname){setFormErr('All fields required.');return;}
      if(!form.consent){setFormErr('Accept terms to continue.');return;}
      if(users.find(u=>u.email===form.email)){setFormErr('Email exists.');return;}
      const nu={id:Date.now().toString(),...form,isAdmin:ADMIN_EMAILS.includes(form.email),sessions:[],used:[]};
      setUsers(p=>[...p,nu]); setMe(nu); setFormErr(''); setScr('mode_select');
      showToast('Profile created!','success');
    }
  },[clk,authMode,form,users]);

  const signOut=()=>{clk();setMe(null);setScr('landing');};
  const goto=s=>{clk();setScr(s);};

  // ─── STYLES ───
  const PAGE = {minHeight:'100vh',minHeight:'100dvh',background:'#000',color:'#E0FFE0',fontFamily:"'Inter',system-ui,sans-serif",position:'relative',paddingTop:'60px'};
  const COL = {display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'};
  const WRAP = {position:'relative',zIndex:1,width:'100%',maxWidth:'960px',margin:'0 auto',padding:mob?'20px 16px':'40px 24px'};
  const LBL = {fontSize:'10px',letterSpacing:'0.14em',color:'#00FF41',fontWeight:700,textTransform:'uppercase',marginBottom:'8px',fontFamily:"'Orbitron',monospace"};
  const hdr = me?<Header user={me} snd={snd} setSnd={setSnd} goto={goto} openRules={()=>setRules(true)} signOut={signOut} clk={clk} scr={scr}/>:null;

  // ═══════════════════════════════════════════════════════════════════════════
  // LANDING
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='landing') return (
    <div style={{...PAGE,...COL,paddingTop:0,minHeight:'100vh'}}>
      <style>{CSS}</style>
      <MatrixBg/>
      <div style={{position:'fixed',top:'12px',right:'16px',zIndex:400}}>
        <Btn onClick={()=>setSnd(s=>!s)} variant="secondary" size="sm">{snd?'🔊':'🔇'}</Btn>
      </div>
      <div style={{position:'fixed',bottom:'12px',right:'16px',zIndex:400}}>
        <button onClick={()=>setAdminLogin(true)} style={{background:'none',border:'none',color:'rgba(0,255,65,0.1)',cursor:'pointer',fontSize:'10px'}}>●</button>
      </div>
      <div style={{position:'relative',zIndex:1,maxWidth:'640px',width:'100%',padding:mob?'80px 20px 40px':'0 32px',textAlign:'center'}}>
        <div style={{animation:'float 4s ease-in-out infinite',marginBottom:'24px'}}><HexLogo size={mob?80:100}/></div>
        <div className="glow-text" style={{fontSize:'12px',letterSpacing:'0.3em',color:'#00FF41',marginBottom:'16px',fontFamily:"'Orbitron',monospace",fontWeight:700}}>AI ILLUSION ARENA</div>
        <h1 className="glow-text" style={{fontSize:mob?'clamp(28px,8vw,40px)':'clamp(40px,5vw,56px)',fontWeight:900,lineHeight:1.1,margin:'0 0 12px',color:'#E0FFE0'}}>
          DETECT THE<br/>SYNTHETIC
        </h1>
        <div style={{height:'28px',overflow:'hidden',marginBottom:'36px'}}>
          <div key={tagIdx} style={{fontSize:'14px',color:'#88AA88',animation:`tagIn 3.5s ${ease}`}}>{TAGLINES[tagIdx]}</div>
        </div>
        <div style={{display:'flex',flexDirection:mob?'column':'row',gap:'12px',justifyContent:'center',maxWidth:'360px',margin:'0 auto'}}>
          <Btn onClick={()=>{clk();setAuthMode('register');setScr('auth');}} size="lg" style={{flex:1,fontFamily:"'Orbitron',monospace",letterSpacing:'0.08em',fontSize:'13px'}}>PLAY NOW</Btn>
          <Btn onClick={()=>{clk();setAuthMode('login');setScr('auth');}} variant="secondary" size="lg" style={{flex:1}}>Sign In</Btn>
        </div>
        <div style={{display:'flex',gap:'32px',justifyContent:'center',marginTop:'48px',paddingTop:'32px',borderTop:'1px solid rgba(0,255,65,0.1)'}}>
          {[[TQS.length+'+','Text'],[aiImgs.length+realImgs.length+'+','Images'],['4','CPU Rivals']].map(([v,l])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div className="glow-text" style={{fontSize:mob?'24px':'32px',fontWeight:800,color:'#00FF41',fontFamily:"'Orbitron',monospace"}}>{v}</div>
              <div style={{fontSize:'11px',color:'#446644',marginTop:'4px',letterSpacing:'0.08em',textTransform:'uppercase'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {adminLogin&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.95)',zIndex:500,...COL,padding:'20px'}}>
          <Panel variant="hero" style={{padding:'28px',width:'100%',maxWidth:'340px'}}>
            <div style={LBL}>Admin Access</div>
            <HudInput placeholder="Email" value={aForm.email} onChange={e=>setAForm(p=>({...p,email:e.target.value}))} style={{marginBottom:'10px'}}/>
            <HudInput type="password" placeholder="Password" value={aForm.password} onChange={e=>setAForm(p=>({...p,password:e.target.value}))} style={{marginBottom:'12px'}}/>
            {aErr&&<div style={{color:'#FF3366',fontSize:'12px',marginBottom:'12px'}}>{aErr}</div>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
              <Btn onClick={()=>{const u=users.find(u=>u.email===aForm.email&&u.password===aForm.password&&u.isAdmin);if(u){setMe(u);setAdminLogin(false);setScr('admin');setAErr('');}else setAErr('Access denied.');}}>Enter</Btn>
              <Btn onClick={()=>{setAdminLogin(false);setAErr('');}} variant="secondary">Cancel</Btn>
            </div>
          </Panel>
        </div>
      )}
      {rules&&<RulesModal close={()=>setRules(false)}/>}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='auth') return (
    <div style={{...PAGE,...COL,padding:mob?'80px 16px 24px':'24px'}}>
      <style>{CSS}</style>
      <MatrixBg/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:'400px'}}>
        <button onClick={()=>{clk();setScr('landing');}} style={{background:'none',border:'none',color:'#446644',cursor:'pointer',marginBottom:'16px',fontSize:'13px'}}>← Back</button>
        <Panel variant="hero" style={{padding:mob?'24px':'32px'}}>
          <div style={{textAlign:'center',marginBottom:'24px'}}><HexLogo size={48}/></div>
          <h2 style={{fontSize:'20px',fontWeight:800,textAlign:'center',marginBottom:'4px',color:'#E0FFE0'}}>{authMode==='login'?'Welcome Back':'Join Arena'}</h2>
          <p style={{color:'#446644',fontSize:'13px',textAlign:'center',marginBottom:'24px'}}>{authMode==='login'?'Sign in to continue':'Create your profile'}</p>
          {authMode==='register'&&<>
            <HudInput placeholder="Full Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={{marginBottom:'10px'}}/>
            <HudInput placeholder="Nickname" value={form.nickname} onChange={e=>setForm(p=>({...p,nickname:e.target.value}))} style={{marginBottom:'10px'}}/>
            <select value={form.occupation} onChange={e=>setForm(p=>({...p,occupation:e.target.value}))} style={{fontFamily:"'Inter',sans-serif",background:'rgba(0,255,65,0.03)',border:'1px solid rgba(0,255,65,0.15)',borderRadius:'12px',color:'#E0FFE0',padding:'14px 16px',fontSize:'14px',width:'100%',outline:'none',minHeight:'50px',marginBottom:'10px'}}>
              <option>Student</option><option>Professional</option><option>Researcher</option><option>Other</option>
            </select>
          </>}
          <HudInput placeholder="Email" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} style={{marginBottom:'10px'}}/>
          <HudInput placeholder="Password" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} style={{marginBottom:authMode==='register'?'12px':'20px'}}/>
          {authMode==='register'&&(
            <label style={{display:'flex',gap:'10px',alignItems:'flex-start',marginBottom:'20px',cursor:'pointer',fontSize:'12px',color:'#88AA88'}}>
              <input type="checkbox" checked={form.consent} onChange={e=>setForm(p=>({...p,consent:e.target.checked}))} style={{marginTop:'2px',accentColor:'#00FF41'}}/>
              I agree to terms and data processing
            </label>
          )}
          {formErr&&<div style={{color:'#FF3366',fontSize:'12px',marginBottom:'14px',padding:'10px',background:'rgba(255,51,102,0.1)',borderRadius:'8px'}}>{formErr}</div>}
          <Btn onClick={doAuth} full size="lg" style={{marginBottom:'14px',fontFamily:"'Orbitron',monospace"}}>{authMode==='login'?'AUTHENTICATE':'CREATE'}</Btn>
          <p style={{textAlign:'center',fontSize:'13px',color:'#446644'}}>
            {authMode==='login'?'New? ':'Have account? '}
            <button onClick={()=>{setAuthMode(m=>m==='login'?'register':'login');setFormErr('');}} style={{background:'none',border:'none',color:'#00FF41',cursor:'pointer',fontWeight:600}}>{authMode==='login'?'Register':'Sign In'}</button>
          </p>
        </Panel>
      </div>
      {rules&&<RulesModal close={()=>setRules(false)}/>}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MODE SELECT
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='mode_select') return (
    <div style={PAGE}>
      <style>{CSS}</style>
      <MatrixBg/>{hdr}
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div style={WRAP}>
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={LBL}>Select Mission</div>
          <h2 className="glow-text" style={{fontSize:mob?'24px':'32px',fontWeight:800,color:'#E0FFE0'}}>Choose Mode</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:'16px'}}>
          {[{key:'solo',icon:'◉',title:'Solo Training',desc:'Practice at your own pace with full analytics.',color:'#00FF41'},
            {key:'arena',icon:'⬡',title:'Neural Arena',desc:'Compete against CPU opponents in real-time.',color:'#00D4AA'}
          ].map(m=>(
            <Panel key={m.key} style={{padding:mob?'24px':'28px',cursor:'pointer',transition:'all 0.2s'}} onClick={()=>{clk();setGameMode(m.key);setScr(m.key==='solo'?'solo_setup':'arena_setup');}}>
              <div style={{fontSize:'36px',marginBottom:'12px',filter:`drop-shadow(0 0 12px ${m.color})`}}>{m.icon}</div>
              <div style={{fontSize:'10px',letterSpacing:'0.12em',color:m.color,marginBottom:'8px',fontFamily:"'Orbitron',monospace"}}>{m.key.toUpperCase()}</div>
              <h3 style={{fontSize:'18px',fontWeight:700,marginBottom:'8px',color:'#E0FFE0'}}>{m.title}</h3>
              <p style={{fontSize:'13px',color:'#88AA88',lineHeight:1.5}}>{m.desc}</p>
            </Panel>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:'24px'}}>
          <Btn onClick={()=>goto('profile')} variant="ghost">◉ Profile & History</Btn>
        </div>
      </div>
      {rules&&<RulesModal close={()=>setRules(false)}/>}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SOLO / ARENA SETUP
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='solo_setup'||scr==='arena_setup') {
    const isArena = scr==='arena_setup';
    return (
      <div style={{...PAGE,...COL}}>
        <style>{CSS}</style>
        <MatrixBg/>{hdr}
        <div style={{position:'relative',zIndex:1,maxWidth:'420px',width:'100%',padding:mob?'24px 16px':'0 24px'}}>
          <Panel variant="hero" style={{padding:mob?'24px':'32px',textAlign:'center'}}>
            <HexLogo size={48}/>
            <h2 style={{fontSize:'20px',fontWeight:800,margin:'16px 0 8px',color:'#E0FFE0'}}>{isArena?'Arena Config':'Solo Setup'}</h2>
            <p style={{color:'#446644',fontSize:'13px',marginBottom:'28px'}}>Configure your session</p>
            <div style={LBL}>Rounds</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'24px'}}>
              {[10,15,20].map(n=>(
                <button key={n} onClick={()=>{clk();setQCount(n);}} style={{
                  fontFamily:"'Orbitron',monospace",padding:'16px',borderRadius:'12px',cursor:'pointer',fontSize:'20px',fontWeight:800,
                  border:qCount===n?'2px solid #00FF41':'1px solid rgba(0,255,65,0.15)',
                  background:qCount===n?'rgba(0,255,65,0.1)':'rgba(0,255,65,0.02)',
                  color:qCount===n?'#00FF41':'#446644',
                  boxShadow:qCount===n?'0 0 20px rgba(0,255,65,0.2)':'none'
                }}>{n}</button>
              ))}
            </div>
            {isArena&&(
              <>
                <div style={LBL}>CPU Opponents</div>
                <div style={{display:'flex',gap:'8px',marginBottom:'24px'}}>
                  {[1,2,3,4].map(n=>(
                    <button key={n} onClick={()=>{clk();setCpuCount(n);}} style={{
                      flex:1,height:'48px',borderRadius:'10px',cursor:'pointer',fontWeight:700,fontSize:'16px',
                      border:cpuCount===n?'2px solid #00FF41':'1px solid rgba(0,255,65,0.15)',
                      background:cpuCount===n?'rgba(0,255,65,0.1)':'transparent',
                      color:cpuCount===n?'#00FF41':'#446644'
                    }}>{n}</button>
                  ))}
                </div>
              </>
            )}
            <Btn onClick={()=>{
              if(isArena){setRoomCode(Math.random().toString(36).slice(2,7).toUpperCase());setScr('arena_waiting');}
              else startGame('solo',qCount);
            }} full size="lg" style={{fontFamily:"'Orbitron',monospace"}}>
              {isArena?'CREATE MATCH':'START'}
            </Btn>
            {isArena&&(
              <div style={{marginTop:'16px',display:'flex',gap:'8px'}}>
                <HudInput placeholder="Join code" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} style={{flex:1}}/>
                <Btn onClick={()=>{if(joinCode.length>=4){setRoomCode(joinCode);setScr('arena_waiting');}}}>Join</Btn>
              </div>
            )}
          </Panel>
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ARENA WAITING
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='arena_waiting') {
    const wP=[{id:me?.id,nickname:me?.nickname||'You',isCPU:false},...CPU_PLAYERS.slice(0,cpuCount)];
    return (
      <div style={{...PAGE,...COL}}>
        <style>{CSS}</style>
        <MatrixBg/>{hdr}
        <div style={{position:'relative',zIndex:1,maxWidth:'420px',width:'100%',padding:mob?'24px 16px':'0 24px'}}>
          <Panel variant="hero" style={{padding:mob?'24px':'32px',textAlign:'center'}}>
            <div style={LBL}>Room Code</div>
            <div className="glow-text" style={{fontSize:'36px',fontWeight:900,color:'#00FF41',letterSpacing:'8px',margin:'8px 0 20px',fontFamily:"'Orbitron',monospace"}}>{roomCode}</div>
            <div style={LBL}>Players ({wP.length})</div>
            {wP.map((p,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'12px 0',borderBottom:'1px solid rgba(0,255,65,0.1)'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'50%',background:p.isCPU?'rgba(0,212,170,0.15)':'rgba(0,255,65,0.15)',border:`1px solid ${p.isCPU?'rgba(0,212,170,0.3)':'rgba(0,255,65,0.3)'}`,display:'flex',alignItems:'center',justifyContent:'center'}}>{p.isCPU?'🤖':'👤'}</div>
                <span style={{flex:1,textAlign:'left',color:p.isCPU?'#00D4AA':'#E0FFE0',fontWeight:p.isCPU?400:600}}>{p.nickname}</span>
                <span style={{color:'#00FF41',fontSize:'10px'}}>●</span>
              </div>
            ))}
            <Btn onClick={()=>startGame('arena',qCount)} full size="lg" style={{marginTop:'20px',fontFamily:"'Orbitron',monospace"}}>▶ START</Btn>
          </Panel>
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='game'||scr==='arena_game') {
    const q=qs[qi]; if(!q)return null;
    const last=answers[answers.length-1];
    const isArena=scr==='arena_game';
    const isImg=q.type==='image';
    const lb=[...arenaPlayers].sort((a,b)=>(b.score||0)-(a.score||0));

    return (
      <div style={{...PAGE,paddingBottom:mob&&isArena?'70px':'20px'}}>
        <style>{CSS}</style>
        <MatrixBg/>{hdr}
        {isArena&&mob&&(
          <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200}}>
            <button onClick={()=>setLbOpen(o=>!o)} style={{width:'100%',background:'rgba(0,0,0,0.95)',border:'none',borderTop:'1px solid rgba(0,255,65,0.2)',color:'#00FF41',padding:'12px',fontSize:'11px',fontWeight:700,cursor:'pointer',fontFamily:"'Orbitron',monospace"}}>
              {lbOpen?'▼ HIDE':'▲ STANDINGS'}
            </button>
            {lbOpen&&(
              <div style={{background:'rgba(0,0,0,0.98)',padding:'12px 16px',maxHeight:'40vh',overflowY:'auto'}}>
                {lb.map((p,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(0,255,65,0.1)'}}>
                    <span style={{width:'24px',color:i===0?'#FFDD00':'#446644',fontWeight:700}}>{i+1}</span>
                    <span style={{flex:1,color:p.isCPU?'#88AA88':'#E0FFE0'}}>{p.nickname}</span>
                    <span style={{color:(p.score||0)>=0?'#00FF41':'#FF3366',fontFamily:"'JetBrains Mono',monospace"}}>{(p.score||0)>=0?'+':''}{p.score||0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div style={{...WRAP,display:'flex',gap:'20px',alignItems:'flex-start',flexWrap:'wrap'}}>
          <div style={{flex:'1 1 65%',minWidth:mob?'100%':'300px'}}>
            {/* HUD */}
            <Panel style={{padding:'12px 16px',marginBottom:'12px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{fontFamily:"'Orbitron',monospace",color:'#E0FFE0'}}><span style={{color:'#446644'}}>Q</span> {qi+1}/{qs.length}</span>
              <span style={{fontSize:'10px',color:'#00FF41',letterSpacing:'0.1em',fontFamily:"'Orbitron',monospace"}}>{q.cat.toUpperCase()}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",color:score>=0?'#00FF41':'#FF3366',fontWeight:700}}>{score>=0?'+':''}{score}</span>
            </Panel>
            {/* Progress */}
            <div style={{height:'3px',background:'rgba(0,255,65,0.1)',borderRadius:'2px',marginBottom:'20px',overflow:'hidden'}}>
              <div style={{height:'100%',width:`${(qi/qs.length)*100}%`,background:'linear-gradient(90deg,#00FF41,#00D4AA)',borderRadius:'2px',boxShadow:'0 0 12px #00FF41'}}/>
            </div>
            {!shown?(
              <>
                <div style={{display:'flex',justifyContent:'center',marginBottom:'20px'}}><TimerRing t={tLeft}/></div>
                <Panel variant="hero" style={{padding:mob?'20px':'28px',marginBottom:'20px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
                    <div style={{width:'2px',height:'14px',background:'#00FF41',boxShadow:'0 0 8px #00FF41'}}/>
                    <span style={{fontSize:'10px',letterSpacing:'0.12em',color:'#00FF41',fontFamily:"'Orbitron',monospace"}}>ANALYZE</span>
                  </div>
                  {isImg?<ImageContainer url={q.url}/>:<p style={{fontSize:mob?'15px':'16px',lineHeight:1.8,color:'#E0FFE0',margin:0}}>{q.content}</p>}
                </Panel>
                <div style={{marginBottom:'16px'}}>
                  <div style={{fontSize:'10px',color:'#446644',textAlign:'center',marginBottom:'8px'}}>{conf?`◉ ${conf}% confidence`:'◎ Confidence (optional)'}</div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px'}}>
                    {[50,70,90,100].map(cv=>(
                      <button key={cv} onClick={()=>{clk();setConf(p=>p===cv?null:cv);}} style={{
                        padding:'12px',borderRadius:'10px',cursor:'pointer',fontWeight:700,fontSize:'14px',
                        border:conf===cv?'1px solid #00FF41':'1px solid rgba(0,255,65,0.15)',
                        background:conf===cv?'rgba(0,255,65,0.1)':'transparent',
                        color:conf===cv?'#00FF41':'#446644'
                      }}>{cv}%</button>
                    ))}
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
                  {[{label:'🤖 AI',val:'AI',col:'#00FF41'},{label:isImg?'📷 Real':'✍️ Human',val:'Human',col:'#00D4AA'}].map(a=>(
                    <button key={a.val} onClick={()=>submit(a.val)} style={{
                      padding:mob?'18px':'22px',borderRadius:'14px',cursor:'pointer',fontSize:mob?'15px':'16px',fontWeight:700,
                      background:`rgba(${a.col==='#00FF41'?'0,255,65':'0,212,170'},0.08)`,
                      border:`1px solid ${a.col}40`,color:a.col,
                      boxShadow:`0 4px 20px ${a.col}20`
                    }}>{a.label}</button>
                  ))}
                </div>
              </>
            ):last&&(
              <div style={{animation:`resultIn 0.4s ${ease}`}}>
                <Panel variant={last.correct?'correct':'wrong'} style={{padding:mob?'24px':'32px',textAlign:'center',marginBottom:'16px'}}>
                  <div style={{fontSize:'56px',marginBottom:'12px'}}>{last.correct?'✓':'✗'}</div>
                  <div className="glow-text" style={{fontSize:'22px',fontWeight:800,color:last.correct?'#00FF41':'#FF3366',marginBottom:'8px',fontFamily:"'Orbitron',monospace"}}>
                    {last.chosen===null?'TIMEOUT':last.correct?'CORRECT':'WRONG'}
                  </div>
                  <div style={{fontSize:'14px',color:'#88AA88',marginBottom:'12px'}}>Answer: <strong style={{color:'#E0FFE0'}}>{q.isAI?'AI Generated':'Human/Real'}</strong></div>
                  <div className="glow-text" style={{fontSize:'36px',fontWeight:900,color:last.sc>=0?'#00FF41':'#FF3366',fontFamily:"'JetBrains Mono',monospace"}}>{last.sc>=0?'+':''}{last.sc}</div>
                </Panel>
                {q.explanation&&(
                  <Panel variant="gold" style={{padding:'16px',marginBottom:'16px'}}>
                    <div style={{fontSize:'10px',letterSpacing:'0.1em',color:'#FFDD00',marginBottom:'8px',fontFamily:"'Orbitron',monospace"}}>◉ INSIGHT</div>
                    <p style={{fontSize:'13px',color:'#88AA88',lineHeight:1.6,margin:0}}>{q.explanation}</p>
                  </Panel>
                )}
                <Radar correct={last.correct}/>
              </div>
            )}
          </div>
          {isArena&&!mob&&(
            <div style={{flex:'0 0 30%',maxWidth:'280px',position:'sticky',top:'80px'}}>
              <Panel style={{padding:'20px'}}>
                <div style={LBL}>Standings</div>
                {lb.map((p,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 0',borderBottom:'1px solid rgba(0,255,65,0.1)'}}>
                    <span style={{width:'24px',color:i===0?'#FFDD00':i===1?'#C0C0C0':i===2?'#CD7F32':'#446644',fontWeight:700,fontFamily:"'Orbitron',monospace"}}>{i+1}</span>
                    <span style={{flex:1,color:p.isCPU?'#88AA88':'#E0FFE0',fontWeight:p.isCPU?400:600}}>{p.nickname}</span>
                    <span style={{color:(p.score||0)>=0?'#00FF41':'#FF3366',fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{(p.score||0)>=0?'+':''}{p.score||0}</span>
                  </div>
                ))}
              </Panel>
            </div>
          )}
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // END
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='end') {
    const corr=answers.filter(a=>a.correct).length;
    const acc=answers.length?Math.round(corr/answers.length*100):0;
    const fs=scoreRef.current;
    const medal=fs>=1000?'🏆':fs>=600?'🥇':fs>=300?'🥈':'🎖';
    const lb=[...arenaPlayers].map(p=>p.isCPU?p:{...p,score:fs}).sort((a,b)=>(b.score||0)-(a.score||0));
    return (
      <div style={PAGE}>
        <style>{CSS}</style>
        <MatrixBg/>{hdr}
        <div style={{...WRAP,display:'flex',gap:'20px',flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:'280px'}}>
            <div style={{textAlign:'center',marginBottom:'32px'}}>
              <div style={{fontSize:'72px',marginBottom:'12px'}}>{medal}</div>
              <h2 className="glow-text" style={{fontSize:mob?'24px':'32px',fontWeight:900,color:'#E0FFE0',marginBottom:'4px'}}>Mission Complete</h2>
              <p style={{color:'#446644'}}>{corr}/{answers.length} correct</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'20px'}}>
              {[{l:'Score',v:fs>=0?`+${fs}`:fs,c:fs>=0},{l:'Accuracy',v:`${acc}%`,c:true},{l:'Questions',v:answers.length,c:true}].map(x=>(
                <Panel key={x.l} style={{padding:'16px',textAlign:'center'}}>
                  <div style={{fontSize:'24px',fontWeight:800,color:x.c?'#00FF41':'#FF3366',fontFamily:"'JetBrains Mono',monospace"}}>{x.v}</div>
                  <div style={{fontSize:'10px',color:'#446644',marginTop:'4px',textTransform:'uppercase',letterSpacing:'0.1em'}}>{x.l}</div>
                </Panel>
              ))}
            </div>
            {gameMode==='arena'&&lb.length>0&&(
              <Panel style={{padding:'20px',marginBottom:'16px'}}>
                <div style={LBL}>Final Standings</div>
                {lb.map((p,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',padding:'12px 0',borderBottom:'1px solid rgba(0,255,65,0.1)'}}>
                    <span style={{width:'28px',color:i===0?'#FFDD00':'#446644',fontWeight:700}}>{i+1}</span>
                    <span style={{flex:1,color:p.isCPU?'#88AA88':'#E0FFE0'}}>{p.nickname}{!p.isCPU?' (You)':''}</span>
                    <span style={{color:(p.score||0)>=0?'#00FF41':'#FF3366',fontFamily:"'JetBrains Mono',monospace"}}>{(p.score||0)>=0?'+':''}{p.score||0}</span>
                  </div>
                ))}
              </Panel>
            )}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
              <Btn onClick={()=>startGame(gameMode,qCount)} full size="lg" style={{fontFamily:"'Orbitron',monospace"}}>AGAIN</Btn>
              <Btn onClick={()=>goto('mode_select')} variant="secondary" full size="lg">MENU</Btn>
            </div>
          </div>
          <div style={{width:mob?'100%':'260px',flexShrink:0}}><NewsTicker/></div>
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='profile') {
    const sess=me?.sessions||[];
    const best=sess.length?Math.max(...sess.map(s=>s.score||0)):0;
    const avg=sess.length?Math.round(sess.reduce((s,x)=>s+(x.acc||0),0)/sess.length):0;
    return (
      <div style={PAGE}>
        <style>{CSS}</style>
        <MatrixBg/>{hdr}
        <div style={{...WRAP,maxWidth:'520px'}}>
          <h2 style={{fontSize:'22px',fontWeight:800,marginBottom:'24px',color:'#E0FFE0'}}>Profile</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'20px'}}>
            {[{l:'Sessions',v:sess.length},{l:'Best',v:best},{l:'Avg Acc',v:`${avg}%`}].map(x=>(
              <Panel key={x.l} style={{padding:'16px',textAlign:'center'}}>
                <div style={{fontSize:'22px',fontWeight:800,color:'#00FF41',fontFamily:"'Orbitron',monospace"}}>{x.v}</div>
                <div style={{fontSize:'10px',color:'#446644',marginTop:'4px'}}>{x.l}</div>
              </Panel>
            ))}
          </div>
          <Panel style={{padding:'20px',marginBottom:'16px'}}>
            <div style={LBL}>Edit</div>
            <HudInput placeholder={me?.name||'Name'} onChange={e=>setPForm(p=>({...p,name:e.target.value}))} style={{marginBottom:'10px'}}/>
            <HudInput placeholder={me?.nickname||'Nickname'} onChange={e=>setPForm(p=>({...p,nickname:e.target.value}))} style={{marginBottom:'12px'}}/>
            <Btn onClick={()=>{clk();const u={...me,...pForm};setMe(u);setUsers(p=>p.map(x=>x.id===me.id?u:x));showToast('Saved!','success');}} full>Save</Btn>
          </Panel>
          <Panel style={{padding:'20px'}}>
            <div style={LBL}>History</div>
            {sess.length===0?<p style={{color:'#446644',fontSize:'13px'}}>No sessions yet.</p>
              :sess.slice().reverse().slice(0,8).map((s,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(0,255,65,0.1)',fontSize:'13px'}}>
                  <span style={{color:'#88AA88'}}>{new Date(s.date).toLocaleDateString()}</span>
                  <span style={{color:s.score>=0?'#00FF41':'#FF3366',fontFamily:"'JetBrains Mono',monospace"}}>{s.score>=0?'+':''}{s.score}</span>
                  <span style={{color:'#446644'}}>{s.acc}%</span>
                </div>
              ))}
          </Panel>
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════════════════════════════
  if(scr==='admin') {
    if(!me?.isAdmin)return<div style={{...PAGE,...COL}}><p style={{color:'#FF3366'}}>Access Denied</p></div>;
    const allSess=users.flatMap(u=>(u.sessions||[]).map(s=>({...s,user:u.nickname||u.name})));
    return (
      <div style={PAGE}>
        <style>{CSS}</style>
        <MatrixBg/>{hdr}
        <div style={WRAP}>
          <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px',flexWrap:'wrap'}}>
            <h2 style={{fontSize:'20px',fontWeight:800,color:'#E0FFE0',margin:0}}>Admin Panel</h2>
            <span style={{fontSize:'9px',color:'#FF3366',border:'1px solid rgba(255,51,102,0.3)',padding:'3px 8px',borderRadius:'4px',fontFamily:"'Orbitron',monospace"}}>RESTRICTED</span>
          </div>
          <div style={{display:'flex',gap:'8px',marginBottom:'20px',flexWrap:'wrap'}}>
            {['users','questions','sessions'].map(t=>(
              <button key={t} onClick={()=>{clk();setATab(t);}} style={{
                padding:'10px 18px',borderRadius:'10px',cursor:'pointer',fontSize:'12px',fontWeight:600,textTransform:'capitalize',
                background:aTab===t?'rgba(0,255,65,0.1)':'transparent',
                border:`1px solid ${aTab===t?'rgba(0,255,65,0.3)':'rgba(0,255,65,0.1)'}`,
                color:aTab===t?'#00FF41':'#446644'
              }}>{t}</button>
            ))}
          </div>
          <Panel style={{padding:'20px',maxHeight:'60vh',overflowY:'auto'}}>
            {aTab==='users'&&(
              <>
                <div style={LBL}>Users ({users.length})</div>
                <p style={{fontSize:'11px',color:'#446644',marginBottom:'16px'}}>Note: Data is stored in browser memory. For persistent multi-user data, integrate a database like Firebase.</p>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px',minWidth:'500px'}}>
                    <thead><tr>{['Name','Email','Nickname','Sessions','Admin'].map(h=>(
                      <th key={h} style={{padding:'10px',textAlign:'left',color:'#446644',borderBottom:'1px solid rgba(0,255,65,0.1)',fontSize:'10px',letterSpacing:'0.08em'}}>{h}</th>
                    ))}</tr></thead>
                    <tbody>{users.map(u=>(
                      <tr key={u.id}>{[u.name,u.email,u.nickname,(u.sessions||[]).length,u.isAdmin?'★':''].map((v,i)=>(
                        <td key={i} style={{padding:'10px',color:i===4&&v?'#FFDD00':'#88AA88',borderBottom:'1px solid rgba(0,255,65,0.05)'}}>{v}</td>
                      ))}</tr>
                    ))}</tbody>
                  </table>
                </div>
              </>
            )}
            {aTab==='questions'&&(
              <>
                <div style={LBL}>Questions ({ALL_QS.length})</div>
                {TQS.slice(0,20).map(q=>(
                  <div key={q.id} style={{display:'flex',gap:'10px',padding:'10px 0',borderBottom:'1px solid rgba(0,255,65,0.05)',fontSize:'12px'}}>
                    <span style={{fontSize:'9px',padding:'2px 8px',borderRadius:'4px',background:q.isAI?'rgba(0,255,65,0.1)':'rgba(0,212,170,0.1)',color:q.isAI?'#00FF41':'#00D4AA'}}>{q.isAI?'AI':'HUM'}</span>
                    <span style={{fontSize:'9px',color:'#00FF41',minWidth:'70px'}}>{q.cat}</span>
                    <span style={{color:'#88AA88',flex:1}}>{q.content.slice(0,80)}...</span>
                  </div>
                ))}
              </>
            )}
            {aTab==='sessions'&&(
              <>
                <div style={LBL}>Sessions ({allSess.length})</div>
                {allSess.length===0?<p style={{color:'#446644'}}>No sessions yet.</p>
                  :allSess.sort((a,b)=>b.score-a.score).map((s,i)=>(
                    <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid rgba(0,255,65,0.05)',fontSize:'13px'}}>
                      <span style={{color:'#88AA88'}}>{s.user}</span>
                      <span style={{color:'#446644'}}>{new Date(s.date).toLocaleDateString()}</span>
                      <span style={{color:s.score>=0?'#00FF41':'#FF3366',fontFamily:"'JetBrains Mono',monospace"}}>{s.score>=0?'+':''}{s.score}</span>
                    </div>
                  ))}
              </>
            )}
          </Panel>
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  return null;
}
