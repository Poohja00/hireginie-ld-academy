/* Hireginie L&D Academy — curriculum + exam bank */
export const MODULES = [
  {id:"m1", n:1, title:"Foundations of L&D", blurb:"What L&D is, the business it serves, and how needs are identified."},
  {id:"m2", n:2, title:"The Science of Learning", blurb:"How adults actually learn, and the frameworks that shape good learning."},
  {id:"m3", n:3, title:"Designing & Delivering Learning", blurb:"Turning a need into a structured, well-facilitated programme."},
  {id:"m4", n:4, title:"Measurement & Technology", blurb:"Proving impact and running learning at scale."},
  {id:"m5", n:5, title:"Talent & Growth", blurb:"Developing people, performance, leaders and careers."},
  {id:"m6", n:6, title:"Strategy & The Future", blurb:"Running L&D as a strategic function and where it is heading."}
];

export const TOPICS = [
/* ---------- MODULE 1 ---------- */
{n:1,id:"what-is-ld",m:"m1",icon:"compass",title:"What is L&D?",tag:"Foundations",read:5,key:"L&D builds capability; training is a single event within it.",
 sec:[
  {h:"Definition",b:`<p>Learning &amp; Development improves employee <b>knowledge, skills, behaviours and capabilities</b> so individuals and the organisation reach their goals.</p>`},
  {h:"Purpose",b:`<ul><li>Improve performance &amp; productivity</li><li>Build the leadership pipeline</li><li>Close skill gaps</li><li>Support change</li><li>Lift engagement &amp; retention</li></ul>`},
  {h:"L&D vs Training",b:`<table><tr><th>Training</th><th>L&amp;D</th></tr><tr><td>Teach a rep to use Salesforce</td><td>Develop future sales leaders</td></tr><tr><td>An event</td><td>A continuous capability strategy</td></tr></table>`},
  {h:"At Hireginie",b:`<p>Training teaches a new recruiter to post a JD. L&amp;D grows them into a talent advisor who runs a full source-to-offer cycle and eventually leads a pod.</p>`}
 ]},
{n:2,id:"business-acumen",m:"m1",icon:"chart",title:"Business Acumen for L&D",tag:"Foundations",read:5,key:"Every programme should move a business metric, not just fill seats.",
 sec:[
  {h:"Why it matters",b:`<p>Strong L&amp;D professionals think like business leaders and tie learning to outcomes.</p>`},
  {h:"Key metrics",b:`<table><tr><th>Metric</th><th>Measure</th></tr><tr><td>Revenue</td><td>Price &times; Quantity</td></tr><tr><td>Profit</td><td>Revenue &minus; Expenses</td></tr><tr><td>Productivity</td><td>Output per employee</td></tr><tr><td>Customer satisfaction</td><td>NPS &middot; CSAT &middot; Retention</td></tr></table>`},
  {h:"The chain",b:`<div class="callout good">Service training &rarr; better experience &rarr; higher NPS &rarr; stronger retention. L&amp;D must be able to draw this line.</div>`}
 ]},
{n:3,id:"tna",m:"m1",icon:"search",title:"Training Needs Analysis (TNA)",tag:"Process",read:6,key:"Diagnose the gap and root cause before prescribing training.",
 sec:[
  {h:"Definition",b:`<p>Identifying the <b>gap</b> between current and desired performance.</p><div class="callout">Current State &rarr; <span class="hi">Gap</span> &rarr; Solution</div>`},
  {h:"The critical question",b:`<div class="callout warn">"Do we actually need training?" A skill gap is only one cause of poor performance — pricing, process, tools or motivation may be the real issue.</div>`},
  {h:"Three levels",b:`<table><tr><th>Type</th><th>Asks</th></tr><tr><td>Organisational</td><td>What are the company goals &amp; needed skills?</td></tr><tr><td>Task</td><td>What tasks &amp; competencies does the role require?</td></tr><tr><td>Individual</td><td>Who specifically has a gap?</td></tr></table>`}
 ]},
{n:4,id:"competency",m:"m1",icon:"grid",title:"Competency Mapping",tag:"Process",read:5,key:"Competency = Knowledge + Skill + Behaviour for a role.",
 sec:[
  {h:"Definition",b:`<p>Defining the <b>knowledge, skills and behaviours</b> needed to succeed in a role.</p>`},
  {h:"Three parts",b:`<table><tr><th>Component</th><th>Means</th><th>Example</th></tr><tr><td>Knowledge</td><td>What you know</td><td>The hiring funnel</td></tr><tr><td>Skill</td><td>What you can do</td><td>Offer negotiation</td></tr><tr><td>Behaviour</td><td>How you act</td><td>Candidate empathy</td></tr></table>`},
  {h:"Use it to diagnose",b:`<p>If candidates drop at offer stage, the gap is likely Skill/Behaviour — not Knowledge. Map all three before designing a fix.</p>`}
 ]},
/* ---------- MODULE 2 ---------- */
{n:5,id:"andragogy",m:"m2",icon:"brain",title:"Adult Learning (Andragogy)",tag:"Theory",read:7,key:"Adults need relevance, ownership and real problems — Knowles' 6 principles.",
 sec:[
  {h:"What is it",b:`<p>Andragogy (Malcolm Knowles) — the science of helping <b>adults</b> learn. Adults differ from children (pedagogy).</p>`},
  {h:"Knowles' 6 principles",b:`<table><tr><th>Principle</th><th>For L&amp;D</th></tr><tr><td>Need to know</td><td>Lead with the benefit, not the agenda</td></tr><tr><td>Self-concept</td><td>Give choice &amp; self-pacing</td></tr><tr><td>Prior experience</td><td>Use discussion &amp; peer learning</td></tr><tr><td>Readiness</td><td>Deliver at the moment of need</td></tr><tr><td>Orientation</td><td>Solve real problems</td></tr><tr><td>Internal motivation</td><td>Link to growth &amp; mastery</td></tr></table>`},
  {h:"Avoid",b:`<div class="callout bad">Too much theory, no application, one-way lectures, ignoring experience, no follow-up.</div>`}
 ]},
{n:6,id:"blooms",m:"m2",icon:"steps",title:"Bloom's Taxonomy",tag:"Theory",read:6,key:"Six levels: Remember, Understand, Apply, Analyze, Evaluate, Create.",
 sec:[
  {h:"What is it",b:`<p>Classifies learning objectives by <b>cognitive complexity</b>, low to high.</p>`},
  {h:"The 6 levels",b:`<table><tr><th>Level</th><th>Question</th><th>Verbs</th></tr><tr><td>Create</td><td>Build something new?</td><td>design, develop</td></tr><tr><td>Evaluate</td><td>Make a judgement?</td><td>justify, recommend</td></tr><tr><td>Analyze</td><td>Break it down?</td><td>diagnose, examine</td></tr><tr><td>Apply</td><td>Use it?</td><td>implement, solve</td></tr><tr><td>Understand</td><td>Explain it?</td><td>summarise, compare</td></tr><tr><td>Remember</td><td>Recall it?</td><td>define, list</td></tr></table>`},
  {h:"The trap",b:`<p>Most training stops at Remember/Understand. Business impact lives at Apply, Analyze, Evaluate, Create.</p>`}
 ]},
{n:7,id:"70-20-10",m:"m2",icon:"scale",title:"The 70-20-10 Model",tag:"Theory",read:5,key:"70% experience, 20% from others, 10% formal — experience dominates.",
 sec:[
  {h:"The model",b:`<table><tr><th>%</th><th>Source</th></tr><tr><td>70</td><td>Experience — real work, stretch assignments</td></tr><tr><td>20</td><td>Others — coaching, mentoring, feedback</td></tr><tr><td>10</td><td>Formal — courses, workshops</td></tr></table>`},
  {h:"Insight",b:`<div class="callout">People remember what they <b>do</b> far more than what they hear. Design beyond the classroom.</div>`}
 ]},
{n:8,id:"learning-culture",m:"m2",icon:"users",title:"Learning Culture & Continuous Learning",tag:"Strategy",read:6,key:"A learning culture makes growth a shared habit, not an event.",
 sec:[
  {h:"What is it",b:`<p>An environment where continuous learning is expected, supported and rewarded — not a once-a-year course.</p>`},
  {h:"Signals of a strong culture",b:`<ul><li>Leaders model learning &amp; share openly</li><li>Time is protected for development</li><li>Mistakes are treated as learning</li><li>Knowledge sharing is normal</li><li>Curiosity is rewarded</li></ul>`},
  {h:"Why it matters",b:`<div class="callout good">Skills decay fast. A learning culture keeps the workforce adaptable and is the strongest predictor of L&amp;D impact.</div>`}
 ]},
/* ---------- MODULE 3 ---------- */
{n:9,id:"addie",m:"m3",icon:"wrench",title:"The ADDIE Model",tag:"Process",read:6,key:"Analysis, Design, Development, Implementation, Evaluation — the ID lifecycle.",
 sec:[
  {h:"The 5 phases",b:`<table><tr><th>Phase</th><th>Question</th><th>Output</th></tr><tr><td>Analysis</td><td>Do we need it? What gap?</td><td>TNA</td></tr><tr><td>Design</td><td>What should it look like?</td><td>Objectives, curriculum</td></tr><tr><td>Development</td><td>Build it</td><td>Materials</td></tr><tr><td>Implementation</td><td>Deliver it</td><td>Sessions run</td></tr><tr><td>Evaluation</td><td>Did it work?</td><td>Results</td></tr></table>`},
  {h:"Why",b:`<div class="callout good">ADDIE makes training structured, relevant, measurable and aligned to business goals. It is cyclical — evaluation feeds back into analysis.</div>`}
 ]},
{n:10,id:"instructional-design",m:"m3",icon:"pen",title:"Instructional Design",tag:"Process",read:6,key:"Design training that changes performance — write SMART objectives.",
 sec:[
  {h:"What is it",b:`<p>The science of designing learning that <b>changes performance</b>, not just delivering content.</p><div class="callout">Knowledge &rarr; Application &rarr; Behaviour change &rarr; Business results</div>`},
  {h:"SMART objectives",b:`<div class="callout bad">Weak: "Understand leadership."</div><div class="callout good">Strong: "Conduct a feedback conversation using the SBI framework."</div><p><b>S</b>pecific, <b>M</b>easurable, <b>A</b>chievable, <b>R</b>elevant, <b>T</b>ime-bound.</p>`},
  {h:"Models",b:`<p><span class="pill">ADDIE</span> <span class="pill">SAM (iterative)</span> <span class="pill">Agile design</span></p>`}
 ]},
{n:11,id:"facilitation",m:"m3",icon:"mic",title:"Facilitation & Delivery Skills",tag:"Delivery",read:6,key:"A facilitator guides discovery; a lecturer just transmits.",
 sec:[
  {h:"Facilitation vs lecturing",b:`<table><tr><th>Lecturer</th><th>Facilitator</th></tr><tr><td>Transmits content</td><td>Guides discovery</td></tr><tr><td>Talks</td><td>Asks &amp; listens</td></tr><tr><td>Passive room</td><td>Active participation</td></tr></table>`},
  {h:"Core skills",b:`<ul><li>Questioning &amp; active listening</li><li>Managing group dynamics &amp; dominant voices</li><li>Reading energy and re-engaging the room</li><li>Handling difficult participants</li><li>Time &amp; pace management</li></ul>`},
  {h:"Engagement techniques",b:`<p>Polls, breakouts, role plays, think-pair-share, real scenarios. Aim for participants talking more than the trainer.</p>`}
 ]},
{n:12,id:"onboarding",m:"m3",icon:"door",title:"Onboarding & Induction Design",tag:"Delivery",read:6,key:"Onboarding drives early productivity and retention — design it deliberately.",
 sec:[
  {h:"What is it",b:`<p>The structured process that helps a new hire become productive, connected and confident.</p>`},
  {h:"The 4 Cs",b:`<table><tr><th>C</th><th>Focus</th></tr><tr><td>Compliance</td><td>Policies, paperwork, mandatory training</td></tr><tr><td>Clarification</td><td>Role, expectations, goals</td></tr><tr><td>Culture</td><td>Values, norms, ways of working</td></tr><tr><td>Connection</td><td>Relationships, network, belonging</td></tr></table>`},
  {h:"Why it matters",b:`<div class="callout good">Strong onboarding lifts new-hire retention and speeds time-to-productivity. Weak onboarding is a leading cause of early attrition.</div>`}
 ]},
/* ---------- MODULE 4 ---------- */
{n:13,id:"kirkpatrick",m:"m4",icon:"trend",title:"The Kirkpatrick Model",tag:"Measurement",read:6,key:"Four levels: Reaction, Learning, Behaviour, Results.",
 sec:[
  {h:"The 4 levels",b:`<table><tr><th>Level</th><th>Question</th><th>Measure</th></tr><tr><td>1 Reaction</td><td>Did they like it?</td><td>Surveys</td></tr><tr><td>2 Learning</td><td>Did they learn?</td><td>Pre/post tests</td></tr><tr><td>3 Behaviour</td><td>Did behaviour change?</td><td>On-the-job observation</td></tr><tr><td>4 Results</td><td>Business impact?</td><td>KPIs, ROI</td></tr></table>`},
  {h:"The trap",b:`<div class="callout warn">Most teams measure only Level 1 (a "smile sheet"). Real proof of value lives at Levels 3 &amp; 4.</div>`}
 ]},
{n:14,id:"roi",m:"m4",icon:"coin",title:"ROI of Training",tag:"Measurement",read:5,key:"ROI% = (Benefit − Cost) ÷ Cost × 100.",
 sec:[
  {h:"Formula",b:`<div class="callout">ROI&nbsp;% = (Benefit &minus; Cost) &divide; Cost &times; 100</div>`},
  {h:"Examples",b:`<table><tr><th>Benefit</th><th>Cost</th><th>ROI</th></tr><tr><td>50</td><td>10</td><td>400%</td></tr><tr><td>40</td><td>10</td><td>300%</td></tr><tr><td>50</td><td>20</td><td>150%</td></tr></table>`},
  {h:"Why",b:`<p>ROI moves the conversation from "trainings delivered" to "value created" — and earns L&amp;D a seat at the table.</p>`}
 ]},
{n:15,id:"analytics",m:"m4",icon:"activity",title:"Learning Analytics",tag:"Measurement",read:6,key:"Modern L&D measures behaviour change and impact, not attendance.",
 sec:[
  {h:"Old vs new metrics",b:`<table><tr><th>Traditional</th><th>Modern</th></tr><tr><td>Attendance</td><td>Skill acquisition</td></tr><tr><td>Completion rate</td><td>Behaviour change</td></tr><tr><td>Satisfaction</td><td>Business impact &amp; ROI</td></tr></table>`},
  {h:"What it connects",b:`<p>Learning data (courses done) &times; performance data (productivity) &times; business outcomes (revenue, retention, CSAT).</p>`},
  {h:"Leaders ask",b:`<ul><li>Which programmes improve performance?</li><li>What capability gaps exist?</li><li>Where should we invest next?</li></ul>`}
 ]},
{n:16,id:"lms",m:"m4",icon:"monitor",title:"LMS, LXP & Learning Tech",tag:"Technology",read:6,key:"LMS = admin & tracking; LXP = discovery & experience. SCORM/xAPI carry the data.",
 sec:[
  {h:"LMS vs LXP",b:`<table><tr><th>LMS</th><th>LXP</th></tr><tr><td>Admin: assign &amp; track</td><td>Learner: discover &amp; explore</td></tr><tr><td>Structured, compliance</td><td>Personalised, social, Netflix-like</td></tr><tr><td>Moodle, corporate LMS</td><td>Degreed, EdCast</td></tr></table>`},
  {h:"An LMS does",b:`<p>Deliver learning, track completion, manage learners, report, handle certification/compliance (e.g. POSH).</p>`},
  {h:"Standards",b:`<p><span class="pill">SCORM</span> the long-time packaging standard &nbsp; <span class="pill">xAPI (Tin Can)</span> tracks learning anywhere, including outside the LMS, into an LRS.</p>`}
 ]},
/* ---------- MODULE 5 ---------- */
{n:17,id:"performance-mgmt",m:"m5",icon:"target",title:"Performance Management",tag:"Strategy",read:5,key:"Continuous goal-setting and feedback — not an annual appraisal.",
 sec:[
  {h:"What is it",b:`<p>A <b>continuous</b> process of aligning, developing and measuring performance against goals.</p>`},
  {h:"Frameworks",b:`<table><tr><th>Framework</th><th>Idea</th></tr><tr><td>MBO</td><td>Management by Objectives</td></tr><tr><td>OKRs</td><td>Objective + measurable Key Results</td></tr><tr><td>Balanced Scorecard</td><td>Finance, customer, process, learning</td></tr></table>`}
 ]},
{n:18,id:"leadership",m:"m5",icon:"flag",title:"Leadership Development",tag:"Strategy",read:6,key:"Leadership is about people and vision; management is about process.",
 sec:[
  {h:"What it builds",b:`<p><span class="pill">Self-awareness</span><span class="pill">Emotional intelligence</span><span class="pill">Communication</span><span class="pill">Decision making</span><span class="pill">Strategic thinking</span><span class="pill">Coaching others</span><span class="pill">Change leadership</span></p>`},
  {h:"Models",b:`<table><tr><th>Model</th><th>Idea</th></tr><tr><td>Situational Leadership</td><td>Adapt style to follower readiness</td></tr><tr><td>Transformational</td><td>Inspire beyond self-interest</td></tr></table>`}
 ]},
{n:19,id:"coaching-mentoring",m:"m5",icon:"handshake",title:"Coaching vs Mentoring",tag:"Development",read:6,key:"Coaching = immediate performance; mentoring = long-term growth. GROW structures a coaching chat.",
 sec:[
  {h:"The distinction",b:`<table><tr><th></th><th>Coaching</th><th>Mentoring</th></tr><tr><td>Focus</td><td>Immediate performance &amp; skills</td><td>Long-term career</td></tr><tr><td>Span</td><td>Short, structured</td><td>Ongoing relationship</td></tr><tr><td>Driven by</td><td>Coach asks questions</td><td>Mentor shares experience</td></tr></table>`},
  {h:"The GROW model",b:`<p><b>G</b>oal &rarr; <b>R</b>eality &rarr; <b>O</b>ptions &rarr; <b>W</b>ill (way forward). A simple structure for any coaching conversation.</p>`}
 ]},
{n:20,id:"idp",m:"m5",icon:"route",title:"IDPs & Career Pathing",tag:"Development",read:6,key:"An IDP turns career aspiration into a concrete, owned development plan.",
 sec:[
  {h:"What is an IDP",b:`<p>An <b>Individual Development Plan</b> — a personalised roadmap linking an employee's goals to specific learning and experiences.</p>`},
  {h:"What it contains",b:`<ul><li>Career goal &amp; target role</li><li>Current strengths &amp; gaps</li><li>Development actions (often 70-20-10)</li><li>Timeline &amp; success measures</li></ul>`},
  {h:"Career pathing",b:`<div class="callout good">Clear paths and IDPs are powerful retention tools — people stay where they can see a future.</div>`}
 ]},
/* ---------- MODULE 6 ---------- */
{n:21,id:"ld-strategy",m:"m6",icon:"map",title:"L&D Strategy & Operating Model",tag:"Strategy",read:7,key:"L&D strategy aligns capability building to business goals, with clear governance.",
 sec:[
  {h:"What is it",b:`<p>The plan that connects business goals to the capabilities the workforce needs — and how L&amp;D will build them.</p>`},
  {h:"Operating model questions",b:`<ul><li>Centralised, decentralised, or hybrid delivery?</li><li>Build vs buy vs curate content?</li><li>How is L&amp;D governed, prioritised and funded?</li><li>Which capabilities are business-critical?</li></ul>`},
  {h:"From department to function",b:`<div class="callout">Old question: "How many trainings did we run?" New question: "Did capability, productivity and revenue improve?"</div>`}
 ]},
{n:22,id:"succession",m:"m6",icon:"layers",title:"Succession & Talent Management",tag:"Strategy",read:6,key:"Build talent internally and ensure no critical role has a single point of failure.",
 sec:[
  {h:"Succession planning",b:`<p>Identifying and developing internal successors for critical roles before they fall vacant.</p>`},
  {h:"Build vs buy",b:`<table><tr><th>Build (internal)</th><th>Buy (hire)</th></tr><tr><td>Lower cost, better retention, faster ramp</td><td>Brings new skills quickly</td></tr></table><p>Modern organisations lean toward <b>building</b> via upskilling, reskilling and mobility.</p>`},
  {h:"9-box grid",b:`<p>A common tool plotting <b>performance</b> against <b>potential</b> to spot high-potentials and successors.</p>`}
 ]},
{n:23,id:"modern-trends",m:"m6",icon:"globe",title:"Modern L&D Trends",tag:"Future",read:6,key:"AI, skills-based orgs, microlearning, flow-of-work and data-driven learning.",
 sec:[
  {h:"Trends",b:`<table><tr><th>Trend</th><th>In a line</th></tr><tr><td>AI-powered learning</td><td>Personalised paths &amp; AI coaching</td></tr><tr><td>Skills-based orgs</td><td>Hire/promote on skills, not titles</td></tr><tr><td>Microlearning</td><td>Short focused chunks</td></tr><tr><td>Flow of work</td><td>Learn while working (Bersin)</td></tr><tr><td>Data-driven</td><td>Measure impact, not attendance</td></tr></table>`},
  {h:"The shift",b:`<div class="callout good">From <b>delivering training</b> to <b>building capability</b>, aligned directly to business outcomes.</div>`}
 ]},
{n:24,id:"gamification",m:"m6",icon:"award",title:"Gamification & Engagement",tag:"Future",read:5,key:"Game mechanics boost motivation — but only when tied to real learning.",
 sec:[
  {h:"What is it",b:`<p>Applying game mechanics — points, badges, levels, leaderboards, streaks — to drive learner motivation and completion.</p>`},
  {h:"Why it works",b:`<p>Triggers progress feeling, healthy competition and intrinsic motivation (mastery, achievement).</p>`},
  {h:"The caution",b:`<div class="callout warn">Points for their own sake fail. Mechanics must reinforce real learning behaviour, not replace it.</div>`}
 ]}
];

