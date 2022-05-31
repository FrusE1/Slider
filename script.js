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
    this.sliderElements = this.getSliderElements();
    this.calcIndicatorPosition();
    this.handleIndicatorPosition();
    this.handleInputValue();
    this.defaultValue();
  }

  #render() {
    const items = {
      min: this.min,
      max: this.max,
      from: this.from,
      to: this.to,
      step: this.step,
    };
    this.$el.className += ' slider';
    this.$el.innerHTML = getTemplateSlider(items);
  }

  getSliderElements() {
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

  getObjectFunctions() {
    return {
      min: this.minValue.bind(this),
      max: this.maxValue.bind(this),
      step: this.stepValue.bind(this),
      from: this.fromValue.bind(this),
      to: this.toValue.bind(this),
      indicator: this.indicatorValue.bind(this),
      gapMin: this.gapIndicatorMin.bind(this),
      gapMax: this.gapIndicatorMax.bind(this),
    }
  }

  setValue() {
    const { min, max, step } = this.sliderElements;

    const dataElements = document.querySelectorAll('[data-slider]');

    for (let element of dataElements) {
      element.min = this.min = min.value;
      element.max = this.max = max.value;

      if (element.type === 'range') {
        element.step = this.step = step.value;
      }
    }
  }

  handleIndicatorPosition() {
    const { slider, indicatorMin, indicatorMax, from, to } = this.sliderElements;

    slider.addEventListener('input', (event) => {
      from.value = this.from = indicatorMin.value;
      to.value = this.to = indicatorMax.value;
      if (event.target.dataset.slider === "minus") {
        this.gapIndicatorMin.bind(this)();
      }
      if (event.target.dataset.slider === "plus") {
        this.gapIndicatorMax.bind(this)();
      }
      this.calcIndicatorPosition.bind(this)();
    })
  }

  handleInputValue() {
    const { panel } = this.sliderElements;
    const func = this.getObjectFunctions.bind(this)();
    panel.addEventListener('change', (event) => {
      const { slider } = event.target.dataset;

      if (event.target.dataset.slider === slider) {
        this.defaultValue();
      }
    })
  }

  calcIndicatorPosition() {
    const { indicatorBody, indicatorMin, indicatorMax } = this.sliderElements;

    indicatorBody.style.left = `${((indicatorMin.value - this.min) / (this.max - this.min)) * 100}%`;
    indicatorBody.style.right = `${100 - (((indicatorMax.value - this.min) / (this.max - this.min)) * 100)}%`;
  }

  defaultValue() {
    const func = this.getObjectFunctions.bind(this)();
    for (let key in func) {
      func[key]();
    }
    this.setValue.bind(this)();
    this.calcIndicatorPosition();
  }

  minValue() {
    const { min, max, step } = this.sliderElements;
    if (+min.value > (Math.abs(max.value) - step.value)) {
      min.value = Math.abs(max.value) - step.value;
    }
    min.value = Math.round(min.value);
    this.min = min.value;
  }

  maxValue() {
    const { min, max, step } = this.sliderElements;
    if (max.value < (+min.value + +step.value)) {
      max.value = +min.value + +step.value;
    }
    max.value = Math.round(max.value);
    this.max = max.value;
  }

  indicatorValue() {
    const { indicatorMax, indicatorMin, from, to } = this.sliderElements;
    indicatorMin.value = from.value;
    indicatorMax.value = to.value;
  }

  stepValue() {
    const { step, min, max } = this.sliderElements;

    const maxStepValue = ((max.value - min.value) / 2);

    if (+step.value >= maxStepValue) {
      step.value = maxStepValue;
    }
  }

  fromValue() {
    const { min, step, from, to } = this.sliderElements;
    if (+from.value > (to.value - step.value)) {
      from.value = to.value - step.value;
    }
    if (+from.value < +min.value) {
      from.value = min.value;
    }
    from.value = Math.round(from.value);
  }

  toValue() {
    const { max, step, from, to } = this.sliderElements;
    if (+to.value > +max.value) {
      to.value = max.value;
    }
    if (+to.value < (+from.value + +step.value)) {
      to.value = +from.value + +step.value;
    }
    to.value = Math.round(to.value);
    this.to = to.value;
  }

  gapIndicatorMin() {
    const { min, max, indicatorMin, indicatorMax, from, step } = this.sliderElements;

    const gapValue = indicatorMax.value - ((max.value - min.value) * 0.05);
    const gapStep = indicatorMax.value - step.value;

    if (+indicatorMin.value > gapValue) {
      indicatorMin.value = gapValue;
    }
    if (+indicatorMin.value > gapStep) {
      indicatorMin.value = gapStep;
    }

    from.value = indicatorMin.value;
    this.from = from.value;
  }

  gapIndicatorMax() {
    const { min, max, indicatorMin, indicatorMax, to, step } = this.sliderElements;

    const gapValue = +indicatorMin.value + ((max.value - min.value) * 0.05);
    const gapStep = +indicatorMin.value + +step.value;

    if (+indicatorMax.value < gapValue) {
      indicatorMax.value = gapValue;
    }
    if (+indicatorMax.value < gapStep) {
      indicatorMax.value = gapStep;
    }

    to.value = indicatorMax.value;
    this.to = to.value;
  }
}



const slider = new Slider('#slider', {
  min: 0,
  max: 1000,
  from: 200,
  to: 900,
  step: 10,
})
