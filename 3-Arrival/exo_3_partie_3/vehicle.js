class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 3;
    this.maxForce = 0.4;
    this.r = 16;
    this.rayonZoneDeFreinage = 200;

    // Ajouter une nouvelle propriété pour garder la dernière direction
    this.lastHeading = this.vel.heading(); // La direction initiale
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    fill(0, 255, 0);
    circle(target.x, target.y, 16);
    return this.seek(target);
  }

  arrive(target) {
    return this.seek(target, true);  // Le comportement "arriver"
  }

  flee(vehicles) {
    let fleeForce = createVector(0, 0);
    let vehicleMoving = this.vel.mag() > 50; // Vérifie si le véhicule est en mouvement

    // Pour chaque véhicule dans la liste, sauf soi-même
    for (let other of vehicles) {
      if (other === this) continue;

      // Calculer la distance entre les véhicules
      let distance = p5.Vector.dist(this.pos, other.pos);

      // Si la distance est inférieure à un seuil (par exemple, 100), alors fuir
      if (distance < 200 && vehicleMoving) {
        // Calculer la direction de fuite
        let diff = p5.Vector.sub(this.pos, other.pos);  // Différence de position
        diff.normalize();  // Normaliser la direction
        diff.div(distance);  // Plus la distance est petite, plus la force est grande
        fleeForce.add(diff);  // Ajouter cette force à la force de fuite totale
      }
    }

    fleeForce.limit(this.maxForce);  // Limiter la force de fuite pour éviter des mouvements trop brusques
    return fleeForce;
  }

  seek(target, arrival = false) {
    let flee = this.flee(vehicles);  // Obtenir la force de fuite
    let force = p5.Vector.sub(target, this.pos);  // Calcul de la direction vers la cible
    let desiredSpeed = this.maxSpeed;  // Vitesse souhaitée initiale

    if (arrival) {
      let distanceArret = 100;  // Rayon où le véhicule doit s'arrêter

      let distance = force.mag();  // Calculer la distance entre le véhicule et la cible

      // Visualiser la zone de freinage (optionnel)
      noFill();
      stroke(255, 0, 0);
      circle(target.x, target.y, distanceArret * 2);

      // Si la distance est supérieure à la distance d'arrêt, la vitesse reste maximale
      if (distance > distanceArret) {
        desiredSpeed = this.maxSpeed;
      } else {
        // Quand on atteint la zone d'arrêt, la vitesse est mise à 0
        desiredSpeed = 0;
      }
    }

    // Appliquer la direction et la vitesse
    force.setMag(desiredSpeed);
    force.sub(this.vel);  // Calcul de la force de steering
    force.limit(this.maxForce);  // Limiter la force appliquée pour éviter des accélérations trop grandes
    return force;
  }

  // Fonction pour éviter la superposition avec d'autres véhicules
  avoidOthers(vehicles) {
    let repulsionForce = createVector(0, 0);

    for (let other of vehicles) {
      if (other === this) continue;  // Ne pas se comparer à soi-même

      let distance = p5.Vector.dist(this.pos, other.pos);

      if (distance < this.r * 2) {  // Si la distance est inférieure à la distance minimale autorisée
        let diff = p5.Vector.sub(this.pos, other.pos);  // Différence de position entre les deux véhicules
        diff.normalize();
        diff.div(distance);  // Plus la distance est petite, plus la force est grande
        repulsionForce.add(diff);  // Ajouter la force de répulsion
      }
    }

    repulsionForce.limit(this.maxForce);  // Limiter la force pour éviter un écart trop grand
    return repulsionForce;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update(vehicles) {
    let repulsion = this.avoidOthers(vehicles);  // Obtenir la force d'évitement des autres véhicules
    this.applyForce(repulsion);  // Appliquer cette force aux autres forces (par exemple, comportement de freinage)

    this.vel.add(this.acc);  // Ajouter l'accélération à la vélocité
    this.vel.limit(this.maxSpeed);  // Limiter la vitesse maximale
    this.pos.add(this.vel);  // Ajouter la vélocité à la position
    this.acc.set(0, 0);  // Réinitialiser l'accélération

    // Conserver la direction avant l'arrêt, même si la vélocité est nulle
    if (this.vel.mag() > 0) {
      this.lastHeading = this.vel.heading();  // Mémoriser la dernière direction avant l'arrêt
    }
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255);
    stroke(0);
    strokeWeight(2);
    push();
    translate(this.pos.x, this.pos.y);

    // Utiliser la dernière direction au lieu de la direction actuelle
    rotate(this.lastHeading);

    // Dessiner le véhicule sous forme de triangle (flèche)
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill("#F063A4");
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.r * 2);
    pop();
  }
}