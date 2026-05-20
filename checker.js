"use strict";

const rootSet      = new Set();
const inflectedSet = new Set();
let   allWords     = [];
let   dictReady    = false;

const FALLBACK_WORDS = [
  "நான்","நீ","அவன்","அவள்","அவர்","நாம்","நாங்கள்","நீங்கள்","அவர்கள்",
  "வீடு","கடை","பள்ளி","மரம்","பூ","நீர்","தீ","காற்று","வானம்","மழை",
  "அன்பு","நட்பு","மகிழ்ச்சி","துக்கம்","கோபம்","அமைதி","அறிவு","கல்வி",
  "உணவு","சாப்பாடு","தண்ணீர்","பால்","அரிசி","இட்லி","தோசை","சாம்பார்",
  "தாய்","தந்தை","அம்மா","அப்பா","அண்ணன்","அக்கா","தம்பி","தங்கை",
  "நண்பன்","நண்பி","ஆசிரியர்","மாணவன்","மாணவி","குழந்தை","மனைவி","கணவன்",
  "நாய்","பூனை","மாடு","யானை","சிங்கம்","புலி","மீன்","பறவை","காகம்","கிளி",
  "வந்தான்","சென்றான்","போனான்","இருந்தான்","பார்த்தான்","சாப்பிட்டான்",
  "வந்தாள்","சென்றாள்","போனாள்","இருந்தாள்","வந்தார்","சென்றார்","போனார்",
  "வருகிறான்","போகிறான்","இருக்கிறான்","படிக்கிறான்","பேசுகிறான்",
  "இன்று","நேற்று","நாளை","காலை","மாலை","இரவு","வாரம்","மாதம்","ஆண்டு",
  "இங்கே","அங்கே","எங்கே","மேலே","கீழே","உள்ளே","வெளியே","அருகில்",
  "நல்ல","கெட்ட","பெரிய","சிறிய","அழகான","வேகமான","மெதுவான","உயரமான",
  "ஆம்","இல்லை","சரி","தவறு","ஏன்","எப்படி","என்ன","யார்","எங்கே",
  "தமிழ்","மொழி","எழுத்து","சொல்","கதை","கவிதை","பாடல்","இசை","கலை",
  "வணக்கம்","நன்றி","மன்னிக்கவும்","தயவுசெய்து",
  "வீட்டில்","வீட்டிற்கு","வீட்டை","வீட்டின்","வீட்டிலிருந்து",
  "பள்ளியில்","பள்ளிக்கு","பள்ளியை","மரத்தில்","மரத்திற்கு","மரத்தை",
  "நண்பர்கள்","நண்பர்களை","மாணவர்கள்","மாணவர்களை",
  "வந்தனர்","சென்றனர்","இருந்தனர்","போனார்கள்","படித்தனர்",
  "வருகிறோம்","போகிறோம்","இருக்கிறோம்","படிக்கிறோம்",
  "ஆனால்","ஆகவே","எனவே","மேலும்","அல்லது","மற்றும்","என்று","என்பது",
  "இப்போது","அப்போது","முதலில்","இறுதியில்","சீக்கிரம்","மெதுவாக",
  "கண்","காது","மூக்கு","வாய்","கை","கால்","தலை","முகம்","வயிறு","முதுகு",
  "கண்ணில்","கண்ணை","கண்களில்","கால்கள்","கால்களில்","கைகள்","கைகளில்",
  "நகரம்","கிராமம்","மலை","ஆறு","கடல்","வயல்","காடு","குளம்","பாலம்",
  "நகரத்தில்","மலையில்","கடலில்","ஆற்றில்","காட்டில்",
  "மகிழ்ச்சியாக","நன்றாக","சரியாக","தவறாக","அழகாக","வேகமாக",
  "குடும்பம்","குடும்பத்தில்","சமூகம்","நாடு","நாட்டில்","உலகம்","உலகத்தில்", "விளையாடினோம்", 
  "சென்றேன்", "நான்", "சமையல்", "செய்கிறாள்", "தண்ணீரில்", "மீன்கள்", "நீந்துகின்றன", "பாடுகின்றன",
  "பள்ளி", "உங்கள்", "முயற்சிக்கு", "என்", "நல்வாழ்த்துக்கள்", "மிகவும்", "பறவைகள்", "நிறைய",
  "அங்கீகாரம்", "அச்சு", "அதிக", "அதிகாரப்பூர்வ", "அதிகரித்துள்ளது", "அதிவேக", "அனைத்தும்", "அமைதி", "அமோகமாக", 
  "அளித்துள்ளன", "அளித்துள்ளது", "அளிக்கின்றன", "அளவில்", "அறிவித்துள்ளது", "ஆராய்ச்சியில்", "ஆர்வத்தால்", 
  "ஆயிரக்கணக்கான", "இந்திய", "இந்தியப்", "இந்தியாவில்", "இந்தியாவின்", "இன்று", "இந்த", "இஸ்ரோ", 
  "உச்சத்தை", "உச்சத்தைப்", "உள்நாட்டு", "உயிர்களைக்", "உருவாக்கத்தை", "உலக", "உலகளாவிய", 
  "உலகின்", "ஊழியர்களின்", "எடுக்கப்பட்டன", "எட்டியுள்ளது", "எளிதாக்கியுள்ளது", "ஏஐ", "ஏற்றுமதி", 
  "ஏறுமுகத்தில்", "ஐடி", "ஐபிஓ", "ஒப்பந்தத்தில்", "ஒருமனதாக", "கம்ப்யூட்டிங்", "கண்டுபிடிப்புகளுக்கு", 
  "காணப்படுகிறது", "காப்பாற்றி", "கிளவுட்", "குவாண்டம்", "குறித்து", "குறியீட்டெண்", "கூட்டத்தொடரில்", 
  "கையெழுத்திட்டுள்ளன", "கொண்டு", "கொள்கை", "சந்தையில்", "சர்வதேச", "சாதனை", "சுகாதார", "சுற்றுச்சூழல்", 
  "சென்செக்ஸ்", "செயற்கை", "செயற்கைக்கோள்களை", "செய்தது", "செய்துள்ளது", "செலுத்தியுள்ளது", "சேவைகள்", 
  "சேவையைக்", "சேர்த்துள்ளது", "ஜி20", "ஜெனரேட்டிவ்", "ஸ்டார்ட்அப்", "தகவல்", "திகழ்கிறது", "துறைகளில்", "துறையில்", 
  "தேசிய", "தொடர்ந்து", "தொழில்நுட்ப", "தொழில்நுட்பத்", "தொழில்நுட்பம்", "ட்ரோன்கள்", "நாடுகள்", "நாடுகளின்", 
  "நாடாளுமன்றக்", "நிஃப்டி", "நிதியாண்டில்", "நிறுவனங்கள்", "நிறுவனங்களின்", "நிறுவனம்", "நிறுவனமாகத்", 
  "நலத்திட்டங்கள்", "நலனுக்கு", "நல்ல", "நீடிக்கிறது", "நுண்ணறிவுத்", "பங்குகள்", "பங்குச்சந்தை", "பங்குச்சந்தையான",
   "பங்குச்சந்தையில்", "படைத்துள்ளனர்", "பதிவு", "பயன்பாடு", "பல", "பாதுகாப்புத்", "பாதுகாப்பிற்காகப்", "பாராட்டுகளைப்", 
   "புதிய", "பெருகி", "பெரும்", "பெருமளவு", "பெற்றுள்ளன", "பெற்றுள்ளது", "பொருளாதாரம்", "பொருளாதாரமாகத்", 
   "பொறியாளர்களுக்கு", "மக்கள்", "மற்றும்", "மருத்துவக்", "மருத்துவத்", "மாபெரும்", "மாநாட்டில்", "மிக", "மிகவும்",
    "மின்சார", "முக்கிய", "முக்கியத்துவம்", "முடிவுகள்", "முதலீட்டாளர்களுக்கு", "முதலீட்டாளர்களின்", "முதலீடுகளைச்", 
    "முப்பரிமாண", "முன்னணி", "முன்னேற்றம்", "மென்பொருள்", "மென்பொறியாளர்கள்", "மும்பை", "ரோபோக்களின்", 
    "வர்த்தகம்", "வர்த்தகமாகி", "வருகிறது", "வருகின்றன", "வரலாற்று", "வளரும்", "வாகனங்களின்", "விற்பனை", "விண்வெளி", "விண்ணில்", 
  "விவசாயத்", "வேகமாக", "வேலைவாய்ப்புகள்", "வேலைவாய்ப்புகளை", "வெளியீடுகள்", "வெளியுறவுக்", "வெற்றிகரமாக", "டிசிஎஸ்", "வரவேற்பைப்", "லாபத்தை", 
  "கிராமப்புறங்களுக்கு", "கிராமப்புறங்களுக்கும்", "இணைய", "சைபர்", "நிறைவேற்றப்பட்டன"
];

