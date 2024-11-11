class Vehicle {
  constructor(x, y,randomColor) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 3;
    this.maxForce = 0.4;
    this.r = 4;
    this.rayonZoneDeFreinage = 200;
    this.color = randomColor;
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
    // 2nd argument true enables the arrival behavior
    return this.seek(target, true);
  }

flee(target) {
    // Calculer la distance entre le véhicule et la cible
    let desired = p5.Vector.sub(this.pos, target);
    let distance = desired.mag();

    // Si la cible est à une distance trop grande, ne rien faire (ne pas fuir)
    let rayonFuite = 100;  // Zone dans laquelle le véhicule commence à fuir
    if (distance > rayonFuite) {
        return createVector(0, 0);  // Pas de fuite si la cible est trop loin
    }

    // Calculer la force de fuite (dans la direction opposée à la cible)
    desired.setMag(this.maxSpeed);
    let fleeForce = p5.Vector.sub(desired, this.vel);
    fleeForce.limit(this.maxForce);

    return fleeForce;
}

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    
    if (arrival) {
      // Rayon de freinage
      let rayonFreinage = 100;

      // Dessiner un cercle autour de la cible pour visualiser la zone de freinage
      noFill();
      stroke(255, 0, 0);
      //circle(target.x, target.y, rayonFreinage * 2);

      // Calculer la distance entre le véhicule et la cible
      let distance = force.mag();

      // Si la distance est inférieure au rayon de freinage, on réduit la vitesse
      if (distance < rayonFreinage) {
        desiredSpeed = map(distance, 0, rayonFreinage, 0, this.maxSpeed);
      }
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255);
    stroke(0);
    strokeWeight(2);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    //triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    fill(this.color);
    circle(0, 0, this.r * 2);
    
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

