/* farm.js — module: farm management, diagnosis, compost. Uses globals of index.html */
(function(){
'use strict';
const T={
ar:{nav:['🏠 حقل واحد','🚜 المزرعة','🔍 التشخيص','♻️ الكومبوست'],
clim:'المناخ الحالي',setClim:'ضبط الموقع والمناخ',wx:'🌦 تحديث الطقس',noLoc:'لم يُحدَّد الموقع بعد: اضغط «ضبط الموقع والمناخ». سيُستخدم مناخ افتراضي حسب الفصل.',
tot:'مساحة المزرعة الكلية (م²)',res:'نسبة المسالك والخطوط (%)',split:'⚖️ قسّم المساحات تلقائياً',
addH:'إضافة قطعة (صنف)',name:'اسم القطعة',crop:'الصنف',area:'المساحة (م²)',env:'النوع',gh:'بيت محمي',op:'حقل مفتوح',irr:'الري',drip:'تنقيط',spr:'رش',flood:'غمر',sow:'تاريخ البذر',add:'➕ إضافة',
sum:'ملخص المزرعة',plots:n=>n+' قطعة',used:'المخصص',free:'المتبقي',over:'تجاوزت المساحة الكلية!',wtot:'مياه اليوم للمزرعة',lday:'لتر/يوم',
harv:'الحصاد القادم',none:'لا توجد قطع بعد. أضف أول صنف.',
day:(a,b)=>`اليوم ${a} من ${b}`,wToday:'ماء اليوم',perm:'لتر/م²',tl:'لتر للقطعة',adj:'بعد تعديل الطقس',
yld:'الإنتاج المتوقع',kg:'كغ',hd:'موعد الحصاد',fert:'التسميد الآن',rot:'الدورة القادمة المقترحة',
logH:'سجل العمل',logT:['💧 ري','🧪 تسميد','🧴 رش','✂️ عناية','🧺 حصاد'],logQ:'ملاحظة أو كمية',logAdd:'حفظ',
edit:'تعديل',del:'حذف',diag:'🔍 تشخيص',conf:'حذف هذه القطعة؟',
cold:'🥶 طقس بارد: قلّل الري، اسقِ وسط النهار، ولا تترك الأرض مبللة ليلاً.',
heat:'🔥 موجة حر: ارفع الكمية وقسّمها على دفعتين (فجراً وعصراً)، وغطِّ التربة بالمهاد.',
frost:'❄️ خطر صقيع/برد شديد على هذا الصنف: غطِّ النباتات، واسقِ بعد الظهر لا ليلاً.',
hot2:'⚠️ الحرارة فوق تحمّل الصنف: ظلّل وافتح التهوية.',
ghN:'البيت المحمي: تبخر أقل (≈25%) لكن رطوبة أعلى وخطر فطريات؛ اسقِ بنبضات قصيرة صباحاً وأغلق ليلاً في البرد.',
opN:'الحقل المفتوح: التبخر أعلى مع الريح والحر؛ استعمل المهاد واسقِ فجراً.',
fcast:(x,n)=>`توقع الأيام القادمة: عظمى ${x}° / صغرى ${n}°`,
dH:'تشخيص من صورة وأعراض',plot:'القطعة',noPlot:'بدون قطعة (صنف عام)',cam:'📷 تصوير',pick:'🖼 من المعرض',
dNote:'للدقة: صوّر ورقة واحدة قريبة على خلفية سادة وضوء النهار. التحليل لوني تقريبي ولا يغني عن الأعراض أدناه.',
pctQ:'نسبة النباتات المصابة',pcts:['أقل من 10%','10–30%','30–60%','أكثر من 60%'],spQ:'سرعة الانتشار',sps:['ثابت','بطيء (أسبوع)','سريع (أيام)'],
sy:'الأعراض (اختر ما تراه)',run:'تحليل الحالة',ph:'تحليل الصورة',
pGreen:'أخضر سليم',pYel:'أصفر',pBrn:'بني/نخر',pWht:'بقع بيضاء/رمادية',pPur:'أرجواني/أحمر',spots:n=>`عدد بؤر البقع: ${n}`,
cand:'احتمالات من الصورة (أكّدها بالأعراض)',sev:'درجة الخطورة',grades:['منخفضة','متوسطة','عالية','حرجة'],
treat:'العلاج',plan:'خطة المكافحة',planT:(n,i,a)=>`${n} مرات، كل ${i} يوماً، مع المناوبة بين: ${a}`,planN:(n,i)=>`${n} مرات، كل ${i} يوماً`,
phiW:(p,d)=>`⚠️ مدة الأمان ${p} يوماً بينما الحصاد بعد ${d} يوماً: اختر مادة بيولوجية أو أجّل الحصاد.`,
crit:'🚨 حالة حرجة: أزل النباتات المصابة بشدة وأحرقها أو ادفنها، واعزل القطعة، واستشر مهندساً زراعياً.',
nutX:'للنقص الغذائي: تحقق من EC وpH والصرف قبل زيادة السماد، ثم أعد التحليل بعد 7 أيام.',
saveL:'حفظ في سجل القطعة',icsB:'📅 تذكيرات خطة المكافحة (.ics)',saved:'تم الحفظ',
noSel:'اختر عرضاً واحداً على الأقل أو أضف صورة.',
dis:'هذا تشخيص إرشادي وليس ذكاءً اصطناعياً للتعرف على الصور. تأكد بالفحص الحقلي أو التحليل المخبري، والتزم بملصق المنتج والتسجيل المحلي.',
cH:'برنامج إنتاج الكومبوست',cNeed:'حساب الحاجة من المزرعة',cT:'الكمية المطلوبة من الكومبوست الناضج (كغ)',cB:'المادة الجافة (كربونية)',cG:'المادة الخضراء/الروث (نيتروجينية)',cS:'تاريخ البدء',cGo:'احسب البرنامج',
cNeedR:(t,r)=>`حاجة المزرعة التقريبية: ${t} كغ (≈ ${r} كغ/م² حسب الصنف والتربة).`,
cRes:'الوصفة',cMix:(b,g,w,m)=>`ابدأ بـ ${m} كغ مواد: ${b} كغ جافة + ${g} كغ خضراء، وأضف نحو ${w} لتر ماء.`,
cCN:v=>`النسبة C:N المستهدفة ≈ 28 (محسوبة: ${v}).`,
cPile:(l,w,h)=>`الكومة: طول ${l} م × عرض ${w} م × ارتفاع ${h} م. غطِّها بالقش أو الخيش لتقليل التبخر في الحر.`,
cBad:'هذه المادة الخضراء ليست غنية بالنيتروجين بما يكفي أو الجافة ليست كربونية: اختر روثاً أو بقايا خضراء مع قش أو سعف مفروم.',
cOut:(k)=>`الناتج المتوقع ≈ ${k} كغ كومبوست ناضج.`,
cSch:'جدول التقليب والمتابعة',
cSteps:[['بناء الكومة طبقات (جاف/أخضر) مع ترطيب كل طبقة','رطوبة 50–60%: قبضة مبللة لا تقطر'],['تقليب أول وقياس الحرارة','المطلوب 55–65°م'],['تقليب','أضف ماء إن جفت'],['تقليب','الحرارة تبدأ بالهبوط'],['تقليب','قوام يتفتت'],['تقليب وفحص النضج','لون داكن ورائحة تراب'],['جاهز تقريباً: اتركه ينضج دون تقليب','اختبار إنبات حبوب الرشاد']],
cTips:['لا تضف لحوماً أو ألباناً أو زيوتاً أو نباتات مريضة.','فوق 65°م قلّب وبلّل؛ تحت 40°م أضف مواد خضراء وقلّب.','الروث الطازج: اتركه 55°م لثلاثة أيام على الأقل قبل الاستعمال، ولا تضعه على الخضروات الورقية قرب الحصاد.','المواد الرقمية تقريبية؛ اعتمد اختبار القبضة والرائحة.'],
cIcs:'📅 تذكيرات التقليب (.ics)',cUse:'طريقة الاستعمال: انثر الكومبوست على المساحة قبل البذر وامزجه بالتربة.',
m:{straw:'قش/تبن',palm:'سعف نخيل مفروم',leaf:'أوراق جافة',card:'كرتون/ورق',saw:'نشارة خشب',goat:'روث غنم/ماعز',camel:'روث إبل',cow:'روث بقر',poul:'زرق دواجن',kit:'بقايا مطبخ',gre:'بقايا خضراء/عشب طازج',dat:'مخلفات تمر وفاكهة'},
days:'يوم',m2:'م²'},
fr:{nav:['🏠 Parcelle seule','🚜 Ferme','🔍 Diagnostic','♻️ Compost'],
clim:'Climat actuel',setClim:'Régler lieu et climat',wx:'🌦 Actualiser la météo',noLoc:'Lieu non défini : appuyez sur « Régler lieu et climat ». Un climat par défaut selon la saison sera utilisé.',
tot:'Surface totale de la ferme (m²)',res:'Part des allées et conduites (%)',split:'⚖️ Répartir les surfaces automatiquement',
addH:'Ajouter une parcelle (culture)',name:'Nom de la parcelle',crop:'Culture',area:'Surface (m²)',env:'Type',gh:'Serre',op:'Plein champ',irr:'Irrigation',drip:'Goutte-à-goutte',spr:'Aspersion',flood:'Gravitaire',sow:'Date de semis',add:'➕ Ajouter',
sum:'Résumé de la ferme',plots:n=>n+' parcelle(s)',used:'Attribué',free:'Reste',over:'Surface totale dépassée !',wtot:'Eau du jour pour la ferme',lday:'L/jour',
harv:'Prochaines récoltes',none:'Aucune parcelle. Ajoutez la première culture.',
day:(a,b)=>`Jour ${a} sur ${b}`,wToday:'Eau du jour',perm:'L/m²',tl:'L pour la parcelle',adj:'ajustée à la météo',
yld:'Rendement attendu',kg:'kg',hd:'Date de récolte',fert:'Engrais maintenant',rot:'Rotation suivante conseillée',
logH:'Journal de travail',logT:['💧 Irrigation','🧪 Engrais','🧴 Traitement','✂️ Entretien','🧺 Récolte'],logQ:'Note ou quantité',logAdd:'Enregistrer',
edit:'Modifier',del:'Supprimer',diag:'🔍 Diagnostic',conf:'Supprimer cette parcelle ?',
cold:'🥶 Temps froid : réduisez l’eau, irriguez en milieu de journée, évitez le sol détrempé la nuit.',
heat:'🔥 Canicule : augmentez la dose en deux apports (aube et fin d’après-midi) et paillez.',
frost:'❄️ Risque de gel/froid pour cette culture : couvrez, irriguez l’après-midi, pas la nuit.',
hot2:'⚠️ Chaleur au-dessus de la tolérance : ombrez et aérez.',
ghN:'Serre : évaporation réduite (≈25 %) mais humidité et risque de maladies plus élevés ; irriguez en impulsions courtes le matin, fermez la nuit s’il fait froid.',
opN:'Plein champ : évaporation plus forte (vent, chaleur) ; paillez et irriguez à l’aube.',
fcast:(x,n)=>`Prévision : max ${x}° / min ${n}°`,
dH:'Diagnostic par photo et symptômes',plot:'Parcelle',noPlot:'Sans parcelle (culture générique)',cam:'📷 Photo',pick:'🖼 Galerie',
dNote:'Pour plus de précision : une seule feuille de près, fond uni, lumière du jour. L’analyse couleur est approximative et ne remplace pas les symptômes ci-dessous.',
pctQ:'Part des plants atteints',pcts:['Moins de 10 %','10–30 %','30–60 %','Plus de 60 %'],spQ:'Vitesse de propagation',sps:['Stable','Lente (semaine)','Rapide (jours)'],
sy:'Symptômes (cochez ce que vous voyez)',run:'Analyser le cas',ph:'Analyse de la photo',
pGreen:'Vert sain',pYel:'Jaune',pBrn:'Brun/nécrose',pWht:'Taches blanches/grises',pPur:'Violet/rouge',spots:n=>`Foyers de taches : ${n}`,
cand:'Pistes selon la photo (à confirmer par les symptômes)',sev:'Niveau de gravité',grades:['Faible','Moyen','Élevé','Critique'],
treat:'Traitement',plan:'Plan de lutte',planT:(n,i,a)=>`${n} applications, tous les ${i} jours, en alternant : ${a}`,planN:(n,i)=>`${n} applications, tous les ${i} jours`,
phiW:(p,d)=>`⚠️ Délai avant récolte ${p} j alors que la récolte est dans ${d} j : choisissez un produit biologique ou reportez.`,
crit:'🚨 Cas critique : arrachez et détruisez les plants très atteints, isolez la parcelle, consultez un agronome.',
nutX:'Carence : vérifiez EC, pH et drainage avant d’ajouter de l’engrais, puis réévaluez après 7 jours.',
saveL:'Enregistrer au journal de la parcelle',icsB:'📅 Rappels du plan de lutte (.ics)',saved:'Enregistré',
noSel:'Cochez au moins un symptôme ou ajoutez une photo.',
dis:'Diagnostic indicatif, pas une reconnaissance d’image par IA. Confirmez au champ ou en laboratoire et suivez l’étiquette du produit et l’homologation locale.',
cH:'Programme de production de compost',cNeed:'Calculer le besoin de la ferme',cT:'Compost mûr souhaité (kg)',cB:'Matière sèche (carbonée)',cG:'Matière verte/fumier (azotée)',cS:'Date de départ',cGo:'Calculer le programme',
cNeedR:(t,r)=>`Besoin approximatif de la ferme : ${t} kg (≈ ${r} kg/m² selon culture et sol).`,
cRes:'Recette',cMix:(b,g,w,m)=>`Démarrez avec ${m} kg de matières : ${b} kg sèches + ${g} kg vertes, et ajoutez environ ${w} L d’eau.`,
cCN:v=>`C/N visé ≈ 28 (calculé : ${v}).`,
cPile:(l,w,h)=>`Tas : longueur ${l} m × largeur ${w} m × hauteur ${h} m. Couvrez de paille ou de jute pour limiter l’évaporation.`,
cBad:'Ces matières ne permettent pas d’atteindre le bon C/N : choisissez un fumier ou des résidus verts avec de la paille ou des palmes broyées.',
cOut:k=>`Production attendue ≈ ${k} kg de compost mûr.`,
cSch:'Calendrier de retournement et suivi',
cSteps:[['Monter le tas en couches (sec/vert), humidifier chaque couche','Humidité 50–60 % : poignée humide qui ne goutte pas'],['Premier retournement, mesurer la température','Viser 55–65 °C'],['Retourner','Ajouter de l’eau si sec'],['Retourner','La température commence à baisser'],['Retourner','Texture qui s’émiette'],['Retourner et tester la maturité','Couleur sombre, odeur de terre'],['Presque prêt : laisser mûrir sans retourner','Test de germination du cresson']],
cTips:['Pas de viande, produits laitiers, huiles ni plantes malades.','Au-dessus de 65 °C retournez et arrosez ; sous 40 °C ajoutez du vert et retournez.','Fumier frais : 55 °C au moins 3 jours avant usage, pas sur les légumes feuilles près de la récolte.','Valeurs approximatives ; fiez-vous au test de la poignée et à l’odeur.'],
cIcs:'📅 Rappels de retournement (.ics)',cUse:'Utilisation : épandre sur la surface avant le semis et incorporer au sol.',
m:{straw:'Paille/foin',palm:'Palmes broyées',leaf:'Feuilles sèches',card:'Carton/papier',saw:'Sciure',goat:'Fumier ovin/caprin',camel:'Crottes de dromadaire',cow:'Fumier bovin',poul:'Fiente de volaille',kit:'Déchets de cuisine',gre:'Résidus verts/herbe fraîche',dat:'Déchets de dattes et fruits'},
days:'j',m2:'m²'},
en:{nav:['🏠 Single plot','🚜 Farm','🔍 Diagnosis','♻️ Compost'],
clim:'Current climate',setClim:'Set location and climate',wx:'🌦 Refresh weather',noLoc:'No location yet: tap “Set location and climate”. A default seasonal climate will be used.',
tot:'Total farm area (m²)',res:'Paths and lines share (%)',split:'⚖️ Split areas automatically',
addH:'Add a plot (crop)',name:'Plot name',crop:'Crop',area:'Area (m²)',env:'Type',gh:'Greenhouse',op:'Open field',irr:'Irrigation',drip:'Drip',spr:'Sprinkler',flood:'Flood',sow:'Sowing date',add:'➕ Add',
sum:'Farm summary',plots:n=>n+' plot(s)',used:'Allocated',free:'Remaining',over:'Total area exceeded!',wtot:'Farm water today',lday:'L/day',
harv:'Upcoming harvests',none:'No plots yet. Add your first crop.',
day:(a,b)=>`Day ${a} of ${b}`,wToday:'Water today',perm:'L/m²',tl:'L for the plot',adj:'weather-adjusted',
yld:'Expected yield',kg:'kg',hd:'Harvest date',fert:'Fertilizer now',rot:'Suggested next rotation',
logH:'Work log',logT:['💧 Irrigation','🧪 Fertilizing','🧴 Spraying','✂️ Care','🧺 Harvest'],logQ:'Note or quantity',logAdd:'Save',
edit:'Edit',del:'Delete',diag:'🔍 Diagnose',conf:'Delete this plot?',
cold:'🥶 Cold spell: cut water, irrigate midday, avoid soggy soil at night.',
heat:'🔥 Heat wave: raise the amount in two doses (dawn and late afternoon) and mulch.',
frost:'❄️ Frost/cold risk for this crop: cover plants, irrigate in the afternoon, not at night.',
hot2:'⚠️ Heat above crop tolerance: shade and ventilate.',
ghN:'Greenhouse: ~25% less evaporation but higher humidity and disease risk; irrigate in short morning pulses, close at night when cold.',
opN:'Open field: higher evaporation with wind and heat; mulch and irrigate at dawn.',
fcast:(x,n)=>`Forecast: max ${x}° / min ${n}°`,
dH:'Diagnosis from photo and symptoms',plot:'Plot',noPlot:'No plot (generic crop)',cam:'📷 Camera',pick:'🖼 Gallery',
dNote:'For accuracy: one close leaf, plain background, daylight. Colour analysis is approximate and does not replace the symptoms below.',
pctQ:'Share of plants affected',pcts:['Under 10%','10–30%','30–60%','Over 60%'],spQ:'Spread speed',sps:['Stable','Slow (a week)','Fast (days)'],
sy:'Symptoms (tick what you see)',run:'Analyse the case',ph:'Photo analysis',
pGreen:'Healthy green',pYel:'Yellow',pBrn:'Brown/necrosis',pWht:'White/grey spots',pPur:'Purple/red',spots:n=>`Spot clusters: ${n}`,
cand:'Leads from the photo (confirm with symptoms)',sev:'Severity',grades:['Low','Moderate','High','Critical'],
treat:'Treatment',plan:'Control plan',planT:(n,i,a)=>`${n} applications, every ${i} days, alternating: ${a}`,planN:(n,i)=>`${n} applications, every ${i} days`,
phiW:(p,d)=>`⚠️ Pre-harvest interval is ${p} days but harvest is in ${d} days: choose a biological product or delay harvest.`,
crit:'🚨 Critical case: remove and destroy badly affected plants, isolate the plot, consult an agronomist.',
nutX:'For deficiencies: check EC, pH and drainage before adding fertilizer, then reassess after 7 days.',
saveL:'Save to plot log',icsB:'📅 Control plan reminders (.ics)',saved:'Saved',
noSel:'Tick at least one symptom or add a photo.',
dis:'Indicative diagnosis, not AI image recognition. Confirm in the field or a lab, and follow the product label and local registration.',
cH:'Compost production programme',cNeed:'Estimate farm need',cT:'Finished compost wanted (kg)',cB:'Dry material (carbon)',cG:'Green material/manure (nitrogen)',cS:'Start date',cGo:'Calculate programme',
cNeedR:(t,r)=>`Approximate farm need: ${t} kg (≈ ${r} kg/m² by crop and soil).`,
cRes:'Recipe',cMix:(b,g,w,m)=>`Start with ${m} kg of materials: ${b} kg dry + ${g} kg green, and add about ${w} L of water.`,
cCN:v=>`Target C:N ≈ 28 (calculated: ${v}).`,
cPile:(l,w,h)=>`Pile: length ${l} m × width ${w} m × height ${h} m. Cover with straw or burlap to limit evaporation.`,
cBad:'These materials cannot reach a good C:N: choose manure or green residues with straw or chopped palm fronds.',
cOut:k=>`Expected output ≈ ${k} kg of finished compost.`,
cSch:'Turning and monitoring schedule',
cSteps:[['Build the pile in layers (dry/green), wetting each layer','Moisture 50–60%: a squeezed handful should not drip'],['First turn, check temperature','Aim for 55–65°C'],['Turn','Add water if dry'],['Turn','Temperature starts to fall'],['Turn','Texture crumbles'],['Turn and test maturity','Dark colour, earthy smell'],['Nearly ready: let it cure without turning','Cress seed germination test']],
cTips:['No meat, dairy, oil or diseased plants.','Above 65°C turn and wet; below 40°C add greens and turn.','Fresh manure: 55°C for at least 3 days before use; keep off leafy crops near harvest.','Values are approximate; rely on the squeeze and smell tests.'],
cIcs:'📅 Turning reminders (.ics)',cUse:'Use: spread over the area before sowing and mix into the soil.',
m:{straw:'Straw/hay',palm:'Chopped palm fronds',leaf:'Dry leaves',card:'Cardboard/paper',saw:'Sawdust',goat:'Sheep/goat manure',camel:'Camel dung',cow:'Cattle manure',poul:'Poultry manure',kit:'Kitchen scraps',gre:'Green residues/fresh grass',dat:'Date and fruit waste'},
days:'d',m2:'m²'}};
const t=()=>T[LANG]||T.ar;
const $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let FM={total:'',res:10,plots:[]},VIEW=0,DG={ph:null,an:null,plot:'',sym:[],pct:1,sp:1,res:null};
try{const s=JSON.parse(localStorage.getItem('fa_farm')||'null');if(s&&Array.isArray(s.plots))FM=s}catch(_){}
const save=()=>{try{localStorage.setItem('fa_farm',JSON.stringify(FM))}catch(_){}};
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const fmt=(n,d)=>(Math.round(n*Math.pow(10,d||0))/Math.pow(10,d||0)).toLocaleString(LANG);
const dstr=d=>new Date(d).toLocaleDateString(LANG);
function base(){const I=getI();return I}
function plotI(p){return Object.assign({},base(),{crop:p.crop,sow:p.sow,area:p.area,env:p.env,irr:p.irr,sym:[]})}
function climF(I,k){ // forecast factor and flags
 const r={f:1,fx:null,fn:null,flag:[]};
 if(W.fxA&&W.fxA.length){const n=Math.min(3,W.fxA.length),fx=avg(W.fxA.slice(0,n)),fn=avg(W.fnA.slice(0,n));r.fx=fx;r.fn=fn;
  const lat=num(I.lat),[tx,tn]=temps(I);
  if(lat!==null){const a=et0h(lat,new Date(),fx,fn),b=et0h(lat,new Date(),tx,tn);r.f=Math.max(.6,Math.min(1.5,a/b))}
  const gh=I.env==='gh',ax=fx+(gh?4:0),an=fn+(gh?3:0);
  if(ax>=tx+4||ax>=40)r.flag.push('heat');if(an<=tn-4||an<=8)r.flag.push('cold');
  if(an<k.t[0])r.flag.push('frost');if(ax>k.t[1])r.flag.push('hot2')}
 return r}
const ROT={fruit:['leaf','legume'],cucurb:['legume','leaf'],leaf:['fruit','root'],root:['legume','leaf'],bulb:['legume','leaf'],legume:['leaf','fruit'],cereal:['legume','leaf']};
function famName(f){const g=Object.keys(CR).filter(c=>CR[c].fam===f).slice(0,3).map(c=>CR[c].nm[LANG]);return g.join(' / ')}
function pinfo(p){const I=plotI(p),k=CR[p.crop],sm=sim(I),f=sm.dd/sm.d,si=f<.2?0:f<.5?1:f<.8?2:3,cf=climF(I,k);
 const yk=k.y/10*(p.env==='gh'?(k.fam==='fruit'||k.fam==='cucurb'?1.3:1.15):1)*num(p.area||0);
 return{I,k,sm,si,cf,w:sm.todayN,wa:sm.todayN*cf.f,lit:sm.todayN*cf.f*(num(p.area)||0),yk,hd:new Date(sm.sow.getTime()+sm.d*864e5),left:Math.max(0,sm.d-sm.dd)}}
function weights(){return{wat:2,mel:2,pum:2,swp:2,cab:1.2,cor:1.3,aru:.6,cil:.6,spi:.7,let:.8,tur:.7,gar:.7}}
function split(){const tot=num(FM.total);if(!tot||!FM.plots.length)return;const net=tot*(1-(num(FM.res)||0)/100),w=weights();
 const ws=FM.plots.map(p=>w[p.crop]||1),s=avg(ws)*ws.length;FM.plots.forEach((p,i)=>p.area=Math.round(net*ws[i]/s));save();renderFarm()}
function mkIcs(evs){const dts=(d,h,m)=>d.getFullYear()+pad2(d.getMonth()+1)+pad2(d.getDate())+'T'+pad2(h)+pad2(m)+'00';
 const e=s=>String(s).replace(/<[^>]+>/g,'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
 const fold=l=>{const a=Array.from(l),r=[];for(let i=0;i<a.length;i+=28)r.push(a.slice(i,i+28).join(''));return r.join('\r\n ')};
 const st=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,''),o=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//FarmAdvisor//AR-FR-EN//','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
 const tm=($('rtime')&&$('rtime').value||'06:30').split(':'),H=+tm[0],M=+tm[1];
 evs.forEach((v,i)=>{o.push('BEGIN:VEVENT','UID:fm'+Date.now()+'-'+i+'@farm-advisor','DTSTAMP:'+st,'DTSTART:'+dts(v[0],H,M),'DTEND:'+dts(v[0],H,Math.min(59,M+30)),'SUMMARY:'+e(v[1]),'DESCRIPTION:'+e(v[2]||v[1]),'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+e(v[1]),'TRIGGER:PT0M','END:VALARM','END:VEVENT')});
 o.push('END:VCALENDAR');return o.map(fold).join('\r\n')+'\r\n'}
const OPEN=new Set();
function cropOpts(sel){return Object.keys(CR).map(k=>'<option value="'+k+'"'+(k===sel?' selected':'')+'>'+esc(CR[k].nm[LANG])+'</option>').join('')}
function opts(a,sel){return a.map(([v,l])=>'<option value="'+v+'"'+(v===sel?' selected':'')+'>'+esc(l)+'</option>').join('')}
function envO(s){const x=t();return opts([['gh',x.gh],['open',x.op]],s)}
function irrO(s){const x=t();return opts([['drip',x.drip],['spr',x.spr],['flood',x.flood]],s)}
function climHTML(){const x=t(),I=base(),[tx,tn]=temps(I),has=I.lat&&I.lon;
 let h='<p>'+(has?'📍 '+esc(I.lat)+', '+esc(I.lon)+' · ':'')+'🌡 '+fmt(tx,0)+'° / '+fmt(tn,0)+'°</p>';
 if(W.fxA&&W.fxA.length)h+='<p class="note">'+x.fcast(W.fxA.slice(0,3).map(Math.round).join('/'),W.fnA.slice(0,3).map(Math.round).join('/'))+'</p>';
 if(!has)h+='<p class="note warn">'+x.noLoc+'</p>';
 return h+'<div class="row"><button class="sec" data-a="setc" type="button">'+x.setClim+'</button><button class="sec" data-a="wx" type="button">'+x.wx+'</button></div>'}
function plotHTML(p){const x=t(),pi=pinfo(p),k=pi.k,sm=pi.sm,gh=p.env==='gh',o=D[LANG].o;
 const emo=sm.dd>sm.d?'🧺':sm.emo[pi.si],pct=Math.min(100,Math.round(100*sm.dd/sm.d)),late=sm.dd>sm.d;
 let h='<details data-id="'+p.id+'"'+(OPEN.has(p.id)?' open':'')+'><summary>'+emo+' '+esc(p.name||k.nm[LANG])+' — '+esc(k.nm[LANG])+' · '+fmt(num(p.area)||0)+' '+x.m2+' · '+(gh?'🏠':'🌾')+'</summary>';
 h+='<div class="bar"><i style="width:'+pct+'%"></i></div><p class="note">'+x.day(Math.min(sm.dd,sm.d),sm.d)+(p.sow?'':' ('+x.sow+' ?)')+'</p>';
 h+='<p>💧 <b>'+x.wToday+':</b> '+fmt(pi.w,1)+' '+x.perm+(Math.abs(pi.cf.f-1)>.03?' → <b>'+fmt(pi.wa,1)+'</b> ('+x.adj+')':'')+' · <b>'+fmt(pi.lit)+'</b> '+x.tl+'</p>';
 pi.cf.flag.forEach(f=>{h+='<p class="warn">'+x[f]+'</p>'});
 h+='<p class="note">'+(gh?x.ghN:x.opN)+'</p>';
 const fs=FF[k.fam][pi.si];h+='<p>🧪 <b>'+x.fert+':</b> '+esc(o.fp[fs[0]])+'</p>';
 h+='<p>🧺 <b>'+x.yld+':</b> ≈ '+fmt(pi.yk)+' '+x.kg+' · <b>'+x.hd+':</b> '+dstr(pi.hd)+'</p>';
 if(pi.si===3){const r=ROT[k.fam]||[];h+='<p class="note">🔄 '+x.rot+': '+r.map(famName).join(' ، ')+'</p>'}
 h+='<div class="row"><div><label>'+x.name+'</label><input data-f="name" value="'+esc(p.name||'')+'"></div><div><label>'+x.area+'</label><input data-f="area" inputmode="decimal" value="'+esc(p.area||'')+'"></div></div>';
 h+='<div class="row"><div><label>'+x.sow+'</label><input data-f="sow" type="date" value="'+esc(p.sow||'')+'"></div><div><label>'+x.crop+'</label><select data-f="crop">'+cropOpts(p.crop)+'</select></div></div>';
 h+='<div class="row"><div><label>'+x.env+'</label><select data-f="env">'+envO(p.env)+'</select></div><div><label>'+x.irr+'</label><select data-f="irr">'+irrO(p.irr)+'</select></div></div>';
 h+='<label>'+x.logH+'</label><div class="row"><select data-l="ty">'+x.logT.map((s,i)=>'<option value="'+i+'">'+s+'</option>').join('')+'</select><input data-l="q" placeholder="'+x.logQ+'"></div><button class="sec" data-a="log" type="button">'+x.logAdd+'</button>';
 const lg=(p.log||[]).slice(-6).reverse();
 if(lg.length){h+='<ul>'+lg.map(e=>'<li>'+dstr(e.d)+' '+x.logT[e.ty]+(e.q?': '+esc(e.q):'')+'</li>').join('')+'</ul>';
  const hv=(p.log||[]).filter(e=>e.ty==4).reduce((s,e)=>s+(num(e.q)||0),0);if(hv)h+='<p class="note">🧺 '+fmt(hv,1)+' / '+fmt(pi.yk)+' '+x.kg+'</p>'}
 h+='<div class="row"><button class="sec" data-a="diag" type="button">'+x.diag+'</button><button class="sec" data-a="del" type="button">'+x.del+'</button></div></details>';return h}
function renderFarm(){const x=t(),el=$('vFarm');if(!el)return;
 const tot=num(FM.total)||0,used=FM.plots.reduce((s,p)=>s+(num(p.area)||0),0),net=tot*(1-(num(FM.res)||0)/100);
 let infos=[];try{infos=FM.plots.map(p=>({p,i:pinfo(p)}))}catch(e){infos=[]}
 const wt=infos.reduce((s,r)=>s+r.i.lit,0);
 let h='<div class="card"><h2>'+x.clim+'</h2>'+climHTML()+'</div>';
 h+='<div class="card"><h2>'+x.tot+'</h2><div class="row"><div><label>'+x.tot+'</label><input id="fTot" inputmode="decimal" value="'+esc(FM.total)+'"></div><div><label>'+x.res+'</label><input id="fRes" inputmode="decimal" value="'+esc(FM.res)+'"></div></div><button class="sec" data-a="split" type="button">'+x.split+'</button></div>';
 h+='<div class="card"><h2>'+x.addH+'</h2><div class="row"><div><label>'+x.crop+'</label><select id="nCrop">'+cropOpts('tom')+'</select></div><div><label>'+x.area+'</label><input id="nArea" inputmode="decimal"></div></div><div class="row"><div><label>'+x.env+'</label><select id="nEnv">'+envO('open')+'</select></div><div><label>'+x.irr+'</label><select id="nIrr">'+irrO('drip')+'</select></div></div><label>'+x.sow+'</label><input id="nSow" type="date"><button data-a="add" type="button">'+x.add+'</button></div>';
 if(!FM.plots.length)return void(el.innerHTML=h+'<p class="note">'+x.none+'</p>');
 h+='<div class="card"><h2>'+x.sum+'</h2><p>'+x.plots(FM.plots.length)+' · '+x.used+': <b>'+fmt(used)+'</b> '+x.m2+(tot?' · '+x.free+': <b'+(used>net?' class="warn"':'')+'>'+fmt(net-used)+'</b>':'')+'</p>'+(tot&&used>net?'<p class="warn">'+x.over+'</p>':'')+'<p>💧 <b>'+x.wtot+':</b> '+fmt(wt)+' '+x.lday+'</p>';
 const up=infos.filter(r=>r.i.left>=0).sort((a,b)=>a.i.hd-b.i.hd).slice(0,4);
 h+='<p><b>'+x.harv+':</b></p><ul>'+up.map(r=>'<li>'+esc(r.p.name||r.i.k.nm[LANG])+' — '+dstr(r.i.hd)+' ('+fmt(r.i.left)+' '+x.days+') · ≈ '+fmt(r.i.yk)+' '+x.kg+'</li>').join('')+'</ul></div>';
 h+='<div class="card">'+FM.plots.map(plotHTML).join('')+'</div>';
 el.innerHTML=h}
function farmClick(e){const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,d=b.closest('details'),p=d?FM.plots.find(q=>q.id===d.dataset.id):null,x=t();
 if(a==='setc'){show(0);const c=document.querySelector('#vSingle .card');if(c)c.scrollIntoView({behavior:'smooth'})}
 else if(a==='wx'){b.disabled=true;Promise.resolve($('wxb').onclick&&$('wxb').onclick()).then(()=>{b.disabled=false;renderFarm()},()=>{b.disabled=false})}
 else if(a==='split'){FM.total=$('fTot').value;FM.res=$('fRes').value;split()}
 else if(a==='add'){const ar=num($('nArea').value);if(!ar||ar<=0){$('nArea').focus();return}
  FM.plots.push({id:uid(),name:'',crop:$('nCrop').value,area:ar,env:$('nEnv').value,irr:$('nIrr').value,sow:$('nSow').value,log:[]});save();renderFarm()}
 else if(a==='del'&&p){if(confirm(x.conf)){FM.plots=FM.plots.filter(q=>q!==p);save();renderFarm()}}
 else if(a==='log'&&p){const q=d.querySelector('[data-l=q]').value;p.log=(p.log||[]).concat([{d:new Date().toISOString().slice(0,10),ty:+d.querySelector('[data-l=ty]').value,q}]);OPEN.add(p.id);save();renderFarm()}
 else if(a==='diag'&&p){DG.plot=p.id;show(2)}}
function farmChange(e){const g=e.target;if(g.id==='fTot'||g.id==='fRes'){FM.total=$('fTot').value;FM.res=$('fRes').value;save();renderFarm();return}
 const d=g.closest('details');if(!d||!g.dataset.f)return;const p=FM.plots.find(q=>q.id===d.dataset.id);if(!p)return;p[g.dataset.f]=g.value;OPEN.add(p.id);save();renderFarm()}
function farmToggle(e){const d=e.target;if(d.tagName!=='DETAILS'||!d.dataset.id)return;d.open?OPEN.add(d.dataset.id):OPEN.delete(d.dataset.id)}
const NUT=['nit','pot','mag','pho','iro','cal','mic'],FAST=['lb','down','blkrot','rootrot','whrot','nem'],DIS=['leafspot','powd','rust','botr'];
const b0=id=>NUT.includes(id)?1:FAST.includes(id)?2.5:DIS.includes(id)?2:1.5;
function analyze2(url){return new Promise(res=>{const im=new Image();im.onload=()=>{const N=96,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d');g.drawImage(im,0,0,N,N);const d=g.getImageData(0,0,N,N).data,cl=new Uint8Array(N*N);
 let G=0,Y=0,B=0,P=0,Wt=0,x0=N,x1=0,y0=N,y1=0;
 for(let i=0;i<N*N;i++){const r=d[i*4]/255,gg=d[i*4+1]/255,b=d[i*4+2]/255,mx=Math.max(r,gg,b),mn=Math.min(r,gg,b),df=mx-mn,s=mx?df/mx:0,v=mx;let h=0;
  if(df){if(mx===r)h=((gg-b)/df+6)%6;else if(mx===gg)h=(b-r)/df+2;else h=(r-gg)/df+4;h*=60}
  let k=0;if(v<.15)k=0;else if(s<.15&&v>.5)k=5;else if(s>=.2){if(h>=80&&h<=165)k=1;else if(h>=42&&h<80)k=2;else if(h>=10&&h<42&&v<.7)k=3;else if(h>=270||h<10)k=v>=.35?4:3}
  cl[i]=k;if(k===1){G++;const X=i%N,Yy=(i/N)|0;if(X<x0)x0=X;if(X>x1)x1=X;if(Yy<y0)y0=Yy;if(Yy>y1)y1=Yy}else if(k===2)Y++;else if(k===3)B++;else if(k===4)P++}
 if(G>N*N*.05)for(let i=0;i<N*N;i++)if(cl[i]===5){const X=i%N,Yy=(i/N)|0;if(X>=x0&&X<=x1&&Yy>=y0&&Yy<=y1)Wt++}
 const tot=G+Y+B+P+Wt;if(tot<40)return res(null);
 const seen=new Uint8Array(N*N);let sp=0;
 for(let i=0;i<N*N;i++){if(cl[i]!==3||seen[i])continue;let n=0;const st=[i];seen[i]=1;while(st.length){const j=st.pop();n++;const X=j%N,Yy=(j/N)|0;[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{const xx=X+a,yy=Yy+b;if(xx<0||yy<0||xx>=N||yy>=N)return;const q=yy*N+xx;if(cl[q]===3&&!seen[q]){seen[q]=1;st.push(q)}})}if(n>=4&&n<=400)sp++}
 const p=v=>Math.round(100*v/tot);res({g:p(G),y:p(Y),b:p(B),w:p(Wt),p:p(P),sp:Math.min(sp,99)})};im.onerror=()=>res(null);im.src=url})}
function leads(a){const r=[];if(!a)return r;
 if(a.w>=8)r.push('powd');if(a.p>=10)r.push('pho');
 if(a.b>=8&&a.sp>=3)r.push('leafspot','lb');else if(a.b>=10)r.push('pot');
 if(a.y>=25&&a.b<10)r.push('nit','mag','iro');
 return [...new Set(r)].slice(0,3)}
function score(ids,an,pc,sp){let best=0;ids.forEach(id=>{let s=b0(id)+[.5,1.5,2.5,3.5][pc]+[0,1,2][sp];if(an)s+=Math.min(1.5,NUT.includes(id)?an.y/30:(an.b+an.w)/20);best=Math.max(best,s)});best+=Math.min(1,.3*(ids.length-1));return Math.max(1,Math.min(10,best))}
const grade=s=>s<=3.5?0:s<=5.5?1:s<=7.5?2:3;
function planFor(ids,g,left){const out=[];ids.filter(i=>PR[i]).forEach(id=>{const bio=PR[id].filter(r=>PN[r[0]].t==='bio'),chem=PR[id].filter(r=>PN[r[0]].t==='chem');
 const pick=(g<2?(bio.length?bio:PR[id]):[].concat(bio.slice(0,1),chem.slice(0,2))).slice(0,3);
 const iv=Math.round(avg(pick.map(r=>r[5]||7)))||7,phi=Math.max(...pick.map(r=>r[6]));
 out.push({id,n:[2,3,4,4][g],iv,pick,names:pick.map(r=>PN[r[0]][LANG]),phi,warn:left!==null&&phi>left?phi:0})});return out}
function dPlot(){return FM.plots.find(p=>p.id===DG.plot)||null}
function renderDiag(){const el=$('vDiag');if(!el)return;const x=t(),keys=Object.keys(GRP);
 let h='<div class="card"><h2>'+x.dH+'</h2><label>'+x.plot+'</label><select id="dPl"><option value="">'+x.noPlot+'</option>'+FM.plots.map(p=>'<option value="'+p.id+'"'+(p.id===DG.plot?' selected':'')+'>'+esc((p.name||CR[p.crop].nm[LANG])+' — '+CR[p.crop].nm[LANG])+'</option>').join('')+'</select>';
 if(!dPlot()){h+='<label>'+x.crop+'</label><select id="dCr">'+cropOpts(DG.crop||'tom')+'</select>'}
 h+='<div class="row"><button class="sec" data-a="dcam" type="button">'+x.cam+'</button><button class="sec" data-a="dpick" type="button">'+x.pick+'</button></div><input id="dF1" type="file" accept="image/*" capture="environment" hidden><input id="dF2" type="file" accept="image/*" hidden>';
 if(DG.ph)h+='<img class="pimg" src="'+DG.ph+'" alt="">';
 if(DG.an){const a=DG.an;h+='<p><b>'+x.ph+'</b></p>'+[['pGreen',a.g,'#2e7d32'],['pYel',a.y,'#f9a825'],['pBrn',a.b,'#795548'],['pWht',a.w,'#9e9e9e'],['pPur',a.p,'#8e24aa']].map(r=>'<div class="note">'+x[r[0]]+' '+r[1]+'%</div><div class="bar"><i style="width:'+r[1]+'%;background:'+r[2]+'"></i></div>').join('')+'<p class="note">'+x.spots(a.sp)+'</p>';
  const ld=leads(a);if(ld.length)h+='<p>'+x.cand+': <b>'+ld.map(i=>IS[i][LANG].n).join(' · ')+'</b></p>'}
 h+='<p class="note">'+x.dNote+'</p></div><div class="card"><h2>'+x.sy+'</h2>';
 let gp='';Object.keys(IS).sort((a,b)=>keys.indexOf(IS[a].g)-keys.indexOf(IS[b].g)).forEach(i=>{const s=IS[i];if(s.g!==gp){gp=s.g;h+='<label style="margin-top:10px">'+GRP[gp][LANG]+'</label>'}h+='<label class="chk"><input type="checkbox" data-s="'+i+'"'+(DG.sym.includes(i)?' checked':'')+'><span>'+esc(s[LANG].s)+'</span></label>'});
 h+='<div class="row"><div><label>'+x.pctQ+'</label><select id="dPc">'+x.pcts.map((s,i)=>'<option value="'+i+'"'+(i===DG.pct?' selected':'')+'>'+s+'</option>').join('')+'</select></div><div><label>'+x.spQ+'</label><select id="dSp">'+x.sps.map((s,i)=>'<option value="'+i+'"'+(i===DG.sp?' selected':'')+'>'+s+'</option>').join('')+'</select></div></div><button data-a="drun" type="button">'+x.run+'</button></div><div id="dOut"></div><p class="note">'+x.dis+'</p>';
 el.innerHTML=h;if(DG.res)showRes()}
function showRes(){const x=t(),r=DG.res,o=D[LANG].o,el=$('dOut');if(!el||!r)return;
 const gc=['#2e7d32','#f9a825','#ef6c00','#c62828'][r.g];
 let h='<div class="card res"><h2>'+x.sev+'</h2><p style="font-size:1.1rem"><b style="color:'+gc+'">'+['🟢','🟡','🟠','🔴'][r.g]+' '+x.grades[r.g]+' — '+fmt(r.s,1)+'/10</b></p>';
 if(r.g===3)h+='<p class="warn">'+x.crit+'</p>';
 h+='<h3>'+x.treat+'</h3><ul>'+r.ids.map(i=>'<li><b>'+esc(IS[i][LANG].n)+'</b><br><span class="tr">'+esc(IS[i][LANG].t)+'</span><br><span class="pv">'+esc(IS[i][LANG].p)+'</span></li>').join('')+'</ul>';
 if(r.ids.some(i=>NUT.includes(i)))h+='<p class="note">'+x.nutX+'</p>';
 if(r.plan.length){h+='<h3>'+x.plan+'</h3><ul>'+r.plan.map(p=>'<li><b>'+esc(IS[p.id][LANG].n)+':</b> '+(p.names.length>1?x.planT(p.n,p.iv,p.names.join(' ↔ ')):x.planN(p.n,p.iv)+' — '+p.names[0])+(p.warn?'<br><span class="warn">'+x.phiW(p.warn,r.left)+'</span>':'')+'</li>').join('')+'</ul>';
  h+=pestHTML({sym:r.ids.filter(i=>PR[i])},Object.assign({},CR[r.crop],{pests:[]}),r.si,r.area,o)}
 h+='<div class="row">'+(r.pid?'<button class="sec" data-a="dsave" type="button">'+x.saveL+'</button>':'')+(r.plan.length?'<button class="sec" data-a="dics" type="button">'+x.icsB+'</button>':'')+'</div></div>';
 el.innerHTML=h}
function runDiag(){const x=t(),ids=DG.sym.slice();DG.sym=ids;if(!ids.length&&!DG.an){alert(x.noSel);return}
 const use=ids.length?ids:leads(DG.an);if(!use.length){alert(x.noSel);return}
 const p=dPlot(),crop=p?p.crop:(DG.crop||'tom'),pi=p?pinfo(p):null,left=pi&&p.sow?pi.left:null,area=p?num(p.area)||100:100;
 const s=score(use,DG.an,DG.pct,DG.sp),g=grade(s);
 DG.res={ids:use,s,g,plan:planFor(use,g,left),crop,si:pi?pi.si:1,area,left,pid:p?p.id:''};showRes();$('dOut').scrollIntoView({behavior:'smooth'})}
function diagClick(e){const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a==='dcam')$('dF1').click();else if(a==='dpick')$('dF2').click();else if(a==='drun')runDiag();
 else if(a==='dsave'){const r=DG.res,p=FM.plots.find(q=>q.id===r.pid);if(p){p.log=(p.log||[]).concat([{d:new Date().toISOString().slice(0,10),ty:3,q:'🔍 '+r.ids.map(i=>IS[i][LANG].n).join(', ')+' — '+t().grades[r.g]}]);save();b.textContent='✅ '+t().saved}}
 else if(a==='dics'){const r=DG.res,ev=[],now=new Date();now.setHours(0,0,0,0);r.plan.forEach(p=>{for(let i=0;i<p.n;i++){ev.push([new Date(now.getTime()+i*p.iv*864e5),'🧴 '+IS[p.id][LANG].n+' ('+(i+1)+'/'+p.n+')',p.names.join(' / ')])}});download(mkIcs(ev),'control-plan.ics','text/calendar')}}
async function diagPhoto(e){const f=e.target.files[0];if(!f)return;if(DG.ph)URL.revokeObjectURL(DG.ph);DG.ph=URL.createObjectURL(f);DG.an=await analyze2(DG.ph);DG.res=null;renderDiag()}
function diagChange(e){const g=e.target;
 if(g.dataset.s){DG.sym=$$('[data-s]:checked',$('vDiag')).map(c=>c.dataset.s)}
 else if(g.id==='dPl'){DG.plot=g.value;DG.res=null;renderDiag()}
 else if(g.id==='dCr')DG.crop=g.value;else if(g.id==='dPc')DG.pct=+g.value;else if(g.id==='dSp')DG.sp=+g.value;
 else if(g.id==='dF1'||g.id==='dF2')diagPhoto(e)}
/* ---------- compost ---------- */
const MAT={straw:[80,.9,'b'],palm:[70,.9,'b'],leaf:[60,.85,'b'],card:[350,.9,'b'],saw:[400,.8,'b'],goat:[20,.6,'g'],camel:[25,.6,'g'],cow:[20,.55,'g'],poul:[10,.7,'g'],kit:[15,.3,'g'],gre:[20,.25,'g'],dat:[25,.35,'g']};
const CP={b:'straw',g:'goat',t:'',s:'',res:null};
function farmNeed(){const I=base(),sand=I.soil==='sand',cm=I.comp==='good'?.6:I.comp==='low'?.8:1,R={fruit:4,cucurb:4,leaf:3,root:2.5,bulb:2.5,legume:1.5,cereal:3};let tot=0,ar=0;FM.plots.forEach(p=>{const a=num(p.area)||0;ar+=a;tot+=a*(R[CR[p.crop].fam]||3)*(sand?1.2:1)*cm});return{tot:Math.round(tot),r:ar?(tot/ar).toFixed(1):0}}
function mOpts(ty,sel){const m=t().m;return Object.keys(MAT).filter(k=>MAT[k][2]===ty).map(k=>'<option value="'+k+'"'+(k===sel?' selected':'')+'>'+m[k]+'</option>').join('')}
function renderComp(){const el=$('vComp');if(!el)return;const x=t(),td=new Date().toISOString().slice(0,10);
 let h='<div class="card"><h2>'+x.cH+'</h2><button class="sec" data-a="cneed" type="button">'+x.cNeed+'</button><p id="cNeedO" class="note"></p><label>'+x.cT+'</label><input id="cTg" inputmode="decimal" value="'+esc(CP.t)+'"><label>'+x.cB+'</label><select id="cBr">'+mOpts('b',CP.b)+'</select><label>'+x.cG+'</label><select id="cGr">'+mOpts('g',CP.g)+'</select><label>'+x.cS+'</label><input id="cSt" type="date" value="'+(CP.s||td)+'"><button data-a="cgo" type="button">'+x.cGo+'</button></div><div id="cOut"></div>';
 el.innerHTML=h;if(CP.res)showComp()}
function calcComp(){const x=t(),T0=num($('cTg').value);if(!T0||T0<=0){$('cTg').focus();return}
 CP.t=$('cTg').value;CP.b=$('cBr').value;CP.g=$('cGr').value;CP.s=$('cSt').value;
 const[nb,db]=MAT[CP.b],[ng,dg]=MAT[CP.g];
 if(!(nb>28&&ng<28)){CP.res={bad:1};showComp();return}
 const gPer=db*(1-28/nb)/((28/ng-1)*dg),M0=T0/.4,b=M0/(1+gPer),g=gPer*b,dry=b*db+g*dg,wat=Math.max(0,dry/.45-M0);
 const cb=b*db*.45,cg=g*dg*.45,cn=(cb+cg)/(cb/nb+cg/ng),V=M0/300,L=Math.max(2,V/1.4);
 CP.res={b:Math.round(b),g:Math.round(g),m:Math.round(M0),w:Math.round(wat),cn:cn.toFixed(0),L:L.toFixed(1),T:Math.round(T0)};showComp()}
function showComp(){const x=t(),r=CP.res,el=$('cOut');if(!el||!r)return;
 if(r.bad){el.innerHTML='<div class="card"><p class="warn">'+x.cBad+'</p></div>';return}
 const st=new Date((CP.s||new Date().toISOString().slice(0,10))+'T00:00:00'),off=[0,3,7,12,18,28,45],dt=n=>dstr(new Date(st.getTime()+n*864e5));
 let h='<div class="card res"><h2>'+x.cRes+'</h2><p>'+x.cMix(r.b,r.g,r.w,r.m)+'</p><p class="note">'+x.cCN(r.cn)+'</p><p>'+x.cPile(r.L,1.8,1.2)+'</p><p><b>'+x.cOut(r.T)+'</b></p><h3>'+x.cSch+'</h3><ul>'+x.cSteps.map((s,i)=>'<li><b>'+dt(off[i])+'</b> ('+x.days+' '+off[i]+') — '+s[0]+'<br><span class="note">'+s[1]+'</span></li>').join('')+'<li><b>'+dt(60)+'</b> — ✅ '+x.cOut(r.T).replace(/^[^≈]*/,'')+'</li></ul><ul>'+x.cTips.map(s=>'<li>'+s+'</li>').join('')+'</ul><p class="note">'+x.cUse+'</p><button class="sec" data-a="cics" type="button">'+x.cIcs+'</button></div>';
 el.innerHTML=h}
function compClick(e){const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a==='cneed'){const n=farmNeed();$('cNeedO').textContent=t().cNeedR(n.tot,n.r);if(n.tot)$('cTg').value=n.tot}
 else if(a==='cgo')calcComp();
 else if(a==='cics'){const x=t(),st=new Date((CP.s||'')+'T00:00:00'),off=[0,3,7,12,18,28,45,60],ev=off.map((n,i)=>[new Date(st.getTime()+n*864e5),'♻️ '+(i<7?x.cSteps[i][0]:x.cOut(CP.res.T)),i<7?x.cSteps[i][1]:''] );download(mkIcs(ev),'compost.ics','text/calendar')}}
/* ---------- nav & init ---------- */
function show(i){VIEW=i;['vSingle','vFarm','vDiag','vComp'].forEach((id,j)=>{$(id).style.display=j===i?'':'none'});$('today').style.display=i?'none':'';$$('.nav button').forEach((b,j)=>b.classList.toggle('on',j===i));
 if(i===1)renderFarm();else if(i===2)renderDiag();else if(i===3)renderComp();window.scrollTo(0,0)}
function navLabels(){$$('.nav button').forEach((b,i)=>b.textContent=t().nav[i])}
function init(){const main=document.querySelector('main'),today=$('today'),disc=main.querySelector('p[data-t=disc]');if(!disc||!today)return;
 const st=document.createElement('style');st.textContent='.nav{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0 12px}.nav button{margin:0;padding:9px 2px;font-size:.78rem;line-height:1.3}.nav button.on{background:var(--pri);color:#fff}.bar{height:8px;background:var(--bd);border-radius:6px;overflow:hidden;margin:2px 0 6px}.bar i{display:block;height:100%;background:var(--pri)}#vFarm button.sec,#vDiag button.sec,#vComp button.sec{margin-top:8px}';document.head.appendChild(st);
 const wrap=document.createElement('div');wrap.id='vSingle';let n=today.nextElementSibling;while(n&&n!==disc){const nx=n.nextElementSibling;wrap.appendChild(n);n=nx}main.insertBefore(wrap,disc);
 ['vFarm','vDiag','vComp'].forEach(id=>{const d=document.createElement('div');d.id=id;d.style.display='none';main.insertBefore(d,disc)});
 const nav=document.createElement('div');nav.className='nav';for(let i=0;i<4;i++){const b=document.createElement('button');b.type='button';b.className='sec'+(i?'':' on');b.onclick=()=>show(i);nav.appendChild(b)}main.insertBefore(nav,today);navLabels();
 const f=$('vFarm');f.addEventListener('click',farmClick);f.addEventListener('change',farmChange);f.addEventListener('toggle',farmToggle,true);
 const d=$('vDiag');d.addEventListener('click',diagClick);d.addEventListener('change',diagChange);$('vComp').addEventListener('click',compClick);
 $('lang').addEventListener('change',()=>{navLabels();if(VIEW===1)renderFarm();else if(VIEW===2)renderDiag();else if(VIEW===3)renderComp()})}
init();
})();