const SAMPLES = [
  "உங்கள் முயற்ச்சிக்கு என் நள்வாழ்த்துக்கள்!",
  "தண்ணீரில் மீன்கள் நீந்துகின்றன. மலையில் asdf பறவைகள் பாடுகின்றன.",
  "நான் பள்லி சென்றேன். அங்கே நிரைய நண்பர்கல் இருந்தனர். நாங்கள் மகிழ்சியாக விளாயாடினோம்."
];

// ── Clipboard (Clippy) - Simplified ───────────────────────────────────────────
function copyText() {
  const ta = document.getElementById("input-text");
  
  if (!ta.value.trim()) return;

  // Silently copy to clipboard with no UI gimmicks
  navigator.clipboard.writeText(ta.value).catch(function(err) {
    console.error("Failed to copy text: ", err);
  });
}

// ── I'm Feeling Lucky (Current Affairs & IT Trends) ───────────────────────────
const luckySentences = [
  // TCS & Corporate IT News
  "டிசிஎஸ் நிறுவனம் செயற்கை நுண்ணறிவுத் துறையில் மாபெரும் முதலீடுகளைச் செய்துளது.",
  "தகவல் தொழில்நுட்பத் துறையில் டிசிஎஸ் தொடர்ந்து முன்னணி நிறுவனமாகத் திகழ்கிறது.",
  "டிசிஎஸ் நிறுவனம் ஆயிரக்கணக்கான புதிய பொறியாளர்களுக்கு வேலைவாய்ப்புகளை அறிவித்துள்ளது.",
  "டிசிஎஸ் மென்பொருள் சேவைகள் உலகலாவிய சந்தையில் அதிக வரவேற்பைப் பெற்றுள்ளன.",
  
  // Positive IT Trends & Technology
  "கிளவுட் கம்ப்யூட்டிங் மற்றும் சைபர் பாதுகாப்புத் துறைகளில் புதிய வேலைவாய்ப்புகள் பெருகி வருகின்றன.",
  "ஜெனரேட்டிவ் ஏஐ (Generative AI) தொழில்நுட்பம் மென்பொருள் உருவாக்கத்தை மிகவும் எளிதாக்கியுள்ளது.",
  "தகவல் தொழில்நுட்ப நிறுவனங்கள் ஊழியர்களின் நலனுக்கு அதிக முக்கியதுவம் அளிக்கின்றன.",
  "குவாண்டம் கம்ப்யூட்டிங் ஆராய்ச்சியில் இந்திய மென்பொறியாளர்கள் பெரும் சாதனை படைத்துள்ளனர்.",
  "இந்தியாவின் ஐடி ஏற்றுமதி இந்த நிதியாண்டில் புதிய உச்சத்தை எட்டியுள்ளது.",
  
  // Broader Technology & Engineering
  "விவசாயத் துறையில் ட்ரோன்கள் மற்றும் ரோபோகளின் பயன்பாடு அமோகமாக அதிகரித்துள்ளது.",
  "முப்பரிமாண அச்சு (3D Printing) தொழில்நுட்பம் மருத்துவத் துறையில் பல உயிர்களைக் காப்பாற்றி வருகிறது.",
  "விண்வெளி ஆராய்ச்சியில் இஸ்ரோ புதிய செயற்கைக்கோள்களை வெற்றிகரமாக விண்ணில் செலுத்தியுள்ளது.",
  "மின்சார வாகனங்களின் (EV) விற்பனை இந்தியாவில் பெருமளவு அதிகரித்துள்ளது.",
  "5G தொழில்நுட்பம் கிராமபுறங்களுக்கும் அதிவேக இணைய சேவையைக் கொண்டு சேர்த்துள்ளது.",
  
  // India Share Market News
  "மும்பை பங்குச்சந்தை குறியீட்டென் சென்செக்ஸ் இன்று புதிய வரலாற்று உச்சத்தைப் பதிவு செய்தது.",
  "தகவல் தொழில்நுட்ப நிறுவனங்களின் பங்குகள் முதலீட்டாளர்களுக்கு நல்ல லாபத்தை அளித்துள்ளன.",
  "தேசிய பங்குச்சந்தையான நிஃப்டி தொடர்ந்து ஏறுமுகத்தில் வர்த்தகமாகி வருகிறது.",
  "உள்நாட்டு முதலீட்டாளர்களின் அதிக ஆர்வத்தால் பங்குச்சந்தையில் பெரும் முன்னேற்றம் காணப்படுகிறது.",
  "ஸ்டார்ட்அப் நிறுவனங்களின் ஐபிஓ (IPO) வெளியீடுகள் சந்தையில் பெரும் வரவேற்பைப் பெற்றுள்ளன.",
  
  // World News & Politics (Positive/Neutral)
  "உலக நாடுகள் அனைத்தும் சுற்றுச்சூழல் பாதுகாப்பிற்காகப் புதிய ஒப்பந்தத்தில் கையெழுத்திட்டுள்ளன.",
  "இந்தியப் பொருளாதாரம் உலகின் மிக வேகமாக வளரும் பொருளாதாரமாகத் தொடர்ந்து நீடிக்கிறது.",
  "ஜி20 மாநாட்டில் உலகளாவிய வர்த்தகம் மற்றும் அமைதி குறித்து முக்கிய முடிவுகள் எடுக்கப்பட்டன.",
  "சர்வதேச அளவில் இந்தியாவின் வெளியுறவுக் கொள்கை பல நாடுகளின் பாராட்டுகளைப் பெற்றுள்ளது.",
  "புதிய நாடாளுமன்றக் கூட்டதொடரில் பல மக்கள் நலத்திட்டங்கள் ஒருமனதாக நிறைவேற்றப்பட்டன.",
  "உலக சுகாதார நிறுவனம் பல புதிய மருத்துவக் கண்டுபிடிப்புகளுக்கு அதிகாரப்பூர்வ அங்கீகாரம் அளித்துள்ளது."
];

