import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg0:'#060A0F', bg1:'#0A1018', bg2:'#0F1923', bg3:'#162030',
  cyan:'#00E5FF', cyanDim:'rgba(0,229,255,0.15)', cyanBorder:'rgba(0,229,255,0.25)',
  purple:'#7C3AFF', purpleDim:'rgba(124,58,255,0.12)',
  gold:'#FFB800', goldDim:'rgba(255,184,0,0.15)',
  green:'#00FF87', greenDim:'rgba(0,255,135,0.12)',
  red:'#FF3B5C', redDim:'rgba(255,59,92,0.12)',
  text:'#E8F4FF', textSec:'#8BA4C0', textMuted:'#4A6280',
  border:'rgba(0,229,255,0.18)', borderSub:'rgba(255,255,255,0.07)',
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
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996398/pbAf66BHrMLWj6gVn3cWBX-1200-80.png_tzdc37.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996397/northern_lights_1_AI_qqwp3y.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996395/MtFuji_1_AI_eekcck.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996395/mWR3vpoibFq98uzfZiatMb-1200-80.png_vnmwe0.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/launch_2_AI_o7jtyw.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/hongkong_2_AI_ufdrgd.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/frog_1_AI_dev1iu.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/kids_doing_art_2_AI_x192qj.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996394/egyptian_papyrus_2_AI_v2wkzj.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996393/8098_hrfhsf.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996393/DOG_ai_utbgqr.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996393/ai_xxvswt.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996392/4444_rk01eh.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996392/2476_awhgwy.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996392/2222_oduf87.jpg",
];
const DEF_REAL_IMGS = [
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996663/yAQrfF5yZy8tJHdMMrQTjA-1200-80.jpg_gsfzgp.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996661/womens_suffrage_1_REAL_eyzwim.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996659/Pangolin_2_REAL_dbn0ho.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996658/northern_lights_2_REAL_knmncc.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996655/nHPeN2zkhLSW2LbT6ZdNy9-1200-80.jpg_huodcb.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996655/MtFuji_2_REAL_qk4jaz.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996653/Mjua75qVM68B2bLiDuewwh-1200-80.png_kj9nd3.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996648/launch_1_REAL_x0t9jb.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996648/kids_doing_art_1_akc14f.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996647/iK2LPtUVcpffyFJMbQPQuL-1200-80.jpg_ew0d5n.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996644/hongkong_1_REAL_yhfmys.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996643/frog_2_rz44cs.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996640/egyptian_papyrus_1_REAL_aekcek.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996639/DOG_ze8dds.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996638/CzLaQdNEbDGymisgkgUeCU-1200-80.jpg_rs5zvf.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996635/9843_x82dhz.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996634/7811_dfxeju.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771996633/7BAsT6NDCbLSEoctsxeeJK-1200-80.jpg_hdxv42.webp",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995876/samples/landscapes/nature-mountains.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995875/samples/food/spices.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995873/samples/landscapes/beach-boat.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995872/samples/people/jazz.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995871/samples/landscapes/girl-urban-view.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995870/samples/animals/reindeer.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995870/samples/food/fish-vegetables.jpg",
  "https://res.cloudinary.com/dh9sfzmak/image/upload/v1771995868/samples/food/dessert.jpg",
];

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const TQS = [
  {id:1,cat:'Corporate Email',isAI:true,content:"Please find attached herewith the comprehensive documentation pertaining to the aforementioned project deliverables. Kindly revert at your earliest convenience to facilitate the requisite action items.",explanation:"Stacked buzzwords ('aforementioned', 'kindly revert', 'requisite') with zero specific context. AI corporate emails are polished but empty — real ones name who, what, and when."},
  {id:2,cat:'Corporate Email',isAI:false,content:"Sarah — quick one. The Q3 numbers still aren't matching what finance sent over. I've checked twice. Can you loop in Derek before the 3pm? I'd do it myself but he never replies to my emails.",explanation:"Specific names, a real problem, mild frustration, and the parenthetical complaint about Derek — all human. AI writes polished generalities; humans write specific, slightly messy situations."},
  {id:3,cat:'Blog Post',isAI:true,content:"The intersection of technology and human creativity represents a fascinating paradox in our modern age. As artificial intelligence continues to evolve, we must thoughtfully examine how these innovations reshape our understanding of authenticity.",explanation:"Classic AI blog opener: vague thesis, no personal angle, no example. AI signals include 'fascinating paradox', 'thoughtfully examine', and committing to nothing specific."},
  {id:4,cat:'Blog Post',isAI:false,content:"I've been a freelance copywriter for eleven years and the best productivity advice I ever got came from a plumber: 'Bill by the job, not the hour.' Changed everything. Still weird it came from a plumber.",explanation:"Specific detail (11 years, a plumber), irony of the source, and the comedian's callback at the end. AI doesn't naturally set up and revisit a joke in the same paragraph."},
  {id:5,cat:'Social Post',isAI:true,content:"🚀 Excited to share I've completed my certification! This achievement represents months of dedication. Truly grateful for everyone who supported me on this incredible journey! #Growth #Learning #Professional",explanation:"The formula: emoji opener + 'incredible journey' + generic gratitude + hashtag stack = AI LinkedIn content. Real celebration posts are messier and reference specific people."},
  {id:6,cat:'Social Post',isAI:false,content:"my coworker just described someone as 'having main character energy' in a performance review and i need everyone to know that it worked and we gave her a raise",explanation:"Timing, surprise, and a punchline structure. The detail that it actually worked subverts expectation perfectly. AI plays it safe with social commentary; this earns a genuine reaction."},
  {id:7,cat:'Chat Message',isAI:false,content:"bro are u still coming tonight\nalso what time\nalso can u get the drinks i'll venmo u\nalso actually nvm i'll get them\nactually no u get them",explanation:"Stream-of-consciousness indecision across multiple 'also' lines is authentic human texting. AI writes chat messages as single coherent thoughts — not chaotic multi-part bursts."},
  {id:8,cat:'Chat Message',isAI:true,content:"Hey! Just checking in. It's been a while since we last connected and I wanted to make sure you know I'm thinking of you. Hope everything is going well on your end! 😊",explanation:"'On your end', 'I wanted to make sure you know I'm thinking of you' — textbook AI reconnection message. Real messages reference something specific you both share."},
  {id:9,cat:'Story Excerpt',isAI:true,content:"The moonlight cascaded through ancient oak branches, dappling the forest floor with silver light. Elena felt the weight of centuries in the silence, each shadow whispering secrets of lives lived and loves lost.",explanation:"Four metaphors in two sentences: 'cascaded', 'dappling', 'weight of centuries', 'shadows whispering'. AI stacks poetic imagery. Real literary prose earns each metaphor through restraint."},
  {id:10,cat:'Story Excerpt',isAI:false,content:"My grandfather kept a jar of peanut butter in his truck for seventeen years. Not emergency peanut butter. Just peanut butter. When I asked why, he looked at me like I'd asked why he needed oxygen.",explanation:"The internal categorization ('not emergency peanut butter') and the grandfather's non-answer are observed from real life. The specificity (17 years) is too precise to be generated."},
  {id:11,cat:'News Article',isAI:true,content:"Officials confirmed Thursday that preliminary discussions have yielded a framework for dialogue, with parties expressing cautious optimism about the potential for constructive engagement going forward.",explanation:"'Cautious optimism', 'constructive engagement', 'framework for dialogue' — AI news-speak. No names, no specific issue, no numbers. Reports nothing while sounding like it reports something."},
  {id:12,cat:'News Article',isAI:false,content:"The man who illegally parked in the same handicap spot every Tuesday for six years has been identified as the city's deputy parking enforcement director. He has been placed on administrative leave.",explanation:"The irony is structured with journalistic restraint. No commentary — just facts, trusting the reader to feel it. AI would add 'this incident highlights systemic issues in...'"},
  {id:13,cat:'Product Copy',isAI:true,content:"Transform your wellness ritual with our revolutionary blend of adaptogenic botanicals and cutting-edge bioavailable nutrients. Formulated to optimize your body's natural resilience pathways and peak cognitive performance.",explanation:"'Adaptogenic', 'bioavailable', 'resilience pathways' stacked together to sound scientific without stating what the product actually does. Textbook AI wellness copy formula."},
  {id:14,cat:'Product Copy',isAI:false,content:"This is a good notebook. The paper is thick. Pens don't bleed through. The binding holds up. I've filled four of them. I have nothing interesting to say except that I keep buying it.",explanation:"The deliberate anti-climax ('nothing interesting to say') is a human rhetorical move. The proof is behavioral (filled four). AI writes superlatives; humans write evidence."},
  {id:15,cat:'Meeting Notes',isAI:false,content:"NOTES — Marketing sync 11am\n- 40 min spent on logo color (still unresolved)\n- Product roadmap: 8 minutes\n- ACTION: Dave to 'look into' the analytics thing by Friday (he won't)",explanation:"The parenthetical '(he won't)' is the tell — a human editorializing with institutional knowledge. AI doesn't include knowing cynicism about specific named colleagues."},
  {id:16,cat:'Support Reply',isAI:true,content:"Thank you for reaching out! I completely understand how frustrating this must be. Your satisfaction is our absolute top priority and we're committed to resolving this. Please allow 3–5 business days.",explanation:"'Absolute top priority', 'completely understand', 'committed to resolving' — standard AI empathy script containing zero actual information about what will be resolved or how."},
  {id:17,cat:'Support Reply',isAI:false,content:"Hi — I looked into this. When you clicked 'cancel' it actually submitted the order instead. That's a bug on our end, not user error. I'm refunding you now. Sorry.",explanation:"Specific cause identified, blame clearly accepted, action taken immediately. Real support people write directly. AI writes empathetically but vaguely."},
  {id:18,cat:'Personal',isAI:false,content:"Here's the thing about anxiety nobody tells you: it's exhausting not because of what it makes you feel, but because of all the work you do making sure nobody can see it.",explanation:"A specific, non-obvious insight that reframes a common experience. AI mental health writing tends toward validation and general statements; this reveals something precise and true."},
  {id:19,cat:'Personal',isAI:true,content:"The experience of solitude teaches us profound lessons about the nature of self. In quiet reflection, away from modern connectivity, we discover the rich interior landscape of our authentic being.",explanation:"'Rich interior landscape', 'authentic being', 'nature of self' — AI's version of depth. Notice the absence of a single specific moment, memory, or observation. It gestures at profundity without arriving."},
  {id:20,cat:'Social Post',isAI:false,content:"three years sober today. still not sure what to do when people ask what changed. the real answer is i got tired in a way sleep didn't fix. anyway. three years.",explanation:"'Tired in a way sleep didn't fix' is an original metaphor that captures something specific. The three-word ending is emotional restraint done right. AI generates uplift; this earns it."},
  {id:21,cat:'Corporate Email',isAI:false,content:"Per my last email (sent Monday, Tuesday, and this morning) — I'm following up. Please just let me know if this moved to someone else. I'm not upset. I just need to update the tracker.",explanation:"The log of three follow-ups, 'I'm not upset' (which implies mild upset), and the administrative excuse are human passive-aggressive email DNA. AI wouldn't embed this subtext."},
  {id:22,cat:'Meeting Notes',isAI:true,content:"Key takeaways: Cross-functional alignment was achieved on Q4 priorities. Action items assigned to stakeholders with agreed timelines. Follow-up cadence established to ensure accountability and progress tracking.",explanation:"'Cross-functional alignment', 'follow-up cadence', 'ensure accountability' — placeholders. Real meeting notes name who said what, what the disagreement was, what was actually decided."},
  {id:23,cat:'Chat Message',isAI:false,content:"can i ask you something weird\nnvm it's fine\nactually: do you think people can tell when you're pretending to be okay or do they just not look closely enough\nnvm ignore that",explanation:"The retraction-ask-retraction spiral is authentic emotional vulnerability in text form. AI either asks directly or doesn't; humans approach difficult questions like this."},
  {id:24,cat:'News Article',isAI:false,content:"A retired teacher, 74, has spent a decade cataloging every pothole on the city's north side. She maintains a spreadsheet with 2,300 entries. Three have been fixed. She considers this progress.",explanation:"'She considers this progress' — a journalist's choice to end without comment. The numbers (2,300 entries, 3 fixed) do the emotional work. Restrained, specific, and real."},
  {id:25,cat:'Blog Post',isAI:true,content:"Building authentic human connections in an increasingly digital world requires intentionality and vulnerability. By prioritizing deep, meaningful interactions over surface-level engagement, we cultivate genuine belonging.",explanation:"'Intentionality', 'vulnerability', 'surface-level engagement', 'genuine belonging' — four therapy-adjacent buzzwords in one sentence. No personal story. No surprising idea. Pure AI wellness filler."},
];

