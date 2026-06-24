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
    blendColor:"판다무늬",
    colors:[
      "흰색",
      "검정",
      "빨강",
      "파랑(블루볼트)",
      "판다무늬",
      "킹콩블랙",
      "루비레드",
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

  "흰색":"#ffffff",
  "파랑(블루볼트)":"#9fd3ff",
  "판다무늬":"#888",
  "킹콩블랙":"#000",
  "루비레드":"#b9001a",
  "모스라":"#ffffff",


  "반투명":"#f8fcff",
  "회갈색점무늬":"#9c7b5a",
  "회색줄무늬":"#bcbcbc"
};

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

function blendedColor(species){

  return SPECIES[species].blendColor;

}

function mutationPredict(a,b){

  if(a.species!==b.species){

    showModal(
      "다른 종끼리는 교배할 수 없습니다."
    );

    return null;

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
        style="background:${COLOR_SWATCH[item.color] || '#ccc'}">
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
          style="background:${COLOR_SWATCH[color] || '#ccc'}">
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