function loadLuckySample() {
  // Grab a purely random index from 0 to 24
  const randomIndex = Math.floor(Math.random() * luckySentences.length);

  // Load the text and run the checker
  document.getElementById("input-text").value = luckySentences[randomIndex];
  onInput();
  setTimeout(runCheck, 100);
}



// ── Load dictionaries ─────────────────────────────────────────────────────────
async function loadDictionaries() {
  updateStatus("அகராதி ஏற்றப்படுகிறது... / Loading dictionaries...");

  let rootLoaded = false;
  let inflLoaded = false;

  try {
    const resp = await fetch("dictionary_root_1.txt");
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const text = await resp.text();
    text.split("\n").forEach(line => {
      const w = line.trim().normalize("NFC");
      if (w.length > 0) rootSet.add(w);
    });
    rootLoaded = true;
  } catch (e) {
    console.warn("dictionary_root.txt failed to load:", e.message);
  }

  try {
    const resp = await fetch("dictionary_inflected_1.txt");
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const text = await resp.text();
    text.split("\n").forEach(line => {
      const w = line.trim().normalize("NFC");
      if (w.length > 0) inflectedSet.add(w);
    });
    inflLoaded = true;
  } catch (e) {
    console.warn("dictionary_inflected.txt failed to load:", e.message);
  }

  // If root failed, use fallback
  if (!rootLoaded) {
    FALLBACK_WORDS.forEach(w => rootSet.add(w.normalize("NFC")));
  }

  // Build combined word array for edit distance
  rootSet.forEach(w => allWords.push(w));
  inflectedSet.forEach(w => { if (!rootSet.has(w)) allWords.push(w); });

  dictReady = true;
  document.getElementById("check-btn").disabled = false;

  const total = allWords.length;

document.getElementById("dict-info").innerHTML =
    "Words Loaded:<br><b>" + total.toLocaleString() + "</b>";

  if (rootLoaded && inflLoaded) {
    updateStatus("Ready — " + total.toLocaleString() + " words loaded");
  } else if (rootLoaded) {
    updateStatus("Ready — " + rootSet.size.toLocaleString() + " root words (no inflected dict)");
  } else {
    updateStatus("Using fallback dictionary — upload .txt files to Netlify for full check");
  }
}