const AI_NEWS = [
  {cat:'Model Capabilities',title:'Frontier Models Cross New Reasoning Benchmarks',body:'Leading AI systems now score above 90% on complex multi-step reasoning that stumped models 18 months ago — an acceleration that surprises researchers inside the labs building them.'},
  {cat:'Text Generation',title:'AI Writing Passes Expert Blind Reviews',body:'GPT-class models produced prose that professional editors could not reliably distinguish from human experts across 6 of 10 tested domains, including legal briefs and medical summaries.'},
  {cat:'Image & Video',title:'Synthetic Video Reaches Near-Broadcast Quality',body:'AI-generated clips now pass authenticity checks in 73% of viewer studies. Major broadcasters have begun mandatory verification workflows for all footage from unknown sources.'},
  {cat:'Detection Gap',title:'Deepfake Detectors Fall Further Behind',body:'The best available detectors now flag only 58% of synthetic media — down from 82% in 2023. Researchers warn the gap is widening faster than policy frameworks can adapt.'},
  {cat:'Workforce',title:'78% of Knowledge Workers Use AI Weekly',body:'A global survey of 44,000 respondents confirms AI tool adoption has crossed a threshold, with most professionals integrating AI into daily decision-making.'},
  {cat:'Regulation',title:'Global Disclosure Standards Begin to Converge',body:'The EU AI Act and US executive frameworks are aligning on requirements that AI-generated public content must be labeled — but enforcement mechanisms remain deeply contested.'},
];

