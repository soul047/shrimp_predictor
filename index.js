const SPECIES = {

  neocaridina:{
    label:"생이새우",
    blendColor:"갈색",
    colors:[
      "투명",
      "갈색",
      "회색",
      "빨강",
      "주황",
      "노랑",
      "초록",
      "청록",
      "파랑",
      "남색",
      "보라",
      "검정",
      "백색반점",
      "황금빛",
      "구리빛"
    ]
  },

  caridina:{
    label:"크리스탈/타이완비새우",
    colors:[
      "CRS",
      "CBS",
      "킹콩",
      "판다",
      "블루볼트",
      "모스라"
    ]
  },

  amano:{
    label:"야마토새우",
    blendColor:"회갈색점무늬",
    colors:[
      "반투명",
      "회갈색점무늬",
      "회색줄무늬"
    ]
  }

};

const COLOR_SWATCH = {

  "투명":"#f8fcff",
  "갈색":"#7a5a3a",
  "회색":"#9aa3a8",
  "빨강":"#e63232",
  "주황":"#f59a23",
  "노랑":"#ffd54a",
  "초록":"#47b26b",
  "청록":"#3db7b4",
  "파랑":"#2f82ff",
  "남색":"#1f3b8a",
  "보라":"#7a4fd6",
  "검정":"#111",
  "백색반점":"#efefef",
  "황금빛":"#cfa73a",
  "구리빛":"#b5692f",

  "CRS":"#c91f2e",
  "CBS":"#1a1a1a",
  "킹콩":"#2b2b2b",
  "판다":"#3a3a3a",
  "블루볼트":"#2f6fd6",
  "모스라":"#f2f2f2",

  "반투명":"#f8fcff",
  "회갈색점무늬":"#9c7b5a",
  "회색줄무늬":"#bcbcbc"
};

// 흰색과 다른 색이 섞인 무늬 품종은 대각선 2색으로 표시
const PATTERN_DUO = {
  "판다":["#111111","#ffffff"],
  "모스라":["#f2f2f2","#ffffff"],
  "CRS":["#c91f2e","#ffffff"],
  "CBS":["#1a1a1a","#ffffff"]
};

function swatchStyle(name){

  const duo = PATTERN_DUO[name];

  if(duo){
    return `background:linear-gradient(45deg, ${duo[0]} 0%, ${duo[0]} 49%, ${duo[1]} 51%, ${duo[1]} 100%);`;
  }

  return `background:${COLOR_SWATCH[name] || '#ccc'};`;

}

const SPECIES_EMOJI = {
  neocaridina:"🦐",
  caridina:"💎",
  amano:"🌊"
};

function fillSpeciesOptions(){

  typeA.innerHTML="";
  typeB.innerHTML="";

  for(const key in SPECIES){

    const optionA=document.createElement("option");
    optionA.value=key;
    optionA.textContent=SPECIES[key].label;

    const optionB=optionA.cloneNode(true);

    typeA.appendChild(optionA);
    typeB.appendChild(optionB);
  }

  typeA.value="neocaridina";
  typeB.value="neocaridina";

  fillColorOptions(typeA.value,colorA);
  fillColorOptions(typeB.value,colorB);
}

function fillColorOptions(species,select){

  select.innerHTML="";

  SPECIES[species].colors.forEach(color=>{

    const option=document.createElement("option");

    option.value=color;
    option.textContent=color;

    select.appendChild(option);

  });

}

function showModal(message){

  modalText.textContent=message;

  modal.classList.remove("hidden");

}

modalClose.onclick=()=>{

  modal.classList.add("hidden");

};