function updateStatus(msg) {
  const el = document.getElementById("dict-status");
  if (el) el.textContent = msg;
}

// ── Tokenizer ─────────────────────────────────────────────────────────────────
function tokenize(text) {
  const tokens = [];
  const parts  = text.split(/(\s+)/);

  parts.forEach(part => {
    if (!part) return;
    if (/^\s+$/.test(part)) { tokens.push({ text: part, isSpace: true }); return; }

    const stripped = part
      .replace(/^[.,!?।॥"""''()\[\]{}<>:;\/\\—\-]+/, "")
      .replace(/[.,!?।॥"""''()\[\]{}<>:;\/\\—\-]+$/, "");

    const leadLen  = part.length - part.replace(/^[.,!?।॥"""''()\[\]{}<>:;\/\\—\-]+/, "").length;
    const trailLen = part.length - part.replace(/[.,!?।॥"""''()\[\]{}<>:;\/\\—\-]+$/, "").length;

    if (leadLen > 0)  tokens.push({ text: part.slice(0, leadLen), isPunct: true });
    if (stripped)     tokens.push({ text: stripped, isWord: true,
                        skip: /^[\d]+$/.test(stripped) || /^[a-zA-Z0-9]+$/.test(stripped) });
    if (trailLen > 0) tokens.push({ text: part.slice(part.length - trailLen), isPunct: true });
  });

  return tokens;
}

