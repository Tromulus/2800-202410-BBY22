

function Gravity(id) {
    var that = this;
    var element = document.getElementById(id);
    var originalText = element.textContent;
    var arr = originalText.split('');

    this.clickCount = 0;  // Initialize click count
    this.animate = false;  // Start with no animation
    this.floating = false;  // No floating initially
    this.resetTime = 0;

    this.positionType = getComputedStyle(element).position;

    this.lerp = function (e, t, i) {
        return (1 - i) * e + i * t;
    };

    this.useBound = element.hasAttribute("data-bound") && element.dataset.bound === "true";

    this.colors = [
        '#f44336','#e91e63','#9c27b0',
        '#673ab7','#3f51b5','#2196f3',
        '#03a9f4','#00bcd4','#009688',
        '#4caf50','#8bc34a','#cddc39',
        '#ffeb3b','#ffc107','#ff9800',
        '#ff5722','#795548','#9e9e9e',
        '#607d8b'
    ];

    this.randomColor = function() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    };

    function createSpan(text) {
        var span = document.createElement('span');
        span.textContent = text;
        span.style.position = "relative";
        span.style.display = "inline-block";
        span.style.minWidth = "10px";
        span.style.color = that.randomColor();
        span._own = {
            pos: { x: 0, y: 0 },
            vel: { x: -0.5 + Math.random(), y: -0.5 + Math.random() },
            speed: { x: 1, y: 1 },
            dir: { x: 1, y: 1 }
        };
        return span;
    }

    this.textSpans = [];
    
    this.setupText = function() {
        element.innerHTML = '';
        arr.forEach(function(char) {
            var el = createSpan(char);
            element.appendChild(el);
            that.textSpans.push(el);
        });
        this.getDim();
    };

    this.restoreOriginalText = function() {
        element.textContent = originalText; // Restore original text
        this.textSpans = [];
        this.animate = false;
        this.floating = false;
    };

    this.toggleState = function() {
        this.clickCount++;
        if (this.clickCount === 1) {
            this.floating = true;
            this.animate = true;
            this.setupText();
        } else if (this.clickCount === 2) {
            this.restoreOriginalText();
        } else if (this.clickCount === 3) {
            window.location.href = '/surprise'; // Redirect to another page
        }
    };

    var icon = document.getElementById('reset');
    icon.addEventListener('click', function() {
        that.toggleState();
    });

    this.update = function() {
        if (!this.animate) return;
        this.textSpans.forEach(function(span) {
            if (span._own.pos.x + span.offsetLeft < 0 || span._own.pos.x + span.offsetLeft > window.innerWidth) {
                span._own.dir.x *= -1;
            }
            if (span._own.pos.y + span.offsetTop < 0 || span._own.pos.y + span.offsetTop > window.innerHeight) {
                span._own.dir.y *= -1;
            }
            span._own.pos.x += span._own.vel.x * span._own.speed.x * span._own.dir.x;
            span._own.pos.y += span._own.vel.y * span._own.speed.y * span._own.dir.y;
            span.style.transform = `translate(${span._own.pos.x}px, ${span._own.pos.y}px)`;
        });
    };

    function render() {
        requestAnimationFrame(render);
        that.update();
    }

    render();
}

new Gravity('text'); // Initialize the Gravity functionality



