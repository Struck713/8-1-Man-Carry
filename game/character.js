/**
 * Character
 * 
 * This is the main character class, it contains character controller
 * logic, along with a movement matrix and a collision matrix.
 */
class Character extends GameObject {

    static INK_DEFAULT_VALUE = 4; // how many shots
    static INK_INCREASE_SECONDS = 1000; // how many milliseconds to increate

    static HEALTH_DEFAULT_VALUE = 4; // player health starting amount
    static HEALTH_BOOST_VALUE = 2;

    static SPEED_DEFAULT_VALUE = 2.5;

    static TAG = "CHARACTER";

    constructor (x, y) {

        // set super tags
        super(x, y, spriteManager.get("Nona"));
        super.collider = true;

        // set game object tags
        this.tag = Character.TAG;

        // player health
        this.health = Character.HEALTH_DEFAULT_VALUE;
        this.tookDamage = false;
        this.damageCoolDown = 0;
        this.isHealthBoosted = false;

        // player speed
        this.speed = Character.SPEED_DEFAULT_VALUE;
        this.isSpeedBoosted = false;
        this.boostTime = 0;

        // character specific traits
        this.mousePosition = createVector(0, 0);
        this.movementMatrix = [ false, false, false, false ];

        this.ink = Character.INK_DEFAULT_VALUE;
        setInterval(() => { if (this.ink < Character.INK_DEFAULT_VALUE) this.ink++ }, Character.INK_INCREASE_SECONDS);
    }

    render () {
        // sprite animation and display
        this.sprite.cycleAnimation();

        this.sprite.show(this.position.x, this.position.y); // show on screen
        this.sprite.angle = atan2(this.mousePosition.y - this.position.y + 8, this.mousePosition.x - this.position.x + 8) - (PI/2); // we add 16 to center the nona and cursor and subtract PI/2  
        
        // damage management
        if(this.tookDamage) this.loseHealth();
        if(this.damageCoolDown > 0) --this.damageCoolDown;

        // movement
        let movement = createVector(0, 0);
        if (this.movementMatrix[0]) movement.y -= 1;
        if (this.movementMatrix[1]) movement.y += 1;
        if (this.movementMatrix[2]) movement.x -= 1;
        if (this.movementMatrix[3]) movement.x += 1;

        this.setSpeed(movement);

        // collison check
        let copy = this.position.copy();
        copy.add(movement);
        if (roomManager.room.willCollide(copy)) return;

        this.position = copy;
    }

    onCollision(other) {
        if (!(other instanceof Enemy)) return;
        this.loseHealth();
    }

    fireParticle() {
        if (this.ink <= 0) return;
        this.ink--;

        gameManager.queue(new OilAttack(this.position.x, this.position.y, this.sprite.angle));
    }

    setSpeed(movement){
        if(this.boostTime <= 0)
            this.isSpeedBoosted = false;
        else
            --this.boostTime;
        
        if(this.isSpeedBoosted)
            movement.setMag(this.speed * 2);  //boosted speed
        else
            movement.setMag(this.speed); // normal speed
    }

    loseHealth() {
        if(this.damageCoolDown <= 0 && this.health > 0){
            --this.health;
            this.damageCoolDown = 120;
        }
        else
            --this.damageCoolDown;
        this.tookDamage = false;
    }

    // event stuff
    keyPressed(code, pressed) {
        switch (code.toUpperCase()) {
            case 'W':
            case 'ARROWUP':
                this.movementMatrix[0] = pressed;
                break;
            case 'S':
            case 'ARROWDOWN':
                this.movementMatrix[1] = pressed;
                break;
            case 'A':
            case 'ARROWLEFT':
                this.movementMatrix[2] = pressed;
                break;
            case 'D':
            case 'ARROWRIGHT':
                this.movementMatrix[3] = pressed;
                break;
            case 'R':
                this.tookDamage = true;
                break;
            default:
                break;
        }
    }
   
    mouseMovement(x, y) {
        this.mousePosition.x = x;
        this.mousePosition.y = y;
    }

    mouseClicked(type) {
        switch (type) {
            case 0:
                this.fireParticle();
            case 1:
                // middle click
            case 2:
                // right click
        }
    }

}

class OilAttack extends GameObject {

    constructor (x, y, direction) {
        super(x, y, spriteManager.get("laserShark"));
        super.collider = true;
        this.direction = direction;
    }

    onCollision(other) {
        if (!(other instanceof Enemy)) return;
        this.destroy();
    }

    render() {
        this.sprite.show(this.position.x, this.position.y);

        let angleVector = p5.Vector.fromAngle(this.direction + (PI / 2));
        angleVector.setMag(3.5); //speed
        this.position.add(angleVector);
    }
    
}
