let vehicle_1;
let vehicle_2;
let target;

let vehicles = [];

function setup() {

  createCanvas(800, 800);

  for (let i = 0; i < 11; i++) {
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

  let steering = vehicles[0].arrive(target);
  vehicles[0].applyForce(steering);
  vehicles[0].update(vehicles);
  vehicles[0].show();

  for (let i = 1; i < 5; i++) {
    let v = vehicles[i];
    let steering = v.arrive(vehicles[0].pos);
    v.applyForce(steering);
    v.update(vehicles);
    v.show();
  }

  for (let i = 5; i < 11; i++) {
    let v = vehicles[i];
    let steering = v.arrive(vehicles[i-5].pos);
    v.applyForce(steering);
    v.update(vehicles);
    v.show();
  }
 
}