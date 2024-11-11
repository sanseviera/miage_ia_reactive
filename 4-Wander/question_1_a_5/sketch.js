let vehicles = [];

function setup() {

  // Création des sliders pour les paramètres
  distSlider = createSlider(0, 400, 100, 1);
  distSlider.position(10, height + 10);
  radiusSlider = createSlider(10, 300, 50, 1);
  radiusSlider.position(10, height + 50);
  thetaSlider = createSlider(0, TWO_PI, 0.3, 0.01);
  thetaSlider.position(10, height +90);
  maxSpeedSlider = createSlider(1, 10, 4, 0.1);
  maxSpeedSlider.position(10, height + 130);
  maxForceSlider = createSlider(0.1, 2, 0.5, 0.1);
  maxForceSlider.position(10, height + 160);

  // Texte descriptif pour les sliders
  createP('distance du centre du cercle').position(10, height + 15).style('color', 'white');
  createP('Rayon du cercle').position(10, height + 55).style('color', 'white');
  createP('Theta Variation').position(10, height + 95).style('color', 'white');
  createP('Max Speed').position(10, height + 135).style('color', 'white');
  createP('Max Force').position(10, height + 165).style('color', 'white');

  createCanvas(800, 600);

  const nbVehicles = 3;
  for(let i=0; i < nbVehicles; i++) {
    let vehicle = new Vehicle(100, 100);
    vehicles.push(vehicle);
  }
}

function draw() {
  background(0);
  vehicles.forEach(vehicle => {
    vehicle.maxSpeed = maxSpeedSlider.value();
    vehicle.distance_centre_cercle = distSlider.value();
    vehicle.wanderRadius = radiusSlider.value();
    vehicle.theta = thetaSlider.value();
    vehicle.maxForce = maxForceSlider.value();
    vehicle.wander();
    vehicle.update();
    // Affichage seulement en mode debug
    if (debugMode) {
      vehicle.debug();
    }
    vehicle.edges();
    vehicle.show(); // Affiche les cercles et lignes uniquement en mode debug

  });
  
}


// Fonction qui détecte l'appui sur une touche
function keyPressed() {
  if (key === 'd' || key === 'D') {
    debugMode = !debugMode; // Active/désactive le mode debug
  }
}