/* ============ EXAM BANK (scenario, medium–hard) ============
   a = index of correct option (0-3) */
export const QUIZ = [
{id:1,t:"what-is-ld",m:"m1",q:"A manager asks L&D to 'just run a one-off Excel workshop' for a team missing targets. The most L&D-minded first response is to:",opts:["Book the workshop immediately","Ask what performance gap the workshop is meant to close, and whether Excel is the real cause","Replace it with an e-learning course","Decline because it is only training, not L&D"],a:1,ex:"L&D reframes a training request around the underlying performance gap before committing — Excel may not be the real cause."},
{id:2,t:"business-acumen",m:"m1",q:"A team generated revenue of 80L on costs of 50L. Its profit is:",opts:["130L","30L","80L","Cannot tell"],a:1,ex:"Profit = Revenue − Expenses = 80 − 50 = 30L."},
{id:3,t:"business-acumen",m:"m1",q:"Which set are all customer-experience measures?",opts:["NPS, CSAT, Retention rate","Revenue, Profit, EBITDA","OKR, MBO, KPI","SCORM, xAPI, LMS"],a:0,ex:"NPS, CSAT and retention rate all gauge customer satisfaction/experience."},
{id:4,t:"tna",m:"m1",q:"Sales fell 15% last quarter. Before designing training, the strongest TNA move is to:",opts:["Survey reps on training preferences","Investigate root cause — skill, pricing, process or motivation","Benchmark competitor training","Build a sales curriculum"],a:1,ex:"TNA first asks whether training is even the right fix by diagnosing root cause; only a skill/knowledge gap warrants training."},
{id:5,t:"tna",m:"m1",q:"'The company is expanding into three new countries, so we need cross-cultural skills' is an example of which TNA level?",opts:["Individual analysis","Task analysis","Organisational analysis","Reaction analysis"],a:2,ex:"Tying needs to company strategy/goals is organisational-level TNA."},
{id:6,t:"competency",m:"m1",q:"A recruiter cites every sourcing tool perfectly but loses candidates at the offer stage. The competency gap is most likely:",opts:["Knowledge","Skill and/or behaviour","Compliance","None — it is a tooling issue"],a:1,ex:"Knowing tools is Knowledge; converting offers is a Skill/Behaviour gap (negotiation, candidate relationship)."},
{id:7,t:"andragogy",m:"m2",q:"A trainer opens with 'Today we'll cover communication skills.' Applying Knowles' 'Need to Know', a better opener is:",opts:["'This is mandatory for everyone'","'Strong communicators are far more likely to be promoted into leadership'","'There are 25 models to memorise'","'We'll start with definitions'"],a:1,ex:"'Need to Know' means leading with the benefit/relevance so adults see value before effort."},
{id:8,t:"andragogy",m:"m2",q:"Which design choice BEST reflects 'orientation to learning' for adults?",opts:["A lecture on 25 negotiation theories","A real client-rejection scenario to work through","A closed-book recall quiz","A reading list"],a:1,ex:"Adults are problem-centred — working a real scenario beats subject-centred theory."},
{id:9,t:"blooms",m:"m2",q:"'Analyze why candidates drop off in the funnel and recommend fixes' targets which Bloom levels?",opts:["Remember and Understand","Analyze and Evaluate","Only Apply","Only Create"],a:1,ex:"Breaking down the funnel is Analyze; recommending fixes is Evaluate."},
{id:10,t:"blooms",m:"m2",q:"A workshop ends with a recall quiz that everyone passes, yet job performance is unchanged. The likely reason is:",opts:["The quiz was too hard","Learning stopped at lower Bloom levels and never reached Apply/Analyze","Andragogy was over-applied","ROI was negative by design"],a:1,ex:"Recall tests Remember/Understand; without Apply and above, behaviour rarely changes."},
{id:11,t:"70-20-10",m:"m2",q:"Per 70-20-10, the largest share of capability is built through:",opts:["Formal courses","Learning from others","On-the-job experience","Reading"],a:2,ex:"70% comes from experience — real work, stretch assignments and problem-solving."},
{id:12,t:"70-20-10",m:"m2",q:"A development plan is 90% e-learning modules. The 70-20-10 critique is that it under-weights:",opts:["Compliance","Experience and social learning","Theory","Assessment"],a:1,ex:"It over-indexes on the 10% (formal) and neglects the 70% experience and 20% social learning."},
{id:13,t:"learning-culture",m:"m2",q:"The strongest signal of a healthy learning culture is:",opts:["A large course catalogue","Leaders who visibly learn, share, and protect time for development","100% compliance completion","A new LMS"],a:1,ex:"Culture is driven by leader behaviour and protected time, not catalogue size or tools."},
{id:14,t:"addie",m:"m3",q:"In ADDIE, writing learning objectives and choosing delivery methods happens in which phase?",opts:["Analysis","Design","Implementation","Evaluation"],a:1,ex:"Objectives, structure, delivery method and assessment strategy are all Design outputs."},
{id:15,t:"addie",m:"m3",q:"A team built slides and ran sessions, but never checked if performance improved. Which ADDIE phase was skipped?",opts:["Analysis","Design","Development","Evaluation"],a:3,ex:"Skipping the 'did it work?' check is missing Evaluation."},
{id:16,t:"instructional-design",m:"m3",q:"Which is the strongest (most SMART) learning objective?",opts:["Understand feedback","Be better at leadership","Conduct a feedback conversation using the SBI model in role-play with 90% of steps correct","Know about coaching"],a:2,ex:"It is specific, observable and measurable — the others are vague and untestable."},
{id:17,t:"facilitation",m:"m3",q:"Two participants dominate every discussion while others disengage. The best facilitation move is to:",opts:["Let the confident ones carry it","Use a structured technique like think-pair-share or directed questions to redistribute airtime","Switch to a lecture","End the discussion"],a:1,ex:"Good facilitators actively manage group dynamics to draw in quieter voices."},
{id:18,t:"onboarding",m:"m3",q:"A new hire finished paperwork and IT setup but feels lost on role expectations and has no peer connections. Which of the 4 Cs were neglected?",opts:["Compliance","Clarification and Connection","Culture only","All four"],a:1,ex:"Compliance was handled; Clarification (expectations) and Connection (relationships) were not."},
{id:19,t:"onboarding",m:"m3",q:"The clearest business case for investing in onboarding is its effect on:",opts:["Office costs","Early attrition and time-to-productivity","Brand advertising","Payroll tax"],a:1,ex:"Strong onboarding reduces early attrition and speeds productivity — both measurable business outcomes."},
{id:20,t:"kirkpatrick",m:"m4",q:"A programme scores 4.7/5 on feedback but managers see no change on the job. In Kirkpatrick terms:",opts:["Level 4 passed, Level 1 failed","Level 1 passed, Level 3 failed","All levels passed","Level 2 failed only"],a:1,ex:"High satisfaction is Level 1 (Reaction); no on-the-job change is a Level 3 (Behaviour) failure."},
{id:21,t:"kirkpatrick",m:"m4",q:"Pre-test 45%, post-test 88%. This evidences which Kirkpatrick level?",opts:["Level 1 Reaction","Level 2 Learning","Level 3 Behaviour","Level 4 Results"],a:1,ex:"A knowledge gain from pre to post test is Level 2 (Learning)."},
{id:22,t:"roi",m:"m4",q:"A programme costs 20L and delivers 80L in measurable benefit. ROI is:",opts:["400%","300%","75%","60%"],a:1,ex:"ROI = (80−20)/20 ×100 = 300%."},
{id:23,t:"roi",m:"m4",q:"ROI of training is most closely tied to which Kirkpatrick level?",opts:["Level 1","Level 2","Level 3","Level 4"],a:3,ex:"ROI expresses Level 4 (Results/business impact) in financial terms."},
{id:24,t:"analytics",m:"m4",q:"Shifting L&D analytics from 'attendance and completion' to 'behaviour change and business impact' mainly signals:",opts:["A move from activity metrics to outcome metrics","Cost-cutting","Less rigour","A compliance requirement"],a:0,ex:"It is a shift from measuring activity to measuring outcomes and value."},
{id:25,t:"lms",m:"m4",q:"A company wants employees to discover and self-select learning in a personalised, social, Netflix-like way. They most likely need an:",opts:["LMS","LXP","ERP","ATS"],a:1,ex:"That learner-driven, personalised discovery experience is the defining role of an LXP."},
{id:26,t:"lms",m:"m4",q:"The primary purpose of an LMS is to:",opts:["Process payroll","Deliver and track learning, and manage learners","Run recruitment campaigns","Replace the manager"],a:1,ex:"An LMS delivers/hosts learning and tracks completion, learners and certification."},
{id:27,t:"lms",m:"m4",q:"Which standard was designed to track learning experiences that happen OUTSIDE a traditional LMS?",opts:["SCORM","xAPI (Tin Can)","CSV","HTML"],a:1,ex:"xAPI tracks learning anywhere into an LRS, going beyond SCORM's LMS-bound packaging."},
{id:28,t:"performance-mgmt",m:"m5",q:"The modern view treats performance management as:",opts:["A once-a-year appraisal event","A continuous cycle of goals, feedback and development","Only a pay decision","An HR formality"],a:1,ex:"Modern performance management is continuous, not a single annual review."},
{id:29,t:"performance-mgmt",m:"m5",q:"'Objective: become a trusted talent advisor. Key results: offer-acceptance >85%, time-to-fill <30 days.' This is an example of:",opts:["MBO","OKRs","Balanced Scorecard","9-box grid"],a:1,ex:"An ambitious objective paired with measurable key results is the OKR format."},
{id:30,t:"leadership",m:"m5",q:"Adjusting your leadership style to a team member's readiness and competence on a task reflects:",opts:["Transformational leadership","Situational leadership","Transactional leadership","Laissez-faire"],a:1,ex:"Situational Leadership adapts style to follower readiness for the task."},
{id:31,t:"leadership",m:"m5",q:"The clearest distinction between leadership and management is:",opts:["Leadership controls process; management sets vision","Leadership focuses on people and vision; management focuses on process and execution","They are identical","Only seniority"],a:1,ex:"Leadership centres on people and direction; management centres on process and execution."},
{id:32,t:"coaching-mentoring",m:"m5",q:"A manager helps a recruiter fix this quarter's screening accuracy through targeted questions. This is best described as:",opts:["Mentoring","Coaching","Sponsoring","Appraising"],a:1,ex:"Short-term, performance-focused, question-led support is coaching; mentoring is longer-term career guidance."},
{id:33,t:"coaching-mentoring",m:"m5",q:"In the GROW model, exploring the current situation and obstacles is which step?",opts:["Goal","Reality","Options","Will"],a:1,ex:"Reality examines the current situation before generating Options."},
{id:34,t:"idp",m:"m5",q:"An effective Individual Development Plan (IDP) is BEST described as:",opts:["A list of courses HR assigns","A personalised roadmap linking the employee's goals to specific actions and timelines","An appraisal score","A compliance record"],a:1,ex:"An IDP is a personalised, owned plan tying aspiration to concrete development actions."},
{id:35,t:"ld-strategy",m:"m6",q:"The defining question of a mature L&D strategy is:",opts:["How many courses did we publish?","How many hours were delivered?","Did the capabilities the business needs actually improve?","How full were the sessions?"],a:2,ex:"Strategic L&D measures capability and business impact, not activity volume."},
{id:36,t:"succession",m:"m6",q:"A critical role has no internal backup if its holder leaves. The relevant L&D practice is:",opts:["Gamification","Succession planning","Microlearning","Compliance training"],a:1,ex:"Identifying and developing internal successors for critical roles is succession planning."},
{id:37,t:"succession",m:"m6",q:"The 9-box grid plots employees on which two axes?",opts:["Cost vs tenure","Performance vs potential","Age vs salary","Attendance vs scores"],a:1,ex:"The 9-box grid maps performance against potential to identify high-potentials and successors."},
{id:38,t:"modern-trends",m:"m6",q:"'Learning in the flow of work' (Josh Bersin) primarily means:",opts:["Long off-site retreats","Embedding learning into daily work at the moment of need","Mandatory annual training","Banning e-learning"],a:1,ex:"It delivers bite-sized learning within the actual workflow, when it is needed."},
{id:39,t:"gamification",m:"m6",q:"A platform adds points and badges but completion and real skill stay flat. The most likely flaw is:",opts:["Too few badges","Mechanics aren't tied to meaningful learning behaviour","The colours","Not enough leaderboards"],a:1,ex:"Gamification fails when mechanics reward activity for its own sake instead of reinforcing real learning."},
{id:40,t:"analytics",m:"m4",q:"Which is an OUTCOME metric rather than an activity metric?",opts:["Number of logins","Course completion rate","Improvement in on-the-job performance","Hours of content published"],a:2,ex:"Performance improvement is an outcome; logins, completions and hours are activity metrics."}
];
