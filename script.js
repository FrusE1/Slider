function getTemplateSlider(args) {
  const { min, max, from, to, step } = args;
  return `
  <div class="slider__range range-slider">
    <div class="range-slider__bar">
      <div class="range-slider__indicator"></div>
    </div>
    <div class="range-slider__input">
      <input type="range" data-type="range" data-slider="minus" min="${min}" max="${max}" value="${from}" step="${step}">
      <input type="range" data-type="range" data-slider="plus" min="${min}" max="${max}" value="${to}" step="${step}">
    </div>
  </div>
  <div class="slider__panel slider-panel">
    <div class="slider-panel__step slider-panel__elem">
      <div class="slider-panel__text">Step</div>
      <input type="number" data-slider="step" min="${min}" max="${max}" value="${step}">
    </div>
    <div class="slider-panel__interval_min slider-panel__elem">
      <div class="slider-panel__text">Min</div>
      <input type="number" data-slider="min" min="${min}" max="${max}" value="${min}">
    </div>
    <div class="slider-panel__interval_max slider-panel__elem">
      <div class="slider-panel__text">Max</div>
      <input type="number" data-slider="max" min="${min}" max="${max}" value="${max}">
    </div>
    <div class="slider-panel__interval_min slider-panel__elem">
      <div class="slider-panel__text">From</div>
      <input type="number" data-slider="from" data-interval="from" min="${min}" max="${max}" value="${from}">
    </div>
    <div class="slider-panel__interval_max slider-panel__elem">
      <div class="slider-panel__text">To</div>
      <input type="number" data-slider="to" data-interval="to" min="${min}" max="${max}" value="${to}">
    </div>
    <div class="slider-panel__checkbox slider-panel__elem">
      <label class="slider-panel__text">Vertical
        <input type="checkbox"></input>
      </label>
    </div>
    <div class="slider-panel__checkbox slider-panel__elem">
      <label class="slider-panel__text">Tip
        <input type="checkbox"></input>
      </label>
    </div>
    <div class="slider-panel__checkbox slider-panel__elem">
      <label class="slider-panel__text">Range
        <input type="checkbox"></input>
      </label>
    </div>
  </div>
  `
}


class Slider {

  constructor(selector, options) {
    this.$el = document.querySelector(selector);
    this.min = options.min;
    this.max = options.max;
    this.from = options.from;
    this.to = options.to;
    this.step = options.step;
    this.#render();
    this.HTMLElement = this.getHTMLElement();
    this.indicatorPosition();
    this.changeIndicatorPosition();
    this.changeInputHandler();
    this.defaultValue();
  }

