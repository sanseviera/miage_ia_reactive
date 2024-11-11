let vehicle_1;
let vehicle_2;
let target;

let vehicles = [];

function setup() {

  createCanvas(800, 800);

  for (let i = 0; i < 10; i++) {
    vehicles.push(new Vehicle(random(width), random(height)));
  }
}

function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);

  target = createVector(mouseX, mouseY);

  // Cible qui suit la souris, cercle rouge de rayon 32
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  for (let i = 0; i < vehicles.length; i++) {
    let v = vehicles[i];
    let steering = (i==0) ? v.arrive(target): v.arrive(vehicles[i-1].pos);
    v.applyForce(steering);
    v.update();
    v.show();
  }
 
}