// ── Lookup ────────────────────────────────────────────────────────────────────
function lookup(word) {
  const n = word.normalize("NFC");
  // Simply check if the word exists in either dictionary
  if (rootSet.has(n) || inflectedSet.has(n)) return "correct";
  return "error";
}

// ── Edit distance ─────────────────────────────────────────────────────────────
function editDistance(a, b) {
  const m = a.length, n = b.length;
  if (Math.abs(m - n) > 3) return 99;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 1; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]);
  return dp[m][n];
}

function getSuggestions(word, maxDist, topN) {
  maxDist = maxDist || 2;
  topN    = topN    || 3;
  const norm      = word.normalize("NFC");
  const firstChar = norm[0] || "";
  const candidates = allWords.filter(w =>
    w[0] === firstChar && Math.abs(w.length - norm.length) <= maxDist
  );
  const scored = [];
  for (var i = 0; i < candidates.length; i++) {
    var d = editDistance(norm, candidates[i]);
    if (d > 0 && d <= maxDist) scored.push([candidates[i], d]);
  }
  scored.sort(function(a, b) { return a[1] - b[1]; });
  return scored.slice(0, topN).map(function(x) { return x[0]; });
}

// ── Main check ────────────────────────────────────────────────────────────────
function runCheck() {
  if (!dictReady) return;
  const raw = document.getElementById("input-text").value;
  if (!raw.trim()) { alert("தயவுசெய்து உரையை உள்ளிடுக / Please enter some text."); return; }

  const tokens   = tokenize(raw);
  const wordToks = tokens.filter(function(t) { return t.isWord; });
  var errors = 0, corrects = 0, skips = 0;

  wordToks.forEach(function(t) {
    if (t.skip) { skips++; t.status = "skip"; return; }
    
    t.status = lookup(t.text);
    if (t.status === "correct") {
      corrects++;
    } else {
      errors++; 
      t.suggestions = getSuggestions(t.text); 
    }
  });

  renderResults(wordToks, errors, corrects, skips);
}


