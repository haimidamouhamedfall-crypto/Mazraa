/* Core support layer for farm.js. All calculations are indicative, not agronomic prescriptions. */
'use strict';
var LANG='ar';
const $=s=>document.querySelector(s);
const num=v=>{if(v===null||v===undefined||v==='')return 0;const n=Number(v);return Number.isFinite(n)?n:0};
const avg=a=>a&&a.length?a.reduce((s,n)=>s+num(n),0)/a.length:0;
const pad2=n=>String(n).padStart(2,'0');
const download=(content,name,type)=>{const blob=new Blob([content],{type:type||'text/plain;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)};
const cropData={
 tom:{fam:'fruit',days:85,y:4,t:[12,35],nm:{ar:'طماطم',fr:'Tomate',en:'Tomato'}},
 pep:{fam:'fruit',days:90,y:3.5,t:[15,35],nm:{ar:'فلفل',fr:'Poivron',en:'Pepper'}},
 egg:{fam:'fruit',days:90,y:3.5,t:[18,35],nm:{ar:'باذنجان',fr:'Aubergine',en:'Eggplant'}},
 wat:{fam:'cucurb',days:80,y:4,t:[18,38],nm:{ar:'بطيخ',fr:'Pastèque',en:'Watermelon'}},
 mel:{fam:'cucurb',days:75,y:3.5,t:[18,38],nm:{ar:'شمام',fr:'Melon',en:'Melon'}},
 pum:{fam:'cucurb',days:60,y:3,yield:3,t:[18,35],nm:{ar:'قرع',fr:'Courge',en:'Squash'}},
 swp:{fam:'root',days:100,y:3,t:[15,30],nm:{ar:'بطاطا حلوة',fr:'Patate douce',en:'Sweet potato'}},
 cab:{fam:'leaf',days:75,y:4,t:[8,28],nm:{ar:'ملفوف',fr:'Chou',en:'Cabbage'}},
 cor:{fam:'cereal',days:100,y:1.2,t:[15,35],nm:{ar:'ذرة',fr:'Maïs',en:'Maize'}},
 aru:{fam:'leaf',days:35,y:1.2,t:[8,30],nm:{ar:'جرجير',fr:'Roquette',en:'Arugula'}},
 cil:{fam:'leaf',days:40,y:.8,t:[10,28],nm:{ar:'كزبرة',fr:'Coriandre',en:'Coriander'}},
 spi:{fam:'leaf',days:45,y:1.2,t:[8,25],nm:{ar:'سبانخ',fr:'Épinard',en:'Spinach'}},
 let:{fam:'leaf',days:45,y:1.5,t:[8,25],nm:{ar:'خس',fr:'Laitue',en:'Lettuce'}},
 tur:{fam:'root',days:55,y:2,t:[10,28],nm:{ar:'لفت',fr:'Navet',en:'Turnip'}},
 gar:{fam:'bulb',days:120,y:1.5,t:[8,25],nm:{ar:'ثوم',fr:'Ail',en:'Garlic'}},
 oni:{fam:'bulb',days:110,y:2,t:[10,30],nm:{ar:'بصل',fr:'Oignon',en:'Onion'}},
 okr:{fam:'fruit',days:55,y:1.5,t:[20,38],nm:{ar:'بامية',fr:'Gombo',en:'Okra'}},
 bean:{fam:'legume',days:65,y:1.5,t:[15,32],nm:{ar:'لوبيا',fr:'Niébé',en:'Cowpea'}}
};
var CR={};
Object.keys(cropData).forEach(k=>{const c=cropData[k];CR[k]={...c,nm:c.nm}});
const D={
 ar:{o:{fp:['لا تسميد محدد؛ راقب النمو','سماد متوازن بجرعة ملصق المنتج','دعم غذائي حسب تحليل التربة','تقييم التربة والصرف قبل التسميد']}},
 fr:{o:{fp:['Pas de fertilisation fixe ; observer la croissance','Engrais équilibré selon l’étiquette','Apport selon analyse du sol','Analyser sol et drainage avant fertilisation']}},
 en:{o:{fp:['No fixed fertilizer; monitor growth','Balanced fertilizer per label','Nutrients based on soil test','Check soil and drainage before fertilizing']}}
};
const getI=()=>({
 crop:$('#crop')?.value||'tom',area:num($('#area')?.value)||100,env:$('#env')?.value||'open',
 irr:$('#irr')?.value||'drip',sow:$('#sow')?.value||new Date().toISOString().slice(0,10),
 soil:$('#soil')?.value||'sand',comp:$('#comp')?.value||'medium',lat:$('#lat')?.value===''?null:num($('#lat')?.value),
 lon:$('#lon')?.value===''?null:num($('#lon')?.value),temp:num($('#temp')?.value)||32,
 tmin:num($('#minTemp')?.value)||22,tmax:num($('#maxTemp')?.value)||38
});
function temps(I){return [num(I.tmax)||38,num(I.tmin)||22]}
function et0h(lat,date,tx,tn){return Math.max(.5,0.0023*(num(tx)+17.8)*Math.sqrt(Math.max(0,num(tx)-num(tn)))*10)}
var W={fxA:[],fnA:[]};
const FF={
 fruit:[[0,1],[1,1],[1,2],[2,2]],cucurb:[[0,1],[1,1],[1,2],[2,2]],leaf:[[0,1],[1,1],[1,2],[2,2]],
 root:[[0,1],[1,1],[1,2],[2,2]],bulb:[[0,1],[1,1],[1,2],[2,2]],legume:[[0,1],[1,1],[1,2],[2,2]],cereal:[[0,1],[1,1],[1,2],[2,2]]
};
function sim(I){
 const k=CR[I.crop]||CR.tom,sow=new Date((I.sow||new Date().toISOString().slice(0,10))+'T00:00:00');
 const dd=Math.max(0,Math.floor((new Date()-sow)/86400000)),d=k.days;
 const coeff=[.65,.8,1.0,0.8][dd/d<.2?0:dd/d<.5?1:dd/d<.8?2:3];
 const soilFactor=I.soil==='sand'?1.2:I.soil==='clay'?.8:1;
 const irrFactor=I.irr==='drip'?1:I.irr==='spr'?1.2:1.5;
 const todayN=Math.max(.5,((num(I.temp)||32)>35?5.5:4.5)*coeff*soilFactor*irrFactor*(I.env==='gh'?.75:1));
 return {dd,d,sow,todayN,emo:['🌱','🌿','🌼','🧺']};
}
const GRP={nut:{ar:'نقص غذائي',fr:'Carences',en:'Nutrient deficiencies'},pest:{ar:'آفات',fr:'Ravageurs',en:'Pests'},fung:{ar:'أمراض فطرية',fr:'Maladies fongiques',en:'Fungal diseases'},other:{ar:'أعراض أخرى',fr:'Autres symptômes',en:'Other symptoms'}};
const IS={
 nit:{g:'nut',ar:{s:'اصفرار الأوراق القديمة',n:'احتمال نقص النيتروجين',t:'قد يشير إلى نقص نيتروجين أو مشكلة جذور.',p:'تحقق من رطوبة التربة ودرجة الحموضة قبل التسميد.'},fr:{s:'Jaunissement des vieilles feuilles',n:'Carence possible en azote',t:'Peut indiquer un manque d’azote ou un problème racinaire.',p:'Vérifier humidité et pH avant fertilisation.'},en:{s:'Older leaves yellowing',n:'Possible nitrogen deficiency',t:'May indicate nitrogen deficiency or root issues.',p:'Check soil moisture and pH before fertilizing.'}},
 pot:{g:'nut',ar:{s:'اصفرار أو احتراق حواف الأوراق',n:'احتمال نقص البوتاسيوم',t:'أعراض محتملة لنقص البوتاسيوم أو إجهاد مائي.',p:'تحقق من الملوحة والري وتحليل التربة.'},fr:{s:'Bords jaunes ou brûlés',n:'Carence possible en potassium',t:'Peut venir du potassium ou d’un stress hydrique.',p:'Contrôler salinité, irrigation et sol.'},en:{s:'Yellow or scorched leaf edges',n:'Possible potassium deficiency',t:'Could be potassium deficiency or water stress.',p:'Check salinity, irrigation and soil test.'}},
 mag:{g:'nut',ar:{s:'اصفرار بين عروق الأوراق',n:'احتمال نقص المغنيسيوم',t:'اصفرار بين العروق قد تكون له أسباب متعددة.',p:'افحص pH والتوازن الغذائي قبل الإضافة.'},fr:{s:'Jaunissement entre les nervures',n:'Carence possible en magnésium',t:'Symptôme non spécifique.',p:'Vérifier pH et équilibre nutritif.'},en:{s:'Interveinal yellowing',n:'Possible magnesium deficiency',t:'A nonspecific symptom.',p:'Check pH and nutrient balance.'}},
 pho:{g:'nut',ar:{s:'لون أرجواني أو احمرار',n:'احتمال نقص الفوسفور أو برودة الجذور',t:'قد يرتبط بالفوسفور أو الإجهاد الحراري.',p:'تحقق من حرارة التربة وpH قبل الإضافة.'},fr:{s:'Teinte violette ou rouge',n:'Phosphore ou racines froides possibles',t:'Peut être lié au phosphore ou au stress.',p:'Vérifier température du sol et pH.'},en:{s:'Purple or reddish leaves',n:'Possible phosphorus issue or root chill',t:'May relate to phosphorus or stress.',p:'Check soil temperature and pH.'}},
 iro:{g:'nut',ar:{s:'اصفرار الأوراق الحديثة',n:'احتمال نقص الحديد',t:'قد يرتبط بارتفاع pH أو مشكلة امتصاص.',p:'تحقق من pH والصرف قبل المعالجة.'},fr:{s:'Jaunissement des jeunes feuilles',n:'Carence possible en fer',t:'Peut être lié au pH élevé.',p:'Vérifier pH et drainage.'},en:{s:'Young leaves yellowing',n:'Possible iron deficiency',t:'May be associated with high pH.',p:'Check pH and drainage.'}},
 cal:{g:'nut',ar:{s:'تشوه النمو الحديث',n:'احتمال نقص الكالسيوم',t:'قد يتصل بتذبذب الري أو نقص الكالسيوم.',p:'حافظ على انتظام الري وافحص التربة.'},fr:{s:'Déformation des jeunes pousses',n:'Carence possible en calcium',t:'Peut être liée à l’irrigation irrégulière.',p:'Stabiliser l’irrigation et analyser le sol.'},en:{s:'Distorted new growth',n:'Possible calcium deficiency',t:'May be linked to uneven watering.',p:'Keep watering consistent and test soil.'}},
 mic:{g:'nut',ar:{s:'نمو ضعيف عام',n:'احتمال نقص عناصر صغرى',t:'النمو الضعيف له أسباب متعددة.',p:'تحليل التربة والماء قبل التسميد.'},fr:{s:'Croissance générale faible',n:'Oligoéléments possibles',t:'Plusieurs causes possibles.',p:'Analyser le sol et l’eau.'},en:{s:'Generally weak growth',n:'Possible micronutrient issue',t:'Many causes are possible.',p:'Test soil and water.'}},
 lb:{g:'fung',ar:{s:'بقع بنية متزايدة',n:'تبقع ورقي محتمل',t:'قد يكون مرضاً فطرياً أو بكتيرياً.',p:'أزل الأوراق المصابة، وتجنب بلل الأوراق، واستشر مختصاً قبل أي مبيد.'},fr:{s:'Taches brunes qui progressent',n:'Taches foliaires possibles',t:'Origine fongique ou bactérienne possible.',p:'Retirer les feuilles atteintes et éviter de mouiller le feuillage.'},en:{s:'Increasing brown spots',n:'Possible leaf spot',t:'Could be fungal or bacterial.',p:'Remove affected leaves and avoid wetting foliage.'}},
 down:{g:'other',ar:{s:'ذبول النبات',n:'ذبول/إجهاد جذور',t:'قد يكون سببه العطش أو زيادة الماء أو مرض جذور.',p:'افحص رطوبة التربة والجذور قبل المعالجة.'},fr:{s:'Flétrissement',n:'Stress hydrique ou racinaire',t:'Manque ou excès d’eau ou maladie racinaire.',p:'Vérifier humidité et racines.'},en:{s:'Wilting',n:'Water or root stress',t:'Underwatering, overwatering or root disease.',p:'Check soil moisture and roots.'}},
 blkrot:{g:'fung',ar:{s:'تعفن أسود',n:'تعفن محتمل',t:'قد يكون مرضاً خطيراً يحتاج تحديداً ميدانياً.',p:'اعزل النباتات المصابة واستشر مهندساً زراعياً.'},fr:{s:'Pourriture noire',n:'Pourriture possible',t:'Diagnostic de terrain nécessaire.',p:'Isoler les plantes et consulter un agronome.'},en:{s:'Black rot',n:'Possible rot',t:'Needs field diagnosis.',p:'Isolate affected plants and consult an agronomist.'}},
 rootrot:{g:'fung',ar:{s:'تعفن الجذور',n:'تعفن جذور محتمل',t:'قد يرتبط بسوء الصرف أو ممرضات التربة.',p:'حسّن الصرف وتجنب تشبع التربة.'},fr:{s:'Pourriture des racines',n:'Pourriture racinaire possible',t:'Drainage ou pathogènes du sol.',p:'Améliorer le drainage.'},en:{s:'Root rot',n:'Possible root rot',t:'May involve poor drainage or pathogens.',p:'Improve drainage and avoid saturation.'}},
 whrot:{g:'fung',ar:{s:'عفن أبيض',n:'عفن أبيض محتمل',t:'يلزم فحص مباشر لتأكيد السبب.',p:'اعزل المصاب ونظف الأدوات.'},fr:{s:'Pourriture blanche',n:'Pourriture blanche possible',t:'Inspection nécessaire.',p:'Isoler et nettoyer les outils.'},en:{s:'White rot',n:'Possible white rot',t:'Needs inspection.',p:'Isolate plants and clean tools.'}},
 nem:{g:'pest',ar:{s:'عقد على الجذور',n:'نيماتودا محتملة',t:'تحتاج فحص الجذور أو تحليلاً.',p:'استشر مختصاً بشأن الدورة الزراعية.'},fr:{s:'Nœuds sur racines',n:'Nématodes possibles',t:'Inspection des racines ou analyse requise.',p:'Consulter sur la rotation.'},en:{s:'Root knots',n:'Possible nematodes',t:'Root inspection or lab analysis needed.',p:'Ask an agronomist about rotation.'}},
 powd:{g:'fung',ar:{s:'مسحوق أبيض على الأوراق',n:'بياض دقيقي محتمل',t:'قد يكون البياض الدقيقي.',p:'حسّن التهوية وأزل الأجزاء الشديدة الإصابة.'},fr:{s:'Poudre blanche sur feuilles',n:'Oïdium possible',t:'Oïdium possible.',p:'Améliorer l’aération.'},en:{s:'White powder on leaves',n:'Possible powdery mildew',t:'Could be powdery mildew.',p:'Improve airflow and remove heavily affected parts.'}},
 rust:{g:'fung',ar:{s:'بثور برتقالية/بنية',n:'صدأ محتمل',t:'قد يكون مرض الصدأ.',p:'أزل الأوراق المصابة وتجنب انتشارها.'},fr:{s:'Pustules orange/brunes',n:'Rouille possible',t:'Maladie de rouille possible.',p:'Retirer les feuilles atteintes.'},en:{s:'Orange/brown pustules',n:'Possible rust',t:'May be rust disease.',p:'Remove affected leaves.'}},
 botr:{g:'fung',ar:{s:'عفن رمادي',n:'عفن رمادي محتمل',t:'يرتبط غالباً بالرطوبة العالية.',p:'قلل الرطوبة وحسن التهوية.'},fr:{s:'Moisissure grise',n:'Botrytis possible',t:'Souvent associé à l’humidité.',p:'Réduire l’humidité et aérer.'},en:{s:'Gray mold',n:'Possible gray mold',t:'Often associated with high humidity.',p:'Reduce humidity and improve airflow.'}}
};
Object.keys(IS).forEach(k=>{IS[k].g=IS[k].g||'other'}); IS.leafspot=IS.lb;
const PN={bio:{t:'bio'},chem:{t:'chem'}};
const PR={};
Object.keys(IS).forEach(k=>{PR[k]=[['bio',0,''],['chem',0,'','',0,7,0]]});
function pestHTML(){return '<p class="note">اختر وسائل المكافحة المعتمدة محليًا واستشر مهندسًا زراعيًا قبل استخدام أي مبيد.</p>'}
function translateStatic(){
 const L=LANG, texts={
 ar:{subtitle:'إدارة المحاصيل والري والتشخيص والكومبوست',langLabel:'لغة التطبيق',singleTitle:'🌾 الحقل / قطعة واحدة',cropLabel:'المحصول',areaLabel:'المساحة (م²)',envLabel:'نوع الزراعة',irrLabel:'طريقة الري',sowLabel:'تاريخ البذر/الغرس',soilLabel:'التربة',compLabel:'المادة العضوية',latLabel:'خط العرض (اختياري)',lonLabel:'خط الطول (اختياري)',tempLabel:'الحرارة الحالية °م',minTempLabel:'الحرارة الصغرى °م',maxTempLabel:'الحرارة العظمى °م',calcBtn:'احسب احتياجات الحقل',open:'حقل مفتوح',gh:'بيت محمي',drip:'تنقيط',spr:'رش',flood:'غمر',sand:'رملية',loam:'متوسطة',clay:'طينية',low:'منخفضة',medium:'متوسطة',good:'جيدة',today:'🌤️ مساعدك الزراعي اليومي',result:'النتيجة التقديرية',water:'الاحتياج اليومي للماء',harvest:'موعد الحصاد المتوقع',days:'يومًا',caution:'تنبيه: التقديرات تقريبية وتعتمد على الصنف والتربة والطقس.'},
 fr:{subtitle:'Cultures, irrigation, diagnostic et compost',langLabel:'Langue',singleTitle:'🌾 Parcelle unique',cropLabel:'Culture',areaLabel:'Surface (m²)',envLabel:'Type de culture',irrLabel:'Irrigation',sowLabel:'Date de semis/plantation',soilLabel:'Sol',compLabel:'Matière organique',latLabel:'Latitude (facultatif)',lonLabel:'Longitude (facultatif)',tempLabel:'Température actuelle °C',minTempLabel:'Température minimale °C',maxTempLabel:'Température maximale °C',calcBtn:'Calculer les besoins',open:'Plein champ',gh:'Serre',drip:'Goutte-à-goutte',spr:'Aspersion',flood:'Gravitaire',sand:'Sableux',loam:'Limoneux',clay:'Argileux',low:'Faible',medium:'Moyenne',good:'Bonne',today:'🌤️ Votre assistant agricole',result:'Estimation',water:'Besoin quotidien en eau',harvest:'Récolte estimée',days:'jours',caution:'Attention : valeurs indicatives selon culture, sol et météo.'},
 en:{subtitle:'Crop, irrigation, diagnosis and compost management',langLabel:'Language',singleTitle:'🌾 Single plot',cropLabel:'Crop',areaLabel:'Area (m²)',envLabel:'Growing environment',irrLabel:'Irrigation',sowLabel:'Sowing/transplant date',soilLabel:'Soil',compLabel:'Organic matter',latLabel:'Latitude (optional)',lonLabel:'Longitude (optional)',tempLabel:'Current temperature °C',minTempLabel:'Minimum temperature °C',maxTempLabel:'Maximum temperature °C',calcBtn:'Calculate field needs',open:'Open field',gh:'Greenhouse',drip:'Drip',spr:'Sprinkler',flood:'Flood',sand:'Sandy',loam:'Loam',clay:'Clay',low:'Low',medium:'Medium',good:'Good',today:'🌤️ Your daily farm assistant',result:'Estimate',water:'Daily water need',harvest:'Expected harvest',days:'days',caution:'Note: indicative estimates depend on crop, soil and weather.'}};
 const d=texts[L];Object.keys(d).forEach(k=>{const el=$('#'+k);if(el)el.textContent=d[k]});
 $('#open') && ($('#open').textContent=d.open);
 const sel=$('#env');if(sel){[...sel.options].forEach(o=>o.textContent=d[o.value]||o.textContent)}
 const irr=$('#irr');if(irr)[...irr.options].forEach(o=>o.textContent=d[o.value]||o.textContent);
 const soil=$('#soil');if(soil)[...soil.options].forEach(o=>o.textContent=d[o.value]||o.textContent);
 const comp=$('#comp');if(comp)[...comp.options].forEach(o=>o.textContent=d[o.value]||o.textContent);
 $('#today').textContent=d.today;
 document.documentElement.lang=L;document.documentElement.dir=L==='ar'?'rtl':'ltr';
 $('#subtitle').textContent=d.subtitle;
}
function fillCrops(){const sel=$('#crop');sel.innerHTML=Object.keys(CR).map(k=>`<option value="${k}">${CR[k].nm[LANG]}</option>`).join('')}
function singleCalc(){
 const I=getI(),k=CR[I.crop]||CR.tom,sm=sim(I),daysLeft=Math.max(0,sm.d-sm.dd),water=sm.todayN*num(I.area)*(I.irr==='drip'?1:I.irr==='spr'?1.2:1.5);
 const harvest=new Date(sm.sow.getTime()+sm.d*86400000).toLocaleDateString(LANG);
 const t={ar:{result:'النتيجة التقديرية',water:'الاحتياج اليومي للماء',harvest:'موعد الحصاد المتوقع',days:'يومًا',stage:'مرحلة النمو',caution:'تنبيه: هذه حسابات إرشادية وليست بديلاً عن قياس رطوبة التربة أو استشارة مهندس زراعي.'},fr:{result:'Estimation',water:'Besoin quotidien en eau',harvest:'Récolte estimée',days:'jours',stage:'Stade de croissance',caution:'Estimation indicative : vérifiez l’humidité du sol et demandez conseil à un agronome.'},en:{result:'Estimate',water:'Daily water need',harvest:'Expected harvest',days:'days',stage:'Growth stage',caution:'Indicative estimate: check soil moisture and consult an agronomist.'}}[LANG];
 $('#singleResult').innerHTML=`<div class="card"><h2>${t.result}</h2><p>🌱 <b>${k.nm[LANG]}</b> — ${num(I.area).toLocaleString(LANG)} m²</p><p>💧 <b>${t.water}:</b> ≈ ${Math.round(water).toLocaleString(LANG)} L/day</p><p>🧺 <b>${t.harvest}:</b> ${harvest} (${daysLeft} ${t.days})</p><p class="note">${t.caution}</p></div>`;
}
function initCore(){
 const now=new Date();$('#sow').value=now.toISOString().slice(0,10);
 fillCrops();translateStatic();singleCalc();
 $('#lang').addEventListener('change',()=>{LANG=$('#lang').value;fillCrops();translateStatic();navLabels();singleCalc();if(typeof renderFarm==='function')renderFarm();if(typeof renderDiag==='function')renderDiag();if(typeof renderComp==='function')renderComp()});
 $('#calcBtn').addEventListener('click',singleCalc);
 ['crop','area','env','irr','sow','soil','comp','lat','lon','temp','minTemp','maxTemp'].forEach(id=>$('#'+id).addEventListener('change',singleCalc));
}
window.addEventListener('DOMContentLoaded',initCore);