  #render() {
    const items = {
      min: this.min,
      max: this.max,
      from: this.from,
      to: this.to,
      step: this.step
    };
    this.$el.className += ' slider';
    this.$el.innerHTML = getTemplateSlider(items);
  }

  getHTMLElement() {
    return {
      slider: document.querySelector('.range-slider'),
      panel: document.querySelector('.slider-panel'),
      indicatorBody: document.querySelector('.range-slider__indicator'),
      indicatorMin: document.querySelector('[data-slider="minus"]'),
      indicatorMax: document.querySelector('[data-slider="plus"]'),
      step: document.querySelector('[data-slider="step"]'),
      min: document.querySelector('[data-slider="min"]'),
      max: document.querySelector('[data-slider="max"]'),
      from: document.querySelector('[data-slider="from"]'),
      to: document.querySelector('[data-slider="to"]'),
    }
  }

  functionsArray() {
    return {
      min: this.minValue.bind(this),
      max: this.maxValue.bind(this),
      step: this.stepValue.bind(this),
      from: this.fromValue.bind(this),
      to: this.toValue.bind(this),
      indicator: this.indicatorValue.bind(this),
    }
  }

  setValue() {
    const { min, max, step, from, to } = this.HTMLElement;
    const dataElements = document.querySelectorAll('[data-slider]');

    for (let element of dataElements) {
      element.min = this.min = min.value;
      element.max = this.max = max.value;
      if (element.type === 'range') {
        element.step = this.step = step.value;
      }
      if (element.dataset.interval === "from") {
        element.value = this.from = from.value;
      }
      if (element.dataset.interval === "to") {
        element.value = this.to = to.value;
      }
      if (element.dataset.slider === "plus") {
        element.value = this.to = to.value;
      }
      if (element.dataset.slider === "minus") {
        element.value = this.from = from.value;
      }
    }
  }

  indicatorPosition() {
    const { indicatorBody, indicatorMin, indicatorMax } = this.HTMLElement;

    indicatorBody.style.left = `${((indicatorMin.value - this.min) / (this.max - this.min)) * 100}%`;
    indicatorBody.style.right = `${100 - (((indicatorMax.value - this.min) / (this.max - this.min)) * 100)}%`;
  }

  changeIndicatorPosition() {
    const { slider, indicatorMin, indicatorMax, from, to } = this.HTMLElement;

    slider.addEventListener('input', (event) => {
      from.value = this.from = indicatorMin.value;
      to.value = this.to = indicatorMax.value;
      if (event.target.dataset.slider === "minus") {
        this.gapIndicatorMin.bind(this)();
      }
      if (event.target.dataset.slider === "plus") {
        this.gapIndicatorMax.bind(this)();
      }
      this.indicatorPosition.bind(this)();
    })
  }

  changeInputHandler() {
    const { panel } = this.HTMLElement;
    const func = this.functionsArray.bind(this)();
    panel.addEventListener('change', (event) => {
      const { slider } = event.target.dataset;

      if (event.target.dataset.slider === slider) {
        this.defaultValue();
      }
    })
  }

  defaultValue() {
    const func = this.functionsArray.bind(this)();
    for (let key in func) {
      func[key]();
    }
    this.setValue.bind(this)();
    this.indicatorPosition();
  }

  minValue() {
    const { min, max } = this.HTMLElement;
    if (+min.value > (Math.abs(max.value) - this.step)) {
      min.value = Math.abs(max.value) - this.step;
    }
    min.value = Math.round(min.value);
  }

  maxValue() {
    const { min, max } = this.HTMLElement;
    if (max.value < (+min.value + +this.step)) {
      max.value = +min.value + +this.step;
    }
    max.value = Math.round(max.value);
  }

  indicatorValue() {
    const { indicatorMax, indicatorMin, from, to } = this.HTMLElement;
    indicatorMin.value = from.value;
    indicatorMax.value = to.value;
  }

  stepValue() {
    const { step, min, max } = this.HTMLElement;
    if (+step.value >= ((max.value - min.value) / 2)) {
      step.value = (max.value - min.value) / 2;
    }
  }

  toValue() {
    const { min, max, step, from, to } = this.HTMLElement;
    if (+to.value > +max.value) {
      to.value = max.value;
    }
    if (+to.value < (+from.value + +this.step)) {
      to.value = +from.value + +step.value;
    }
    if (+to.value < +min.value) {
      to.value = +min.value + +step.value;
    }
    to.value = Math.round(to.value);
  }

  fromValue() {
    const { min, max, step, from, to } = this.HTMLElement;
    if (+from.value > +max.value) {
      from.value = max.value - step.value;
    }
    if (+from.value > (to.value - this.step)) {
      from.value = to.value - this.step;
    }
    if (+from.value < +min.value) {
      from.value = min.value;
    }
    from.value = Math.round(from.value);
  }

  gapIndicatorMin() {
    const { min, max, indicatorMin, indicatorMax, from, step } = this.HTMLElement;
    if (+indicatorMin.value > indicatorMax.value - ((max.value - min.value) * 0.05)) {
      indicatorMin.value = indicatorMax.value - ((max.value - min.value) * 0.05);
    }
    if (+indicatorMin.value > indicatorMax.value - step.value) {
      indicatorMin.value = indicatorMax.value - step.value;
    }
    this.from = from.value = indicatorMin.value;
  }

  gapIndicatorMax() {
    const { min, max, indicatorMin, indicatorMax, to, step } = this.HTMLElement;
    if (+indicatorMax.value < +indicatorMin.value + ((max.value - min.value) * 0.05)) {
      indicatorMax.value = +indicatorMin.value + ((max.value - min.value) * 0.05);
    }
    if (+indicatorMax.value < +indicatorMin.value + +step.value) {
      indicatorMax.value = +indicatorMin.value + +step.value;
    }
    this.to = to.value = indicatorMax.value;
  }
}



const slider = new Slider('#slider', {
  min: 0,
  max: 1000,
  from: 200,
  to: 900,
  step: 10,
})