// ── Render ────────────────────────────────────────────────────────────────────
function renderResults(wordToks, errors, corrects, skips) {
  var resultsDiv = document.getElementById("results");
  var summary    = document.getElementById("summary");
  var tbody      = document.getElementById("tbody");

  resultsDiv.style.display = "block";
  tbody.innerHTML = "";

  var checked = wordToks.length - skips;

  if (errors === 0) {
    summary.style.cssText = "background:#f0fff4;border:1px solid #9ae6b4;color:green;font-size:13px;padding:6px 8px;margin-bottom:8px;";
    summary.textContent = "All " + checked + " checked word(s) correct.";
  } else {
    summary.style.cssText = "background:#fff5f5;border:1px solid #fc8181;color:red;font-size:13px;padding:6px 8px;margin-bottom:8px;";
    summary.textContent = errors + " error(s) found in " + checked + " word(s).";
  }

  wordToks.forEach(function(t, i) {
    var tr  = document.createElement("tr");
    var tdI = document.createElement("td");
    var tdW = document.createElement("td");
    var tdS = document.createElement("td");
    var tdG = document.createElement("td");

    tdI.style.cssText   = "color:#999;text-align:center;border:1px solid #ddd;padding:5px 8px;";
    tdI.textContent     = i + 1;

    tdW.style.cssText   = "border:1px solid #ddd;padding:5px 8px;font-family:'Noto Sans Tamil',Arial,sans-serif;";
    tdW.textContent     = t.text;
    
    // Apply unified styling for words
    if (t.status === "error") { 
        tdW.style.color = "red"; 
        tdW.style.fontWeight = "bold"; 
    } else if (t.status === "correct") { 
        tdW.style.color = "green"; 
    }

    tdS.style.cssText   = "border:1px solid #ddd;padding:5px 8px;font-size:12px;";
    
    // Apply unified styling for the status text
    if (t.status === "correct") { 
        tdS.textContent = "Correct"; 
        tdS.style.color = "green"; 
    } else if (t.status === "skip") { 
        tdS.textContent = "Skipped";   
        tdS.style.color = "#aaa"; 
    } else { 
        tdS.textContent = "Error";     
        tdS.style.color = "red"; 
    }

    tdG.style.cssText = "border:1px solid #ddd;padding:5px 8px;";
    if (t.status === "error") {
      if (!t.suggestions || t.suggestions.length === 0) {
        tdG.innerHTML = "<span style='color:#aaa;font-size:12px;'>No suggestion</span>";
      } else {
        t.suggestions.forEach(function(s) {
          var sp   = document.createElement("span");
          sp.className = "sugg";
          sp.textContent = s;
          sp.title = "Click to replace";
          sp.onclick = (function(orig, repl) {
            return function() { replaceWord(orig, repl); };
          })(t.text, s);
          tdG.appendChild(sp);
        });
      }
    } else {
      tdG.innerHTML = "<span style='color:#ccc;'>—</span>";
    }

    tr.appendChild(tdI);
    tr.appendChild(tdW);
    tr.appendChild(tdS);
    tr.appendChild(tdG);
    tbody.appendChild(tr);
  });
}


// ── Replace ───────────────────────────────────────────────────────────────────
function replaceWord(original, replacement) {
  var ta  = document.getElementById("input-text");
  var idx = ta.value.indexOf(original);
  if (idx === -1) return;
  ta.value = ta.value.slice(0, idx) + replacement + ta.value.slice(idx + original.length);
  onInput();
  runCheck();
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function onInput() {
  var val = document.getElementById("input-text").value;
  document.getElementById("charcount").textContent = val.length + " characters";
  document.getElementById("results").style.display = "none";
}

function clearAll() {
  document.getElementById("input-text").value = "";
  document.getElementById("results").style.display = "none";
  document.getElementById("charcount").textContent = "0 characters";
}

function loadSample(i) {
  document.getElementById("input-text").value = SAMPLES[i];
  onInput();
  setTimeout(runCheck, 100);
}

document.addEventListener("keydown", function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    if (!document.getElementById("check-btn").disabled) runCheck();
  }
});

document.addEventListener("DOMContentLoaded", function() {
  var ta = document.getElementById("input-text");
  if (ta) ta.addEventListener("input", onInput);
});

window.addEventListener("load", loadDictionaries);

// ── Open Live News Popup ──────────────────────────────────────────────────────
function openNewsPopup() {
  // Define the size of the popup box
  const width = 800;
  const height = 600;
  
  // Calculate the center of the screen
  const left = (window.innerWidth / 2) - (width / 2);
  const top = (window.innerHeight / 2) - (height / 2);
  
  // Open Dinamalar in a new floating window with no toolbars
  window.open(
    'https://www.dinamalar.com', 
    'LiveTamilNews', 
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes,toolbar=no,location=no,status=no,menubar=no`
  );
}
