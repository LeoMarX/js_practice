function Ball (options) {
    let { posX = 0, posY = 0 } = options.position;
    this.Radius = options.radius;
    this.color = options.color;
    this.position = { posX, posY };
}