// 비쉬림프(caridina)는 색 혼합이 아니라 "품종 조합표" 방식
// 키는 "품종A|품종B" 형태 (정렬해서 저장하므로 순서 안 타짐)
const CARIDINA_TABLE = {

  "CRS|CRS":[
    { color:"CRS", p:80 },
    { color:"CBS", p:20 }
  ],

  "CBS|CBS":[
    { color:"CBS", p:80 },
    { color:"CRS", p:20 }
  ],

  "CRS|CBS":[
    { color:"CRS", p:50 },
    { color:"CBS", p:50 }
  ],

  "킹콩|킹콩":[
    { color:"킹콩", p:70 },
    { color:"판다", p:30 }
  ],

  "판다|판다":[
    { color:"판다", p:70 },
    { color:"킹콩", p:20 },
    { color:"모스라", p:10 }
  ],

  "킹콩|판다":[
    { color:"킹콩", p:50 },
    { color:"판다", p:50 }
  ],

  "블루볼트|블루볼트":[
    { color:"블루볼트", p:50 },
    { color:"킹콩", p:30 },
    { color:"모스라", p:20 }
  ],

  "킹콩|블루볼트":[
    { color:"킹콩", p:40 },
    { color:"판다", p:20 },
    { color:"블루볼트", p:30 },
    { color:"모스라", p:10 }
  ],

  "모스라|모스라":[
    { color:"모스라", p:90 },
    { color:"판다", p:10 }
  ]

};

function caridinaKey(colorA,colorB){

  return [colorA,colorB].sort().join("|");

}

function caridinaPredict(a,b){

  const key = caridinaKey(a.color,b.color);

  if(CARIDINA_TABLE[key]){

    return CARIDINA_TABLE[key];

  }

  // 조합표에 없는 낯선 조합은 두 품종 45%씩 + 모스라 10%로 대충 뽑기
  if(a.color===b.color){

    return [
      { color:a.color, p:90 },
      { color:"모스라", p:10 }
    ];

  }

  return [
    { color:a.color, p:45 },
    { color:b.color, p:45 },
    { color:"모스라", p:10 }
  ];

}

function mutationPredict(a,b){

  if(a.species!==b.species){

    showModal(
      "다른 종끼리는 교배할 수 없습니다."
    );

    return null;

  }

  if(a.species==="caridina"){

    return caridinaPredict(a,b);

  }

  if(a.color===b.color){

    const blend = blendedColor(a.species);

    if(blend===a.color){

      return [

        {
          color:a.color,
          p:100
        }

      ];

    }

    return [

      {
        color:a.color,
        p:80
      },

      {
        color:blend,
        p:20
      }

    ];

  }

  return [

    {
      color:a.color,
      p:40
    },

    {
      color:b.color,
      p:40
    },

    {
      color:blendedColor(a.species),
      p:20
    }

  ];

}

function renderResult(data){

  if(!data) return;

  result.innerHTML=data.map(item=>`

    <span class="chip">

      <span
        class="swatch"
        style="${swatchStyle(item.color)}">
      </span>

      ${item.color}

      <b>${item.p}%</b>

    </span>

  `).join("");

}

btnPredict.onclick=()=>{

  const a={
    species:typeA.value,
    color:colorA.value
  };

  const b={
    species:typeB.value,
    color:colorB.value
  };

  renderResult(
    mutationPredict(a,b)
  );

};

btnSwap.onclick=()=>{

  const tA=typeA.value;
  const tB=typeB.value;

  const cA=colorA.value;
  const cB=colorB.value;

  typeA.value=tB;
  typeB.value=tA;

  fillColorOptions(typeA.value,colorA);
  fillColorOptions(typeB.value,colorB);

  colorA.value=cB;
  colorB.value=cA;

};

typeA.addEventListener(
  "change",
  ()=>fillColorOptions(typeA.value,colorA)
);

typeB.addEventListener(
  "change",
  ()=>fillColorOptions(typeB.value,colorB)
);

function buildCatalog(){

  let html="";

  for(const key in SPECIES){

    const emoji = SPECIES_EMOJI[key] || "🦐";

    html+=`<div class="species-group">`;
    html+=`<div class="species-title">${emoji} ${SPECIES[key].label}</div>`;
    html+=`<div class="pattern-grid">`;

    SPECIES[key].colors.forEach(color=>{

      html+=`
      <div class="pattern-item">
        <div
          class="pattern-swatch"
          style="${swatchStyle(color)}">
        </div>
        <span class="pattern-label">${color}</span>
      </div>
      `;

    });

    html+=`</div></div>`;

  }

  catalog.innerHTML=html;

}

fillSpeciesOptions();
buildCatalog();