const CPU_PLAYERS = [
  {id:'cpu1',nickname:'NeonFox',accuracy:0.75,speed:6},
  {id:'cpu2',nickname:'CircuitSage',accuracy:0.62,speed:9},
  {id:'cpu3',nickname:'DataPhantom',accuracy:0.82,speed:4},
  {id:'cpu4',nickname:'ByteWitch',accuracy:0.70,speed:7},
];
const TAGLINES = ["Can you detect the synthetic?","AI or human — you decide.","The line is fading. Find it.","Authenticity is the final frontier.","Train your perception. Trust nothing."];
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
  const [m,setM] = useState(typeof window!=='undefined'?window.innerWidth<700:false);
  useEffect(()=>{ const h=()=>setM(window.innerWidth<700); window.addEventListener('resize',h); return()=>window.removeEventListener('resize',h); },[]);
  return m;
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Orbitron:wght@400;600;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#060A0F;color:#E8F4FF;font-family:'Inter',system-ui,sans-serif;overflow-x:hidden;-webkit-tap-highlight-color:transparent}
::placeholder{color:#4A6280}select option{background:#0F1923}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,229,255,0.3);border-radius:2px}

@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:none}}
@keyframes scanY{0%{transform:translateY(-100%);opacity:0}10%{opacity:1}90%{opacity:0.6}100%{transform:translateY(1200%);opacity:0}}
@keyframes gridPulse{0%,100%{opacity:0.15}50%{opacity:0.3}}
@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-18px) scale(1.04)}}
@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
@keyframes barFill{from{width:0}}
@keyframes countPop{0%{transform:scale(1.3);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes tagIn{0%{opacity:0;transform:translateY(10px)}20%,80%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-10px)}}
@keyframes resultIn{0%{opacity:0;transform:scale(0.92) translateY(12px)}100%{opacity:1;transform:none}}
`;

// ─── GRID BACKGROUND ─────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:`radial-gradient(ellipse 80% 60% at 50% 20%,rgba(0,229,255,0.05) 0%,transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%,rgba(124,58,255,0.04) 0%,transparent 60%),linear-gradient(180deg,#060A0F 0%,#0A1018 50%,#060A0F 100%)`}}/>
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.12,animation:'gridPulse 8s ease-in-out infinite'}} xmlns="http://www.w3.org/2000/svg">
        <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(0,229,255,0.5)" strokeWidth="0.5"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)"/>
      </svg>
      <div style={{position:'absolute',left:0,right:0,height:'1px',top:'30%',background:'linear-gradient(to right,transparent,rgba(0,229,255,0.3),transparent)',animation:'scanY 12s ease-in-out infinite'}}/>
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function HexLogo({size=52}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{flexShrink:0}}>
      <defs>
        <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00E5FF"/><stop offset="100%" stopColor="#7C3AFF"/></linearGradient>
        <filter id="hglow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <polygon points="32,3 58,18 58,46 32,61 6,46 6,18" fill="rgba(0,229,255,0.06)" stroke="url(#hg1)" strokeWidth="1.5" filter="url(#hglow)"/>
      <polygon points="32,14 48,23 48,41 32,50 16,41 16,23" fill="none" stroke="rgba(0,229,255,0.25)" strokeWidth="0.8"/>
      <polygon points="32,22 40,27 40,37 32,42 24,37 24,27" fill="rgba(0,229,255,0.08)" stroke="url(#hg1)" strokeWidth="1"/>
      <line x1="32" y1="3" x2="32" y2="14" stroke="url(#hg1)" strokeWidth="1" opacity="0.7"/>
      <line x1="32" y1="50" x2="32" y2="61" stroke="url(#hg1)" strokeWidth="1" opacity="0.7"/>
      <line x1="6" y1="18" x2="16" y2="23" stroke="url(#hg1)" strokeWidth="1" opacity="0.5"/>
      <line x1="58" y1="18" x2="48" y2="23" stroke="url(#hg1)" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

// ─── GLASS PANEL ─────────────────────────────────────────────────────────────
function Panel({children, style={}, variant='default', glow}) {
  const variants = {
    default: {background:'rgba(15,25,35,0.8)',border:`1px solid ${C.border}`,borderRadius:16},
    hero: {background:'rgba(10,16,24,0.95)',border:`1px solid rgba(0,229,255,0.3)`,borderRadius:20},
    answer: {background:'rgba(15,25,35,0.7)',border:`1px solid rgba(255,255,255,0.1)`,borderRadius:14},
    correct: {background:'rgba(0,255,135,0.06)',border:`1px solid rgba(0,255,135,0.4)`,borderRadius:16},
    wrong: {background:'rgba(255,59,92,0.06)',border:`1px solid rgba(255,59,92,0.35)`,borderRadius:16},
    gold: {background:'rgba(255,184,0,0.06)',border:`1px solid rgba(255,184,0,0.35)`,borderRadius:16},
  };
  const v = variants[variant]||variants.default;
  return (
    <div style={{
      backdropFilter:'blur(16px)',
      boxShadow: glow?`0 0 40px rgba(0,229,255,0.1),0 8px 32px rgba(0,0,0,0.5)`:'0 8px 32px rgba(0,0,0,0.4)',
      position:'relative',overflow:'hidden',...v,...style
    }}>
      <div style={{position:'absolute',top:0,left:'10%',right:'10%',height:'1px',background:'linear-gradient(to right,transparent,rgba(255,255,255,0.15),transparent)',pointerEvents:'none'}}/>
      {children}
    </div>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────
function Btn({children,onClick,variant='primary',disabled,style={},full,size='md'}) {
  const sizes = {sm:{padding:'10px 18px',fontSize:12,minHeight:36,borderRadius:10},md:{padding:'14px 24px',fontSize:14,minHeight:48,borderRadius:12},lg:{padding:'18px 32px',fontSize:16,minHeight:56,borderRadius:14}};
  const variants = {
    primary:{background:`linear-gradient(135deg,rgba(0,229,255,0.2),rgba(124,58,255,0.15))`,border:`1px solid ${C.cyanBorder}`,color:C.text,boxShadow:'0 4px 20px rgba(0,229,255,0.12)'},
    secondary:{background:'rgba(255,255,255,0.06)',border:`1px solid ${C.borderSub}`,color:C.textSec},
    ghost:{background:'transparent',border:'none',color:C.textMuted,padding:'8px 14px',minHeight:36},
    danger:{background:'rgba(255,59,92,0.12)',border:'1px solid rgba(255,59,92,0.35)',color:C.red},
    gold:{background:'rgba(255,184,0,0.12)',border:'1px solid rgba(255,184,0,0.4)',color:C.gold},
  };
  const s = sizes[size]||sizes.md;
  const v = variants[variant]||variants.primary;
  return (
    <button onClick={disabled?undefined:onClick} style={{
      fontFamily:"'Inter',system-ui,sans-serif",fontWeight:600,letterSpacing:'0.02em',
      cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.4:1,
      display:'flex',alignItems:'center',justifyContent:'center',gap:8,
      width:full?'100%':'auto',transition:`all 220ms ${ease}`,
      ...s,...v,...style
    }}>{children}</button>
  );
}

// ─── HUD INPUT ────────────────────────────────────────────────────────────────
function HudInput({style={}, ...props}) {
  return <input {...props} style={{fontFamily:"'Inter',system-ui,sans-serif",background:'rgba(255,255,255,0.05)',border:`1px solid ${C.borderSub}`,borderRadius:12,color:C.text,padding:'14px 16px',fontSize:14,width:'100%',outline:'none',minHeight:50,transition:`border-color 220ms ${ease}`,...style}}/>;
}

// ─── TIMER RING ───────────────────────────────────────────────────────────────
function TimerRing({t,total=15}) {
  const R=34, CIR=2*Math.PI*R, off=CIR*(1-t/total);
  const col = t<=3?C.red:t<=7?C.gold:C.cyan;
  const gf = t<=5?`drop-shadow(0 0 6px ${col})`:'none';
  return (
    <div style={{position:'relative',width:88,height:88,flexShrink:0}}>
      <svg width="88" height="88" style={{transform:'rotate(-90deg)',filter:gf,transition:`filter 400ms ${ease}`}}>
        <circle cx="44" cy="44" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
        <circle cx="44" cy="44" r={R} fill="none" stroke={col} strokeWidth="4" strokeLinecap="round" strokeDasharray={CIR} strokeDashoffset={off} style={{transition:`stroke-dashoffset 1s linear,stroke 400ms ${ease}`}}/>
      </svg>
      <div key={t} style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:22,fontWeight:800,color:col,fontVariantNumeric:'tabular-nums',fontFamily:"'Orbitron',monospace",animation:`countPop 0.3s ${ease}`}}>{t}</div>
    </div>
  );
}

// ─── RADAR SCAN ───────────────────────────────────────────────────────────────
function Radar({correct}) {
  const metrics = ['Linguistic Consistency','Emotional Variance','Structural Predictability','Semantic Coherence'];
  const vals = useRef(metrics.map(()=>Math.round(25+Math.random()*70))).current;
  const col = correct?C.cyan:C.red;
  return (
    <Panel variant={correct?'correct':'wrong'} style={{padding:'16px 20px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
        <div style={{width:2,height:16,background:col,borderRadius:1}}/>
        <span style={{fontSize:10,letterSpacing:'0.14em',color:col,fontWeight:700,textTransform:'uppercase',fontFamily:"'Orbitron',monospace"}}>Authenticity Scan</span>
      </div>
      {metrics.map((m,i)=>(
        <div key={m} style={{marginBottom:i<3?10:0}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:11,color:C.textSec}}>{m}</span>
            <span style={{fontSize:11,color:col,fontWeight:700,fontVariantNumeric:'tabular-nums'}}>{vals[i]}%</span>
          </div>
          <div style={{height:2,background:'rgba(255,255,255,0.06)',borderRadius:1}}>
            <div style={{height:'100%',width:`${vals[i]}%`,background:`linear-gradient(90deg,${col},${correct?'#6BFFCC':'#FF8FA3'})`,borderRadius:1,animation:`barFill 0.6s ${i*0.11}s ${ease} both`}}/>
          </div>
        </div>
      ))}
    </Panel>
  );
}

// ─── IMAGE CONTAINER ─────────────────────────────────────────────────────────
function ImageContainer({url}) {
  const [state, setState] = useState('loading');
  
  useEffect(()=>{ 
    setState('loading'); 
  },[url]);

  return (
    <div style={{width:'100%',position:'relative',borderRadius:14,overflow:'hidden',background:'#0A1018'}}>
      <div style={{paddingTop:'56.25%',position:'relative'}}>
        {state==='loading' && (
          <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(0,229,255,0.06) 50%,rgba(255,255,255,0.04) 75%)',backgroundSize:'600px 100%',animation:'shimmer 1.6s ease infinite'}}/>
        )}
        {state==='error' && (
          <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:C.textMuted}}>
            <div style={{fontSize:40,marginBottom:10,opacity:0.4}}>◻</div>
            <div style={{fontSize:12,letterSpacing:'0.08em',textTransform:'uppercase'}}>Image Unavailable</div>
          </div>
        )}
        {url && (
          <img
            key={url}
            src={url}
            alt="Analyze this image"
            onLoad={()=>setState('loaded')}
            onError={()=>setState('error')}
            style={{
              position:'absolute',top:0,left:0,
              width:'100%',height:'100%',
              objectFit:'cover',objectPosition:'center',
              opacity:state==='loaded'?1:0,
              transition:`opacity 400ms ${ease}`,
              display:'block',
            }}
          />
        )}
        {state==='loaded' && (
          <>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at center,transparent 50%,rgba(0,0,0,0.5) 100%)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:'40%',background:'linear-gradient(to top,rgba(6,10,15,0.6),transparent)',pointerEvents:'none'}}/>
            <div style={{position:'absolute',left:0,right:0,height:'1px',background:`linear-gradient(to right,transparent,${C.cyan},transparent)`,top:'-10%',animation:'scanY 18s 2s ease-in-out infinite',pointerEvents:'none'}}/>
            {[[0,0,'topleft'],[0,'auto','bottomleft'],['auto',0,'topright'],['auto','auto','bottomright']].map(([t,b,k])=>(
              <div key={k} style={{position:'absolute',top:t===0?8:'auto',bottom:b===0?8:'auto',left:k.includes('left')?8:'auto',right:k.includes('right')?8:'auto',width:12,height:12,borderTop:k.includes('top')?`2px solid ${C.cyan}`:undefined,borderBottom:k.includes('bottom')?`2px solid ${C.cyan}`:undefined,borderLeft:k.includes('left')?`2px solid ${C.cyan}`:undefined,borderRight:k.includes('right')?`2px solid ${C.cyan}`:undefined,opacity:0.7,pointerEvents:'none'}}/>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ─── RULES MODAL ─────────────────────────────────────────────────────────────
function RulesModal({close}) {
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:600,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <Panel variant="hero" style={{padding:32,maxWidth:480,width:'100%',maxHeight:'84vh',overflowY:'auto',animation:`fadeUp 0.3s ${ease}`}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:3,height:20,background:C.cyan,borderRadius:2}}/>
            <span style={{fontSize:12,letterSpacing:'0.14em',color:C.cyan,fontWeight:700,textTransform:'uppercase',fontFamily:"'Orbitron',monospace"}}>Protocol</span>
          </div>
          <button onClick={close} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:24,lineHeight:1,padding:4}}>×</button>
        </div>
        {[['Mission','Each round presents a text or image. Classify it: AI-generated or created by a real human.'],
          ['Confidence (Optional)','Select 50/70/90/100% for a score multiplier. Higher confidence = bigger bonus on correct, bigger penalty on wrong. Skip to play without multiplier.'],
          ['Scoring','✓ Correct: +100 pts · ✗ Wrong: −25 pts · Speed ≤3s: +50 · ≤5s: +30 · Confidence multiplier applied on top. Timeout = −25.'],
          ['Timer','15 seconds per question. Ring transitions amber at 7s, builds glow at 3s. Auto-advances on timeout.'],
        ].map(([t,b])=>(
          <div key={t} style={{background:'rgba(255,255,255,0.03)',border:`1px solid ${C.borderSub}`,borderRadius:12,padding:16,marginBottom:10}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:5}}>{t}</div>
            <div style={{fontSize:13,color:C.textSec,lineHeight:1.65}}>{b}</div>
          </div>
        ))}
      </Panel>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({user,snd,setSnd,goto,openRules,signOut,clk,scr}) {
  const mob = useIsMobile();
  const noBack = ['landing','auth','mode_select'].includes(scr);
  const hb = {fontFamily:"'Inter',system-ui,sans-serif",fontSize:12,fontWeight:500,background:'rgba(255,255,255,0.05)',border:`1px solid ${C.borderSub}`,borderRadius:10,color:C.textSec,padding:mob?'8px 12px':'7px 15px',cursor:'pointer',minHeight:38,transition:`all 220ms ${ease}`,letterSpacing:'0.02em'};
  return (
    <header style={{position:'fixed',top:0,left:0,right:0,zIndex:300,height:58,display:'flex',alignItems:'center',justifyContent:'space-between',padding:`0 ${mob?14:24}px`,background:'rgba(6,10,15,0.92)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${C.borderSub}`}}>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {!noBack && <button onClick={()=>{clk();goto('mode_select');}} style={{...hb,color:C.textMuted}}>← Back</button>}
        <button onClick={()=>{clk();goto(user?'mode_select':'landing');}} style={{...hb,display:'flex',alignItems:'center',gap:8,color:C.cyan,fontWeight:700,fontSize:13,letterSpacing:'0.08em',fontFamily:"'Orbitron',monospace",border:`1px solid ${C.cyanBorder}`}}>
          <HexLogo size={22}/>{!mob&&'AI ARENA'}
        </button>
      </div>
      <div style={{display:'flex',gap:7,alignItems:'center'}}>
        <button onClick={()=>{clk();openRules();}} style={hb}>Protocol</button>
        {user&&!mob&&<button onClick={()=>{clk();goto('profile');}} style={hb}>◉ {(user.nickname||user.name).slice(0,12)}</button>}
        {user?.isAdmin&&!mob&&<button onClick={()=>{clk();goto('admin');}} style={{...hb,color:C.gold}}>Admin</button>}
        <button onClick={()=>setSnd(s=>!s)} style={hb}>{snd?'◉':'◎'}</button>
        {user&&<button onClick={()=>{clk();signOut();}} style={{...hb,color:C.textMuted}}>Exit</button>}
      </div>
    </header>
  );
}

// ─── ROTATING NEWS ────────────────────────────────────────────────────────────
function RotatingNews() {
  const [idx,setIdx] = useState(0);
  const [vis,setVis] = useState(true);
  useEffect(()=>{ const t=setInterval(()=>{ setVis(false); setTimeout(()=>{ setIdx(i=>(i+1)%AI_NEWS.length); setVis(true); },500); },7000); return()=>clearInterval(t); },[]);
  const n = AI_NEWS[idx];
  return (
    <Panel style={{padding:20}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
        <div style={{width:2,height:14,background:C.cyan,borderRadius:1}}/>
        <span style={{fontSize:9,letterSpacing:'0.14em',color:C.cyan,fontWeight:700,textTransform:'uppercase',fontFamily:"'Orbitron',monospace"}}>Intelligence Brief</span>
      </div>
      <div style={{opacity:vis?1:0,transition:`opacity 450ms ${ease}`}}>
        <div style={{fontSize:9,letterSpacing:'0.1em',color:C.textMuted,marginBottom:5,textTransform:'uppercase'}}>{n.cat}</div>
        <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:8,lineHeight:1.4}}>{n.title}</div>
        <div style={{fontSize:12,color:C.textSec,lineHeight:1.65}}>{n.body}</div>
      </div>
      <div style={{display:'flex',gap:4,marginTop:14,justifyContent:'center'}}>
        {AI_NEWS.map((_,i)=>(
          <div key={i} style={{width:i===idx?16:4,height:3,borderRadius:2,background:i===idx?C.cyan:'rgba(255,255,255,0.15)',transition:`all 350ms ${ease}`}}/>
        ))}
      </div>
    </Panel>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg,type='info',onClose}) {
  useEffect(()=>{ const t=setTimeout(onClose,3500); return()=>clearTimeout(t); },[onClose]);
  const cols = {info:C.cyan,success:C.green,error:C.red};
  return (
    <div style={{position:'fixed',top:70,right:20,zIndex:800,animation:`slideRight 0.3s ${ease}`}}>
      <Panel style={{padding:'12px 20px',display:'flex',alignItems:'center',gap:12,border:`1px solid ${cols[type]||C.cyanBorder}33`}}>
        <div style={{width:3,height:'100%',position:'absolute',left:0,top:0,bottom:0,background:cols[type],borderRadius:'3px 0 0 3px'}}/>
        <div style={{paddingLeft:8,fontSize:13,color:C.text,fontWeight:500}}>{msg}</div>
        <button onClick={onClose} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontSize:16,marginLeft:8}}>×</button>
      </Panel>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const mob = useIsMobile();
  const [aiImgs,setAiImgs] = useState(DEF_AI_IMGS);
  const [realImgs,setRealImgs] = useState(DEF_REAL_IMGS);
  const ALL_QS = useMemo(()=>{
    const imgQ = [
      ...aiImgs.map((url,i)=>({id:`img_ai_${i}`,type:'image',cat:'Image Analysis',isAI:true,url,explanation:"AI-generated images often have subtle tells: perfectly smooth textures, slightly inconsistent lighting, uncanny symmetry, or background elements that don't quite cohere. The 'too perfect' quality is the signature."})),
      ...realImgs.map((url,i)=>({id:`img_real_${i}`,type:'image',cat:'Image Analysis',isAI:false,url,explanation:"Real photographs carry natural imperfections: organic grain, authentic lens distortion, candid expressions, and contextual details that algorithms struggle to synthesize convincingly."})),
    ];
    return [...TQS.map(q=>({...q,type:'text'})),...imgQ];
  },[aiImgs,realImgs]);

  const [scr,setScr] = useState('landing');
  const [users,setUsers] = useState([{id:'admin',name:'Admin',email:'admin@aiillusion.com',password:'admin123',nickname:'Admin',occupation:'Professional',isAdmin:true,sessions:[],used:[]}]);
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
  const [cpuCount,setCpuCount] = useState(1);
  const [tagIdx,setTagIdx] = useState(0);
  const [adminLogin,setAdminLogin] = useState(false);
  const [aForm,setAForm] = useState({email:'',password:''});
  const [aErr,setAErr] = useState('');
  const [aTab,setATab] = useState('users');
  const [pForm,setPForm] = useState({name:'',nickname:'',occupation:''});
  const [pMsg,setPMsg] = useState('');
  const [joinCode,setJoinCode] = useState('');
  const [lbOpen,setLbOpen] = useState(false);
  const [imgEdit,setImgEdit] = useState({ai:JSON.stringify(DEF_AI_IMGS,null,2),real:JSON.stringify(DEF_REAL_IMGS,null,2)});
  const [imgMsg,setImgMsg] = useState('');

  const audioRef=useRef(null), timerRef=useRef(null), shownRef=useRef(false), autoRef=useRef(null), scoreRef=useRef(0), answersRef=useRef([]);
  useEffect(()=>{scoreRef.current=score;},[score]);
  useEffect(()=>{answersRef.current=answers;},[answers]);

  const getCtx=useCallback(()=>{ if(!snd)return null; if(!audioRef.current)audioRef.current=mkAudio(); try{audioRef.current?.resume();}catch{} return audioRef.current; },[snd]);
  const clk=useCallback(()=>SFX.click(getCtx()),[getCtx]);
  const doOk=useCallback(()=>SFX.ok(getCtx()),[getCtx]);
  const doFail=useCallback(()=>SFX.fail(getCtx()),[getCtx]);
  const doTick=useCallback(()=>SFX.tick(getCtx()),[getCtx]);
  const showToast=(msg,type='info')=>setToast({msg,type});

  useEffect(()=>{ if(scr!=='landing')return; const t=setInterval(()=>setTagIdx(i=>(i+1)%TAGLINES.length),3000); return()=>clearInterval(t); },[scr]);

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
    autoRef.current=setTimeout(advance,3400);
    return()=>clearTimeout(autoRef.current);
  },[shown,scr]);

  function cpuRound(players,humanSc){
    return players.map(p=>{
      if(!p.isCPU)return{...p,score:(p.score||0)+humanSc};
      const ok=Math.random()<p.accuracy, t=Math.max(1,p.speed+(Math.random()*4-2));
      const cf=[50,70,90][Math.floor(Math.random()*3)];
      const sc=calcScore(ok,cf,15-t);
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
      if(!u){setFormErr('Invalid email or password.');return;}
      setMe(u); setFormErr(''); setScr('mode_select'); showToast(`Welcome back, ${u.nickname||u.name}!`,'success');
    } else {
      if(!form.name||!form.email||!form.password||!form.nickname){setFormErr('All fields are required.');return;}
      if(!form.consent){setFormErr('Please accept the terms to continue.');return;}
      if(users.find(u=>u.email===form.email)){setFormErr('Email already registered.');return;}
      if(users.find(u=>u.nickname===form.nickname)){setFormErr('Nickname already taken.');return;}
      const nu={id:Date.now().toString(),...form,isAdmin:ADMIN_EMAILS.includes(form.email),sessions:[],used:[]};
      setUsers(p=>[...p,nu]); setMe(nu); setFormErr(''); setScr('mode_select');
      showToast('Profile created. Welcome to the Arena.','success');
    }
  },[clk,authMode,form,users]);

  const signOut=()=>{clk();setMe(null);setScr('landing');};
  const goto=s=>{clk();setScr(s);};

  const PAGE={minHeight:'100vh',background:C.bg0,color:C.text,fontFamily:"'Inter',system-ui,sans-serif",position:'relative',paddingTop:58};
  const COL={display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'};
  const WRAP={position:'relative',zIndex:1,maxWidth:mob?'100%':960,margin:'0 auto',padding:mob?'24px 16px':'48px 24px'};
  const LBL={fontSize:10,letterSpacing:'0.14em',color:C.cyan,fontWeight:700,textTransform:'uppercase',marginBottom:8,fontFamily:"'Orbitron',monospace"};
  const hdr=me?<Header user={me} snd={snd} setSnd={setSnd} goto={goto} openRules={()=>setRules(true)} signOut={signOut} clk={clk} scr={scr}/>:null;

  // LANDING
  if(scr==='landing') return (
    <div style={{...PAGE,...COL,minHeight:'100vh',paddingTop:0}}>
      <style>{CSS}</style>
      <GridBg/>
      <div style={{position:'fixed',top:14,right:16,zIndex:400}}>
        <Btn onClick={()=>setSnd(s=>!s)} variant="secondary" size="sm">{snd?'◉ Sound':'◎ Muted'}</Btn>
      </div>
      <div style={{position:'fixed',bottom:12,right:16,zIndex:400}}>
        <button onClick={()=>setAdminLogin(true)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.04)',cursor:'pointer',fontSize:10}}>Admin</button>
      </div>
      <div style={{position:'relative',zIndex:1,maxWidth:700,width:'100%',padding:mob?'100px 20px 60px':'0 32px',textAlign:'center',animation:`fadeUp 0.9s ${ease}`}}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:24,animation:`orbFloat 6s ease-in-out infinite`}}>
          <HexLogo size={mob?72:96}/>
        </div>
        <div style={{fontSize:mob?'clamp(11px,3vw,13px)':'13px',letterSpacing:'0.22em',color:C.cyan,marginBottom:14,fontFamily:"'Orbitron',monospace",fontWeight:700,textTransform:'uppercase',opacity:0.9}}>
          AI ILLUSION ARENA
        </div>
        <h1 style={{fontSize:mob?'clamp(32px,9vw,42px)':'clamp(42px,5.5vw,64px)',fontWeight:900,letterSpacing:'-0.02em',lineHeight:1.05,margin:'0 0 10px',background:'linear-gradient(135deg,#FFFFFF 0%,rgba(0,229,255,0.9) 40%,rgba(124,58,255,0.8) 100%)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
          DETECT THE<br/>SYNTHETIC
        </h1>
        <div style={{height:28,overflow:'hidden',marginBottom:40}}>
          <div key={tagIdx} style={{fontSize:mob?13:15,color:C.textSec,animation:`tagIn 3s ${ease}`,letterSpacing:'0.04em'}}>{TAGLINES[tagIdx]}</div>
        </div>
        <div style={{display:'flex',flexDirection:mob?'column':'row',gap:12,justifyContent:'center',maxWidth:380,margin:'0 auto'}}>
          <Btn onClick={()=>{clk();setAuthMode('register');setScr('auth');}} size="lg" style={{flex:1,letterSpacing:'0.06em',fontFamily:"'Orbitron',monospace",fontSize:13}}>PLAY NOW</Btn>
          <Btn onClick={()=>{clk();setAuthMode('login');setScr('auth');}} variant="secondary" size="lg" style={{flex:1}}>Sign In</Btn>
        </div>
        <div style={{display:'flex',gap:32,justifyContent:'center',marginTop:48,paddingTop:32,borderTop:`1px solid ${C.borderSub}`}}>
          {[['25+','Text Questions'],[`${aiImgs.length+realImgs.length}+`,'Images'],['4','CPU Opponents']].map(([v,l])=>(
            <div key={l} style={{textAlign:'center'}}>
              <div style={{fontSize:mob?22:28,fontWeight:800,color:C.cyan,fontFamily:"'Orbitron',monospace"}}>{v}</div>
              <div style={{fontSize:11,color:C.textMuted,marginTop:3,letterSpacing:'0.06em',textTransform:'uppercase'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {adminLogin&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.9)',zIndex:500,...COL,padding:20}}>
          <Panel variant="hero" style={{padding:32,width:'100%',maxWidth:340,animation:`fadeUp 0.3s ${ease}`}}>
            <div style={LBL}>Restricted Access</div>
            <HudInput placeholder="Admin email" value={aForm.email} onChange={e=>setAForm(p=>({...p,email:e.target.value}))} style={{marginBottom:10}}/>
            <HudInput type="password" placeholder="Password" value={aForm.password} onChange={e=>setAForm(p=>({...p,password:e.target.value}))} style={{marginBottom:10}}/>
            {aErr&&<div style={{color:C.red,fontSize:12,marginBottom:10}}>{aErr}</div>}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <Btn onClick={()=>{const u=users.find(u=>u.email===aForm.email&&u.password===aForm.password&&u.isAdmin);if(u){setMe(u);setAdminLogin(false);setScr('admin');setAErr('');}else setAErr('Access denied.');}}>Enter</Btn>
              <Btn onClick={()=>{setAdminLogin(false);setAErr('');}} variant="secondary">Cancel</Btn>
            </div>
          </Panel>
        </div>
      )}
      {rules&&<RulesModal close={()=>setRules(false)}/>}
    </div>
  );

  // AUTH
  if(scr==='auth') return (
    <div style={{...PAGE,...COL,padding:mob?'70px 16px 24px':'24px'}}>
      <style>{CSS}</style>
      <GridBg/>
      <div style={{position:'relative',zIndex:1,width:'100%',maxWidth:400,animation:`fadeUp 0.5s ${ease}`}}>
        <button onClick={()=>{clk();setScr('landing');}} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',marginBottom:16,fontSize:13,padding:0,fontFamily:"'Inter',system-ui,sans-serif"}}>← Back</button>
        <Panel variant="hero" style={{padding:mob?24:36}}>
          <div style={{display:'flex',justifyContent:'center',marginBottom:16}}><HexLogo size={44}/></div>
          <h2 style={{fontSize:20,fontWeight:800,textAlign:'center',margin:'0 0 4px',letterSpacing:'-0.01em'}}>{authMode==='login'?'Welcome Back':'Join the Arena'}</h2>
          <p style={{color:C.textMuted,fontSize:13,textAlign:'center',margin:'4px 0 24px'}}>{authMode==='login'?'Sign in to continue your mission':'Create your operative profile'}</p>
          {authMode==='register'&&<>
            <HudInput placeholder="Full Name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} style={{marginBottom:10}}/>
            <HudInput placeholder="Callsign / Nickname" value={form.nickname} onChange={e=>setForm(p=>({...p,nickname:e.target.value}))} style={{marginBottom:10}}/>
            <select value={form.occupation} onChange={e=>setForm(p=>({...p,occupation:e.target.value}))} style={{fontFamily:"'Inter',system-ui,sans-serif",background:'rgba(255,255,255,0.05)',border:`1px solid ${C.borderSub}`,borderRadius:12,color:C.text,padding:'14px 16px',fontSize:14,width:'100%',outline:'none',minHeight:50,marginBottom:10}}>
              <option>Student</option><option>Professional</option><option>Other</option>
            </select>
          </>}
          <HudInput placeholder="Email address" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} style={{marginBottom:10}}/>
          <HudInput placeholder="Password" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} style={{marginBottom:authMode==='register'?10:20}}/>
          {authMode==='register'&&(
            <label style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:20,cursor:'pointer',fontSize:12,color:C.textSec}}>
              <input type="checkbox" checked={form.consent} onChange={e=>setForm(p=>({...p,consent:e.target.checked}))} style={{marginTop:2,width:16,height:16,accentColor:C.cyan}}/>
              I agree to terms and consent to gameplay analytics processing.
            </label>
          )}
          {formErr&&<div style={{color:C.red,fontSize:12,marginBottom:14,padding:'10px 14px',background:C.redDim,borderRadius:10,border:`1px solid rgba(255,59,92,0.25)`}}>{formErr}</div>}
          <Btn onClick={doAuth} full size="lg" style={{marginBottom:14,fontFamily:"'Orbitron',monospace",letterSpacing:'0.08em',fontSize:13}}>{authMode==='login'?'AUTHENTICATE':'CREATE PROFILE'}</Btn>
          <p style={{textAlign:'center',fontSize:13,color:C.textMuted,margin:0}}>
            {authMode==='login'?'No profile? ':'Have one? '}
            <button onClick={()=>{setAuthMode(m=>m==='login'?'register':'login');setFormErr('');}} style={{background:'none',border:'none',color:C.cyan,cursor:'pointer',fontSize:13,fontWeight:600}}>{authMode==='login'?'Register':'Sign In'}</button>
          </p>
        </Panel>
      </div>
      {rules&&<RulesModal close={()=>setRules(false)}/>}
    </div>
  );

  // MODE SELECT
  if(scr==='mode_select') return (
    <div style={{...PAGE}}>
      <style>{CSS}</style>
      <GridBg/>{hdr}
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}
      <div style={{...WRAP}}>
        <div style={{textAlign:'center',marginBottom:48,animation:`fadeUp 0.5s ${ease}`}}>
          <div style={LBL}>Select Mission</div>
          <h2 style={{fontSize:mob?24:34,fontWeight:800,margin:'0 0 8px',letterSpacing:'-0.02em',background:'linear-gradient(135deg,#FFFFFF,rgba(0,229,255,0.85))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Choose Your Mode</h2>
          <p style={{color:C.textSec,fontSize:14,margin:0}}>AI or human — prove your detection capabilities</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:mob?'1fr':'1fr 1fr',gap:20,animation:`fadeUp 0.6s ${ease}`}}>
          {[{key:'solo',icon:'◉',title:'Solo Mode',badge:'PERSONAL TRAINING',color:C.cyan,colorDim:C.cyanDim,desc:'Practice your AI-detection skills at your own pace. Questions randomize each session with no repeats. Full performance analytics after each run.',stats:[['Questions','10–20'],['Timer','15s'],['Mode','Practice']]},
            {key:'arena',icon:'⬡',title:'Neural Arena',badge:'COMPETITIVE SIMULATION',color:C.purple,colorDim:C.purpleDim,desc:'Compete against CPU opponents in a live-scored match. Create private rooms or quick match. Real-time leaderboard updates after every round.',stats:[['Opponents','1–4 CPU'],['Live LB','Yes'],['Mode','Ranked']]}
          ].map(m=>(
            <div key={m.key} onClick={()=>{clk();setGameMode(m.key);setScr(m.key==='solo'?'solo_setup':'arena_setup');}}
              style={{background:'rgba(15,25,35,0.85)',backdropFilter:'blur(16px)',border:`1px solid rgba(255,255,255,0.08)`,borderRadius:20,padding:mob?24:32,boxShadow:'0 8px 32px rgba(0,0,0,0.4)',position:'relative',overflow:'hidden',cursor:'pointer',transition:`all 250ms ${ease}`}}>
              <div style={{position:'absolute',top:0,right:0,width:200,height:200,background:`radial-gradient(circle,${m.colorDim} 0%,transparent 70%)`,pointerEvents:'none'}}/>
              <div style={{fontSize:40,color:m.color,marginBottom:16}}>{m.icon}</div>
              <div style={{fontSize:9,letterSpacing:'0.14em',color:m.color,marginBottom:8,fontFamily:"'Orbitron',monospace",fontWeight:700}}>{m.badge}</div>
              <h3 style={{fontSize:22,fontWeight:800,margin:'0 0 10px',color:C.text}}>{m.title}</h3>
              <p style={{color:C.textSec,fontSize:13,lineHeight:1.7,margin:'0 0 20px'}}>{m.desc}</p>
              <div style={{display:'flex',gap:12}}>
                {m.stats.map(([label,val])=>(
                  <div key={label} style={{background:'rgba(255,255,255,0.05)',border:`1px solid ${C.borderSub}`,borderRadius:8,padding:'8px 14px',flex:1,textAlign:'center'}}>
                    <div style={{fontSize:13,fontWeight:700,color:m.color}}>{val}</div>
                    <div style={{fontSize:10,color:C.textMuted,marginTop:2,letterSpacing:'0.06em',textTransform:'uppercase'}}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'center',marginTop:28}}>
          <Btn onClick={()=>goto('profile')} variant="ghost">◉ Profile & Session History</Btn>
        </div>
      </div>
      {rules&&<RulesModal close={()=>setRules(false)}/>}
    </div>
  );

  // SOLO SETUP
  if(scr==='solo_setup') return (
    <div style={{...PAGE,...COL}}>
      <style>{CSS}</style>
      <GridBg/>{hdr}
      <div style={{position:'relative',zIndex:1,maxWidth:440,width:'100%',padding:mob?'24px 16px':'0 24px',animation:`fadeUp 0.5s ${ease}`}}>
        <Panel variant="hero" style={{padding:mob?28:40,textAlign:'center'}}>
          <HexLogo size={52}/>
          <h2 style={{fontSize:24,fontWeight:800,margin:'18px 0 6px',letterSpacing:'-0.01em'}}>Solo Assessment</h2>
          <p style={{color:C.textSec,fontSize:13,marginBottom:32}}>Set your session parameters</p>
          <div style={LBL}>Round Count</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:32}}>
            {[10,20].map(n=>(
              <button key={n} onClick={()=>{clk();setQCount(n);}} style={{
                fontFamily:"'Inter',system-ui,sans-serif",padding:'24px 0',borderRadius:14,cursor:'pointer',
                border:`2px solid ${qCount===n?C.cyan:'rgba(255,255,255,0.1)'}`,
                background:qCount===n?C.cyanDim:'rgba(255,255,255,0.04)',
                color:qCount===n?C.cyan:C.textSec,transition:`all 220ms ${ease}`,minHeight:88
              }}>
                <div style={{fontSize:32,fontWeight:900,fontFamily:"'Orbitron',monospace"}}>{n}</div>
                <div style={{fontSize:11,marginTop:5,letterSpacing:'0.08em',textTransform:'uppercase',opacity:0.7}}>{n===10?'~3 min':'~6 min'}</div>
              </button>
            ))}
          </div>
          <Btn onClick={()=>startGame('solo',qCount)} full size="lg" style={{fontFamily:"'Orbitron',monospace",letterSpacing:'0.1em',fontSize:13}}>INITIATE SCAN</Btn>
        </Panel>
      </div>
      {rules&&<RulesModal close={()=>setRules(false)}/>}
    </div>
  );

  // ARENA SETUP
  if(scr==='arena_setup') return (
    <div style={{...PAGE,...COL}}>
      <style>{CSS}</style>
      <GridBg/>{hdr}
      <div style={{position:'relative',zIndex:1,maxWidth:460,width:'100%',padding:mob?'24px 16px':'0 24px',animation:`fadeUp 0.5s ${ease}`}}>
        <Panel variant="hero" style={{padding:mob?24:36}}>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
            <HexLogo size={36}/>
            <div>
              <div style={LBL}>Neural Arena</div>
              <h2 style={{fontSize:20,fontWeight:800,margin:0}}>Match Configuration</h2>
            </div>
          </div>
          <div style={{marginBottom:22}}>
            <div style={LBL}>Round Count</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              {[10,20].map(n=>(
                <button key={n} onClick={()=>{clk();setQCount(n);}} style={{fontFamily:"'Inter',system-ui,sans-serif",padding:'16px 0',borderRadius:12,cursor:'pointer',border:`2px solid ${qCount===n?C.cyan:'rgba(255,255,255,0.1)'}`,background:qCount===n?C.cyanDim:'rgba(255,255,255,0.04)',color:qCount===n?C.cyan:C.textSec,transition:`all 220ms ${ease}`,minHeight:60,fontSize:20,fontWeight:800,fontFamily:"'Orbitron',monospace"}}>{n}Q</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:24}}>
            <div style={LBL}>CPU Opponents ({cpuCount})</div>
            <div style={{display:'flex',gap:8}}>
              {[1,2,3,4].map(n=>(
                <button key={n} onClick={()=>{clk();setCpuCount(n);}} style={{fontFamily:"'Inter',system-ui,sans-serif",flex:1,height:50,borderRadius:10,cursor:'pointer',border:`1px solid ${cpuCount===n?C.cyan:'rgba(255,255,255,0.1)'}`,background:cpuCount===n?C.cyanDim:'rgba(255,255,255,0.04)',color:cpuCount===n?C.cyan:C.textSec,fontWeight:700,fontSize:16,transition:`all 220ms ${ease}`}}>{n}</button>
              ))}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            <Btn onClick={()=>{clk();setRoomCode(Math.random().toString(36).slice(2,7).toUpperCase());setScr('arena_waiting');}} full size="lg" style={{fontFamily:"'Orbitron',monospace",letterSpacing:'0.1em',fontSize:12}}>⚡ QUICK MATCH</Btn>
            <Btn onClick={()=>{clk();setRoomCode(Math.random().toString(36).slice(2,7).toUpperCase());setScr('arena_waiting');}} variant="secondary" full>🔒 Create Private Room</Btn>
            <div style={{display:'flex',gap:8}}>
              <HudInput placeholder="Room code" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} style={{flex:1,width:'auto'}}/>
              <Btn onClick={()=>{clk();if(joinCode.length>=4){setRoomCode(joinCode);setScr('arena_waiting');}}} style={{padding:'0 22px',flexShrink:0,width:'auto'}}>Join</Btn>
            </div>
          </div>
        </Panel>
      </div>
      {rules&&<RulesModal close={()=>setRules(false)}/>}
    </div>
  );

  // ARENA WAITING
  if(scr==='arena_waiting') {
    const wP=[{id:me?.id,nickname:me?.nickname||me?.name||'You',isCPU:false},...CPU_PLAYERS.slice(0,cpuCount)];
    return (
      <div style={{...PAGE,...COL}}>
        <style>{CSS}</style>
        <GridBg/>{hdr}
        <div style={{position:'relative',zIndex:1,maxWidth:440,width:'100%',padding:mob?'24px 16px':'0 24px',animation:`fadeUp 0.5s ${ease}`}}>
          <Panel variant="hero" style={{padding:mob?24:36}}>
            <div style={{textAlign:'center',marginBottom:28}}>
              <div style={LBL}>Staging Area</div>
              <div style={{fontSize:11,color:C.textMuted,marginBottom:8,letterSpacing:'0.06em'}}>ROOM CODE</div>
              <div style={{fontSize:42,fontWeight:900,color:C.cyan,letterSpacing:10,marginBottom:16,fontFamily:"'Orbitron',monospace"}}>{roomCode}</div>
              <Btn onClick={()=>{clk();if(navigator.share)navigator.share({title:'AI Illusion Arena',text:`Join my room: ${roomCode}`}).catch(()=>{});else{navigator.clipboard?.writeText(roomCode).catch(()=>{});showToast('Room code copied!','success');}}} variant="secondary" size="sm" style={{width:'auto'}}>
                {typeof navigator!=='undefined'&&navigator.share?'📤 Share Room':'📋 Copy Code'}
              </Btn>
            </div>
            <div style={{marginBottom:24,maxHeight:240,overflowY:'auto'}}>
              <div style={LBL}>Operatives ({wP.length})</div>
              {wP.map((p,i)=>(
                <div key={p.id||i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 0',borderBottom:`1px solid ${C.borderSub}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:36,height:36,borderRadius:'50%',background:p.isCPU?'rgba(124,58,255,0.2)':C.cyanDim,border:`1px solid ${p.isCPU?'rgba(124,58,255,0.4)':C.cyanBorder}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{p.isCPU?'🤖':'👤'}</div>
                    <div>
                      <div style={{fontWeight:600,color:p.isCPU?'rgba(170,130,255,0.9)':C.text,fontSize:14}}>{p.nickname}</div>
                      {!p.isCPU&&<div style={{fontSize:9,color:C.cyan,letterSpacing:'0.1em',marginTop:2,fontFamily:"'Orbitron',monospace"}}>HOST</div>}
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <div style={{width:6,height:6,borderRadius:'50%',background:C.green,boxShadow:`0 0 6px ${C.green}`}}/>
                    <span style={{fontSize:11,color:C.textMuted}}>Ready</span>
                  </div>
                </div>
              ))}
            </div>
            <Btn onClick={()=>startGame('arena',qCount)} full size="lg" style={{fontFamily:"'Orbitron',monospace",letterSpacing:'0.1em',fontSize:12}}>▶ LAUNCH MATCH</Btn>
          </Panel>
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  // GAME
  if(scr==='game'||scr==='arena_game') {
    const q=qs[qi]; if(!q)return null;
    const last=answers[answers.length-1];
    const isArena=scr==='arena_game';
    const isImg=q.type==='image';
    const lb=[...arenaPlayers].sort((a,b)=>(b.score||0)-(a.score||0));
    const answerLabels=isImg?['AI Generated','Real Image']:['AI Generated','Human Drafted'];

    return (
      <div style={{...PAGE,paddingBottom:mob&&isArena?68:16}}>
        <style>{CSS}</style>
        <GridBg/>{hdr}

        {isArena&&mob&&(
          <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:200}}>
            <button onClick={()=>setLbOpen(o=>!o)} style={{width:'100%',background:'rgba(6,10,15,0.97)',border:'none',borderTop:`1px solid ${C.cyanBorder}`,color:C.cyan,fontSize:11,fontWeight:700,padding:'12px',cursor:'pointer',letterSpacing:'0.1em',fontFamily:"'Orbitron',monospace"}}>
              {lbOpen?'▼ HIDE':'▲ STANDINGS — YOUR RANK '} #{lb.findIndex(p=>!p.isCPU)+1}
            </button>
            {lbOpen&&(
              <div style={{background:'rgba(6,10,15,0.98)',borderTop:`1px solid ${C.borderSub}`,padding:'12px 16px',maxHeight:'36vh',overflowY:'auto'}}>
                {lb.map((p,i)=>(
                  <div key={p.id} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:`1px solid ${C.borderSub}`,background:!p.isCPU?'rgba(0,229,255,0.04)':'transparent',borderLeft:i===0?`3px solid ${C.gold}`:'3px solid transparent',paddingLeft:i===0?12:3}}>
                    <span style={{fontSize:13,minWidth:22,fontWeight:700,color:i===0?C.gold:C.textMuted,fontFamily:"'Orbitron',monospace"}}>{i===0?'▲':i+1}</span>
                    <span style={{flex:1,fontSize:13,fontWeight:!p.isCPU?700:400,color:!p.isCPU?C.text:C.textSec}}>{p.nickname}</span>
                    <span style={{fontSize:13,fontWeight:700,color:(p.score||0)>=0?C.cyan:'#FF8FA3',fontVariantNumeric:'tabular-nums',fontFamily:"'Orbitron',monospace"}}>{(p.score||0)>=0?'+':''}{p.score||0}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{position:'relative',zIndex:1,maxWidth:1280,margin:'0 auto',padding:mob?'12px 14px':'32px 24px',display:'flex',gap:24,alignItems:'flex-start'}}>
          <div style={{flex:'1 1 70%',minWidth:0}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10,padding:'10px 16px',background:'rgba(10,16,24,0.8)',borderRadius:12,border:`1px solid ${C.borderSub}`,backdropFilter:'blur(10px)'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:11,color:C.textMuted,fontFamily:"'Orbitron',monospace"}}>Q</span>
                <span style={{fontSize:16,fontWeight:800,color:C.text,fontFamily:"'Orbitron',monospace"}}>{qi+1}<span style={{fontSize:11,color:C.textMuted}}>/{qs.length}</span></span>
              </div>
              <div style={{fontSize:9,letterSpacing:'0.12em',color:C.cyan,fontWeight:700,textTransform:'uppercase',fontFamily:"'Orbitron',monospace"}}>{q.cat}</div>
              <div style={{fontSize:20,fontWeight:900,color:score>=0?C.cyan:C.red,fontFamily:"'Orbitron',monospace",fontVariantNumeric:'tabular-nums'}}>{score>=0?'+':''}{score}</div>
            </div>
            <div style={{height:2,background:'rgba(255,255,255,0.06)',borderRadius:1,marginBottom:20}}>
              <div style={{height:'100%',width:`${(qi/qs.length)*100}%`,background:`linear-gradient(90deg,${C.cyan},${C.purple})`,borderRadius:1,transition:'width 0.5s ease',boxShadow:`0 0 8px rgba(0,229,255,0.4)`}}/>
            </div>

            {!shown?(
              <>
                <div style={{display:'flex',justifyContent:'center',marginBottom:18}}><TimerRing t={tLeft}/></div>
                <Panel variant="hero" style={{padding:mob?18:28,marginBottom:18,animation:`fadeUp 0.4s ${ease}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                    <div style={{width:2,height:14,background:C.cyan,borderRadius:1}}/>
                    <span style={{fontSize:9,letterSpacing:'0.14em',color:C.cyan,fontWeight:700,textTransform:'uppercase',fontFamily:"'Orbitron',monospace"}}>Analyze Content</span>
                    <div style={{marginLeft:'auto',fontSize:9,color:C.textMuted,letterSpacing:'0.08em',background:'rgba(255,255,255,0.05)',padding:'4px 10px',borderRadius:6,textTransform:'uppercase'}}>{isImg?'Image Analysis':'Text Analysis'}</div>
                  </div>
                  {isImg ? (
                    <ImageContainer url={q.url}/>
                  ) : (
                    <p style={{fontSize:mob?15:16,lineHeight:1.85,margin:0,color:C.text,fontStyle:'normal'}}>{q.content}</p>
                  )}
                </Panel>
                <div style={{marginBottom:14}}>
                  <div style={{fontSize:10,color:C.textMuted,marginBottom:8,textAlign:'center',letterSpacing:'0.08em',textTransform:'uppercase'}}>
                    {conf?`◉ Confidence: ${conf}% selected`:'◎ Confidence level (optional)'}
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                    {[50,70,90,100].map(cv=>(
                      <button key={cv} onClick={()=>{clk();setConf(p=>p===cv?null:cv);}} style={{
                        fontFamily:"'Inter',system-ui,sans-serif",
                        background:conf===cv?C.cyanDim:'rgba(255,255,255,0.04)',
                        border:`1px solid ${conf===cv?C.cyan:C.borderSub}`,
                        borderRadius:10,color:conf===cv?C.cyan:C.textSec,
                        padding:'11px 0',fontSize:14,fontWeight:700,cursor:'pointer',minHeight:46,
                        transition:`all 220ms ${ease}`
                      }}>{cv}%</button>
                    ))}
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:mob?10:16}}>
                  {[{label:`🤖 ${answerLabels[0]}`,val:'AI',bg:'rgba(0,229,255,0.06)',brd:`rgba(0,229,255,0.3)`,col:C.cyan},
                    {label:isImg?`📷 ${answerLabels[1]}`:`✍️ ${answerLabels[1]}`,val:'Human',bg:'rgba(124,58,255,0.08)',brd:`rgba(124,58,255,0.35)`,col:'rgba(180,140,255,0.9)'}
                  ].map(a=>(
                    <button key={a.val} onClick={()=>submit(a.val)} style={{
                      fontFamily:"'Inter',system-ui,sans-serif",background:a.bg,border:`1px solid ${a.brd}`,borderRadius:14,
                      color:a.col,fontSize:mob?14:16,fontWeight:700,padding:mob?'18px 8px':'22px 16px',
                      cursor:'pointer',minHeight:60,transition:`all 220ms ${ease}`,
                      backdropFilter:'blur(10px)',letterSpacing:'0.01em'
                    }}>{a.label}</button>
                  ))}
                </div>
                {!conf&&<p style={{textAlign:'center',fontSize:10,color:C.textMuted,marginTop:8,letterSpacing:'0.06em',textTransform:'uppercase'}}>No confidence selected — base points only</p>}
              </>
            ):last&&(
              <div style={{animation:`resultIn 0.4s ${ease}`}}>
                <Panel variant={last.correct?'correct':'wrong'} style={{padding:mob?18:26,marginBottom:14,textAlign:'center'}}>
                  <div style={{fontSize:52,marginBottom:10}}>{last.correct?'✓':'✗'}</div>
                  <div style={{fontSize:20,fontWeight:800,color:last.correct?C.green:C.red,marginBottom:6,fontFamily:"'Orbitron',monospace",letterSpacing:'0.04em'}}>
                    {last.chosen===null?'TIMEOUT':last.correct?'CORRECT':'INCORRECT'}
                  </div>
                  <div style={{fontSize:14,color:C.textSec,marginBottom:10}}>
                    This was <strong style={{color:C.text}}>{q.isAI?'AI Generated':isImg?'Real Image':'Human Drafted'}</strong>
                  </div>
                  <div style={{fontSize:32,fontWeight:900,color:last.sc>=0?C.cyan:C.red,fontFamily:"'Orbitron',monospace",fontVariantNumeric:'tabular-nums'}}>{last.sc>=0?'+':''}{last.sc}</div>
                  {last.conf>0&&<div style={{fontSize:11,color:C.textMuted,marginTop:4,letterSpacing:'0.06em'}}>{last.conf}% Confidence Applied</div>}
                </Panel>
                {q.explanation&&(
                  <Panel variant="gold" style={{padding:mob?14:18,marginBottom:14}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                      <div style={{width:2,height:14,background:C.gold,borderRadius:1}}/>
                      <span style={{fontSize:9,letterSpacing:'0.12em',color:C.gold,fontWeight:700,textTransform:'uppercase',fontFamily:"'Orbitron',monospace"}}>Analysis Debrief</span>
                    </div>
                    <p style={{fontSize:13,color:C.textSec,lineHeight:1.7,margin:0}}>{q.explanation}</p>
                  </Panel>
                )}
                <Radar correct={last.correct}/>
                {isArena&&lb.filter(p=>p.isCPU&&p.lastR).map(p=>(
                  <Panel key={p.id} style={{padding:'10px 16px',marginTop:8,display:'flex',justifyContent:'space-between',alignItems:'center',animation:`fadeIn 0.4s ${ease}`,fontSize:13}}>
                    <span style={{color:C.textSec}}>🤖 <strong style={{color:C.text}}>{p.nickname}</strong></span>
                    <span style={{color:p.lastR?.correct?C.green:C.red,fontWeight:600}}>{p.lastR?.correct?'✓ Correct':'✗ Wrong'}</span>
                    <span style={{fontWeight:700,color:(p.lastR?.sc||0)>=0?C.cyan:C.red,fontFamily:"'Orbitron',monospace"}}>{(p.lastR?.sc||0)>=0?'+':''}{p.lastR?.sc||0}</span>
                  </Panel>
                ))}
                <div style={{textAlign:'center',marginTop:14,color:C.textMuted,fontSize:10,letterSpacing:'0.1em',textTransform:'uppercase'}}>Next question loading…</div>
              </div>
            )}
          </div>

          {isArena&&!mob&&(
            <div style={{flex:'0 0 30%',maxWidth:'30%',position:'sticky',top:74}}>
              <Panel style={{padding:20}}>
                <div style={{...LBL,marginBottom:16}}>Live Standings</div>
                {lb.map((p,i)=>(
                  <div key={p.id} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 0',borderBottom:`1px solid ${C.borderSub}`,
                    background:!p.isCPU?'rgba(0,229,255,0.04)':'transparent',
                    borderLeft:i===0?`3px solid ${C.gold}`:'3px solid transparent',
                    paddingLeft:i===0?12:3,marginLeft:i===0?-3:0,
                    transition:`all 300ms ${ease}`}}>
                    <span style={{fontSize:13,minWidth:24,fontWeight:700,color:i===0?C.gold:i===1?'#C0C0C0':i===2?'#CD7F32':C.textMuted,fontFamily:"'Orbitron',monospace"}}>{i===0?'▲':i+1}</span>
                    <div style={{flex:1,fontSize:13,fontWeight:!p.isCPU?700:400,color:!p.isCPU?C.text:C.textSec,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.nickname}</div>
                    <span style={{fontSize:13,fontWeight:700,color:(p.score||0)>=0?C.cyan:C.red,flexShrink:0,fontVariantNumeric:'tabular-nums',fontFamily:"'Orbitron',monospace"}}>{(p.score||0)>=0?'+':''}{p.score||0}</span>
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

  // END
  if(scr==='end') {
    const corr=answers.filter(a=>a.correct).length;
    const acc=answers.length?Math.round(corr/answers.length*100):0;
    const avgT=answers.length?Math.round(answers.reduce((s,a)=>s+parseFloat(a.time||0),0)/answers.length*10)/10:0;
    const fs=scoreRef.current;
    const medal=fs>=1000?'🥇':fs>=600?'🥈':fs>=300?'🥉':'🎖';
    const arenaFinal=[...arenaPlayers].map(p=>p.isCPU?p:{...p,score:fs}).sort((a,b)=>(b.score||0)-(a.score||0));
    return (
      <div style={{...PAGE}}>
        <style>{CSS}</style>
        <GridBg/>{hdr}
        <div style={{position:'relative',zIndex:1,maxWidth:1100,margin:'0 auto',padding:mob?'24px 16px':'48px 24px',display:'flex',gap:24,flexWrap:'wrap',animation:`fadeUp 0.5s ${ease}`}}>
          <div style={{flex:1,minWidth:280}}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{fontSize:72,marginBottom:10}}>{medal}</div>
              <h2 style={{fontSize:mob?24:32,fontWeight:900,margin:'0 0 4px',letterSpacing:'-0.02em',background:'linear-gradient(135deg,#FFFFFF,rgba(0,229,255,0.85))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Mission Complete</h2>
              <p style={{color:C.textSec,margin:0,fontSize:13,letterSpacing:'0.04em'}}>{corr} of {answers.length} correctly classified</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
              {[{l:'Score',v:fs>=0?`+${fs}`:fs,c:fs>=0?C.cyan:C.red},{l:'Accuracy',v:`${acc}%`,c:C.text},{l:'Avg Time',v:`${avgT}s`,c:C.text}].map(x=>(
                <Panel key={x.l} style={{padding:16,textAlign:'center'}}>
                  <div style={{fontSize:24,fontWeight:900,color:x.c,fontFamily:"'Orbitron',monospace",fontVariantNumeric:'tabular-nums'}}>{x.v}</div>
                  <div style={{fontSize:10,color:C.textMuted,marginTop:4,letterSpacing:'0.1em',textTransform:'uppercase'}}>{x.l}</div>
                </Panel>
              ))}
            </div>
            {gameMode==='arena'&&arenaFinal.length>0&&(
              <Panel style={{padding:mob?16:22,marginBottom:16}}>
                <div style={LBL}>Final Standings</div>
                {arenaFinal.map((p,i)=>(
                  <div key={p.id||i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:`1px solid ${C.borderSub}`,borderLeft:i===0?`3px solid ${C.gold}`:'3px solid transparent',paddingLeft:i===0?14:3,background:!p.isCPU?'rgba(0,229,255,0.04)':'transparent'}}>
                    <span style={{fontSize:15,minWidth:24,color:i===0?C.gold:i===1?'#C0C0C0':i===2?'#CD7F32':C.textMuted,fontFamily:"'Orbitron',monospace",fontWeight:700}}>{i===0?'▲':i+1}</span>
                    <span style={{flex:1,color:!p.isCPU?C.text:C.textSec,fontWeight:!p.isCPU?700:400,fontSize:14}}>{p.nickname}{!p.isCPU?' (You)':''}</span>
                    <span style={{fontWeight:700,color:(p.score||0)>=0?C.cyan:C.red,fontFamily:"'Orbitron',monospace",fontVariantNumeric:'tabular-nums'}}>{(p.score||0)>=0?'+':''}{p.score||0}</span>
                  </div>
                ))}
              </Panel>
            )}
            <Panel style={{padding:mob?16:22,marginBottom:16}}>
              <div style={LBL}>Round Debrief</div>
              {answers.map((a,i)=>(
                <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 0',borderBottom:`1px solid ${C.borderSub}`}}>
                  <span style={{color:a.correct?C.green:C.red,flexShrink:0,fontSize:15,fontWeight:800}}>{a.correct?'✓':'✗'}</span>
                  <div style={{flex:1,minWidth:0}}>
                    {a.q.type==='image'
                      ?<div style={{fontSize:12,color:C.textMuted,fontStyle:'italic'}}>Image — {a.q.cat}</div>
                      :<div style={{fontSize:12,color:C.textSec,lineHeight:1.5}}>{a.q.content.slice(0,65)}…</div>
                    }
                    <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>
                      Truth: <span style={{color:C.textSec}}>{a.q.isAI?'AI':a.q.type==='image'?'Real Image':'Human Drafted'}</span> · You: {a.chosen||'Timeout'} · Conf: {a.conf||'—'}%
                    </div>
                  </div>
                  <span style={{color:a.sc>=0?C.cyan:C.red,fontWeight:700,flexShrink:0,fontSize:13,fontFamily:"'Orbitron',monospace",fontVariantNumeric:'tabular-nums'}}>{a.sc>=0?'+':''}{a.sc}</span>
                </div>
              ))}
            </Panel>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <Btn onClick={()=>startGame(gameMode,qCount)} full size="lg" style={{fontFamily:"'Orbitron',monospace",letterSpacing:'0.08em',fontSize:12}}>PLAY AGAIN</Btn>
              <Btn onClick={()=>goto('mode_select')} variant="secondary" full size="lg">Main Menu</Btn>
            </div>
          </div>
          <div style={{width:mob?'100%':280,flexShrink:0}}><RotatingNews/></div>
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  // PROFILE
  if(scr==='profile') {
    const sess=me?.sessions||[];
    const best=sess.length?Math.max(...sess.map(s=>s.score||0)):0;
    const avgAcc=sess.length?Math.round(sess.reduce((s,x)=>s+(x.acc||0),0)/sess.length):0;
    return (
      <div style={{...PAGE}}>
        <style>{CSS}</style>
        <GridBg/>{hdr}
        <div style={{...WRAP,maxWidth:560}}>
          <h2 style={{fontSize:22,fontWeight:800,marginBottom:24,letterSpacing:'-0.01em'}}>Operative Profile</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:20}}>
            {[{l:'Sessions',v:sess.length},{l:'Best Score',v:best},{l:'Avg Accuracy',v:`${avgAcc}%`}].map(x=>(
              <Panel key={x.l} style={{padding:16,textAlign:'center'}}>
                <div style={{fontSize:22,fontWeight:800,color:C.cyan,fontFamily:"'Orbitron',monospace"}}>{x.v}</div>
                <div style={{fontSize:10,color:C.textMuted,marginTop:4,letterSpacing:'0.1em',textTransform:'uppercase'}}>{x.l}</div>
              </Panel>
            ))}
          </div>
          <Panel style={{padding:mob?20:28,marginBottom:16}}>
            <div style={LBL}>Edit Profile</div>
            <HudInput placeholder={me?.name} onChange={e=>setPForm(p=>({...p,name:e.target.value}))} style={{marginBottom:10}}/>
            <HudInput placeholder={me?.nickname} onChange={e=>setPForm(p=>({...p,nickname:e.target.value}))} style={{marginBottom:10}}/>
            <select defaultValue={me?.occupation} onChange={e=>setPForm(p=>({...p,occupation:e.target.value}))} style={{fontFamily:"'Inter',system-ui,sans-serif",background:'rgba(255,255,255,0.05)',border:`1px solid ${C.borderSub}`,borderRadius:12,color:C.text,padding:'14px 16px',fontSize:14,width:'100%',outline:'none',minHeight:50,marginBottom:12}}>
              <option>Student</option><option>Professional</option><option>Other</option>
            </select>
            <div style={{fontSize:12,color:C.textMuted,marginBottom:16,letterSpacing:'0.02em'}}>◉ Email: {me?.email} (locked)</div>
            <Btn onClick={()=>{clk();const upd={name:pForm.name||me.name,nickname:pForm.nickname||me.nickname,occupation:pForm.occupation||me.occupation};setMe(p=>({...p,...upd}));setUsers(p=>p.map(u=>u.id===me.id?{...u,...upd}:u));setPMsg('Saved');setTimeout(()=>setPMsg(''),2000);showToast('Profile updated','success');}} full>Save Changes</Btn>
            {pMsg&&<div style={{color:C.green,fontSize:13,marginTop:10,textAlign:'center'}}>✓ {pMsg}</div>}
          </Panel>
          <Panel style={{padding:mob?18:24}}>
            <div style={LBL}>Session Log</div>
            {sess.length===0?<p style={{color:C.textMuted,fontSize:13}}>No sessions recorded. Complete a game to see your history.</p>
              :sess.slice().reverse().slice(0,8).map((s,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:`1px solid ${C.borderSub}`,fontSize:13}}>
                  <span style={{color:C.textSec}}>{new Date(s.date).toLocaleDateString()}</span>
                  <span style={{fontWeight:700,color:s.score>=0?C.cyan:C.red,fontFamily:"'Orbitron',monospace",fontVariantNumeric:'tabular-nums'}}>{s.score>=0?'+':''}{s.score}</span>
                  <span style={{color:C.textMuted}}>{s.acc}% acc</span>
                </div>
              ))}
          </Panel>
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }

  // ADMIN
  if(scr==='admin') {
    if(!me?.isAdmin)return<div style={{...PAGE,...COL}}><p style={{color:C.red}}>Access Denied</p></div>;
    const allSess=users.flatMap(u=>(u.sessions||[]).map(s=>({...s,user:u.nickname||u.name})));
    return (
      <div style={{...PAGE}}>
        <style>{CSS}</style>
        <GridBg/>{hdr}
        <div style={{...WRAP}}>
          <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:24}}>
            <h2 style={{fontSize:19,fontWeight:800,margin:0}}>Admin Panel</h2>
            <span style={{fontSize:9,letterSpacing:'0.14em',color:C.red,fontFamily:"'Orbitron',monospace",border:`1px solid rgba(255,59,92,0.4)`,padding:'3px 8px',borderRadius:4}}>RESTRICTED</span>
          </div>
          <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
            {['users','questions','sessions','image pools'].map(t=>(
              <button key={t} onClick={()=>{clk();setATab(t);}} style={{fontFamily:"'Inter',system-ui,sans-serif",background:aTab===t?C.cyanDim:'transparent',border:`1px solid ${aTab===t?C.cyan:C.borderSub}`,borderRadius:10,color:aTab===t?C.cyan:C.textSec,padding:'9px 18px',cursor:'pointer',fontSize:12,fontWeight:600,textTransform:'capitalize',minHeight:40,transition:`all 220ms ${ease}`,backdropFilter:'blur(10px)'}}>{t}</button>
            ))}
          </div>
          {aTab==='users'&&(
            <Panel style={{padding:20,overflowX:'auto'}}>
              <div style={LBL}>Users ({users.length})</div>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
                <thead><tr>{['Name','Email','Nickname','Occupation','Sessions','Admin'].map(h=>(
                  <th key={h} style={{padding:'8px 12px',textAlign:'left',color:C.textMuted,borderBottom:`1px solid ${C.borderSub}`,letterSpacing:'0.08em',fontWeight:500,textTransform:'uppercase',fontSize:10,whiteSpace:'nowrap'}}>{h}</th>
                ))}</tr></thead>
                <tbody>{users.map(u=>(
                  <tr key={u.id}>{[u.name,u.email,u.nickname,u.occupation,(u.sessions||[]).length,u.isAdmin?'★':''].map((v,i)=>(
                    <td key={i} style={{padding:'10px 12px',color:i===5&&v?C.gold:C.textSec,borderBottom:`1px solid ${C.borderSub}`,whiteSpace:'nowrap'}}>{v}</td>
                  ))}</tr>
                ))}</tbody>
              </table>
            </Panel>
          )}
          {aTab==='questions'&&(
            <Panel style={{padding:20,maxHeight:'60vh',overflowY:'auto'}}>
              <div style={LBL}>Question Bank ({ALL_QS.length} total)</div>
              {TQS.map(q=>(
                <div key={q.id} style={{display:'flex',gap:10,padding:'9px 0',borderBottom:`1px solid ${C.borderSub}`,fontSize:12}}>
                  <span style={{flexShrink:0,fontSize:9,padding:'3px 8px',borderRadius:4,background:q.isAI?C.cyanDim:C.purpleDim,color:q.isAI?C.cyan:'rgba(180,140,255,0.9)',fontWeight:700,letterSpacing:'0.08em',height:'fit-content'}}>{q.isAI?'AI':'HUM'}</span>
                  <span style={{fontSize:9,color:C.cyan,flexShrink:0,minWidth:78,letterSpacing:'0.06em',paddingTop:1,textTransform:'uppercase'}}>{q.cat}</span>
                  <span style={{color:C.textSec,lineHeight:1.5}}>{q.content}</span>
                </div>
              ))}
            </Panel>
          )}
          {aTab==='sessions'&&(
            <Panel style={{padding:20}}>
              <div style={LBL}>All Sessions ({allSess.length})</div>
              {allSess.length===0?<p style={{color:C.textMuted,fontSize:13}}>No sessions yet.</p>
                :allSess.sort((a,b)=>b.score-a.score).map((s,i)=>(
                  <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:`1px solid ${C.borderSub}`,fontSize:13,gap:10,flexWrap:'wrap'}}>
                    <span style={{color:C.textSec,minWidth:90}}>{s.user}</span>
                    <span style={{color:C.textMuted,fontSize:12}}>{new Date(s.date).toLocaleDateString()}</span>
                    <span style={{fontWeight:700,color:s.score>=0?C.cyan:C.red,fontFamily:"'Orbitron',monospace",fontVariantNumeric:'tabular-nums'}}>{s.score>=0?'+':''}{s.score}</span>
                    <span style={{color:C.textMuted}}>{s.acc}%</span>
                  </div>
                ))
              }
            </Panel>
          )}
          {aTab==='image pools'&&(
            <Panel style={{padding:20}}>
              <div style={LBL}>Image Pool Config ({aiImgs.length} AI · {realImgs.length} Real)</div>
              <p style={{fontSize:12,color:C.textSec,marginBottom:16,lineHeight:1.65}}>Paste JSON arrays of Cloudinary direct image URLs. Changes apply immediately to new sessions.</p>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:C.cyan,marginBottom:6,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase'}}>AI Image URLs Array</div>
                <textarea value={imgEdit.ai} onChange={e=>setImgEdit(p=>({...p,ai:e.target.value}))} style={{fontFamily:'monospace',background:'rgba(255,255,255,0.04)',border:`1px solid ${C.borderSub}`,borderRadius:10,color:C.text,padding:'12px 14px',fontSize:11,width:'100%',outline:'none',minHeight:120,resize:'vertical'}}/>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,color:C.cyan,marginBottom:6,fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase'}}>Real Image URLs Array</div>
                <textarea value={imgEdit.real} onChange={e=>setImgEdit(p=>({...p,real:e.target.value}))} style={{fontFamily:'monospace',background:'rgba(255,255,255,0.04)',border:`1px solid ${C.borderSub}`,borderRadius:10,color:C.text,padding:'12px 14px',fontSize:11,width:'100%',outline:'none',minHeight:120,resize:'vertical'}}/>
              </div>
              <Btn onClick={()=>{
                try{const ai=JSON.parse(imgEdit.ai),real=JSON.parse(imgEdit.real);
                  if(!Array.isArray(ai)||!Array.isArray(real))throw new Error('Must be JSON arrays');
                  setAiImgs(ai);setRealImgs(real);setImgMsg(`✓ Applied: ${ai.length} AI + ${real.length} real images`);
                }catch(e){setImgMsg('✗ Invalid JSON: '+e.message);}
                setTimeout(()=>setImgMsg(''),4000);
              }} full>Apply Image Pools</Btn>
              {imgMsg&&<div style={{fontSize:13,color:imgMsg.startsWith('✓')?C.green:C.red,textAlign:'center',marginTop:12}}>{imgMsg}</div>}
            </Panel>
          )}
        </div>
        {rules&&<RulesModal close={()=>setRules(false)}/>}
      </div>
    );
  }
  return null;
}
