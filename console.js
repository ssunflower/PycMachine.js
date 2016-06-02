function Console(cfg) {
    this.config = cfg;
    this.element = document.getElementById(cfg.canvas);
    if (!this.element)
        throw('Console element not found.');

    this.print('>>>');
}
Console.prototype.print = function print(val) {
    if(!this.element) return;
    val += ' ';
    this.element.appendChild(
        document.createTextNode(val));
};

Console.prototype.println = function println (val) {
	if(!val) val = '';
    this.print(val);
    this.element.appendChild(document.createElement('br'));    
};



 this.element.appendChild(document.createElement('br'));