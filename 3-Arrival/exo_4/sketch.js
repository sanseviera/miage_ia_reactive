let vehicle_1;
let vehicle_2;
let targets;

let vehicles = [];

function randomColor() {
  
  list_color = [ // Senegal
    color(0,133,63),
    color(253,239,66),
    color(227,27,35)
  ];
  list_color = [ // Vietnam
    color(200, 16, 46), 
    color(255, 205, 0), 
  ];
  list_color = [ // France
    color(0, 85, 164), 
    color(255, 255, 255), 
    color(239, 65, 53), 
  ];
  
  return random(list_color);
}

function setup() {

  createCanvas(800, 800);

  targets=[];
// Supposons que CharacterGenerator.letterToPoints retourne un tableau
targets.push(...CharacterGenerator.makeSentence("ABCDEFGHIJK", 1000,100)); 
targets.push(...CharacterGenerator.makeSentence("LMNOPQRSTUV", 1000,200)); 
targets.push(...CharacterGenerator.makeSentence("WXYZ !", 1000,300)); 
targets.push(...CharacterGenerator.makeSentence("VIVE LA", 1000,500)); 
targets.push(...CharacterGenerator.makeSentence("MIAGE !", 1000,600)); 


  for (let i = 0; i < targets.length; i++) {
    vehicles.push(new Vehicle(random(width), random(height),randomColor()));
  }
}

function draw() {
  timer = millis();
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);


  // Cible qui suit la souris, cercle rouge de rayon 32
  fill(255, 0, 0);
  noStroke();

  for (let i = 0; i < vehicles.length; i++) {
    if (timer > 1000 * 10 && timer < 1000 * 20) {
      targets[i] = createVector(random(width), random(height));
    } else if (timer > 1000 * 200) {
      targets=[];
   
    }
    let v = vehicles[i];
    let steering = v.arrive(targets[i]);
    v.applyForce(steering);
    v.update(vehicles);
    let fleeForce = v.flee(createVector(mouseX, mouseY));
    v.applyForce(fleeForce);  // <--- Cette ligne applique la force de fuite
    v.show();
  }


 
}