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
    <div class="tip-from"><span>10</span></div>
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
      <input type="number" data-slider="from" min="${min}" max="${max}" value="${from}">
    </div>
    <div class="slider-panel__interval_max slider-panel__elem">
      <div class="slider-panel__text">To</div>
      <input type="number" data-slider="to" min="${min}" max="${max}" value="${to}">
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
      tipFrom: document.querySelector('.tip-from'),
    }
  }

  getObjectFunctions() {
    return {
      min: this.setMinValue.bind(this),
      max: this.setMaxValue.bind(this),
      step: this.setStepValue.bind(this),
      from: this.setFromValue.bind(this),
      to: this.setToValue.bind(this),
      indicator: this.setIndicatorValue.bind(this),
      gapMin: this.calcGapIndicatorMin.bind(this),
      gapMax: this.calcGapIndicatorMax.bind(this),
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
        this.calcGapIndicatorMin.bind(this)();
      }
      if (event.target.dataset.slider === "plus") {
        this.calcGapIndicatorMax.bind(this)();
      }
      this.calcIndicatorPosition.bind(this)();
    })
  }

  handleInputValue() {
    const { panel } = this.sliderElements;
    panel.addEventListener('change', (event) => {
      const { slider } = event.target.dataset;

      if (event.target.dataset.slider === slider) {
        this.defaultValue();
      }
    })
  }

  calcIndicatorPosition() {
    const { indicatorBody, indicatorMin, indicatorMax, tipFrom } = this.sliderElements;

    indicatorBody.style.left = `${((indicatorMin.value - this.min) / (this.max - this.min)) * 100}%`;
    indicatorBody.style.right = `${100 - (((indicatorMax.value - this.min) / (this.max - this.min)) * 100)}%`;
    tipFrom.style.left = `${((indicatorMin.value - this.min) / (this.max - this.min)) * 100}%`;
  }

  defaultValue() {
    const func = this.getObjectFunctions.bind(this)();
    for (let key in func) {
      func[key]();
    }
    this.setValue.bind(this)();
    this.calcIndicatorPosition();
  }

  setMinValue() {
    const { min, max, step } = this.sliderElements;

    const difMaxAndStep = Math.abs(max.value) - this.step

    if (+min.value >= difMaxAndStep) {
      min.value = difMaxAndStep;
    }

    min.value = Math.round(min.value);
  }

  setMaxValue() {
    const { min, max, step } = this.sliderElements;

    const difMinAndStep = +min.value + +this.step;

    if (max.value <= difMinAndStep) {
      max.value = difMinAndStep;
    }

    max.value = Math.round(max.value);
  }

  setIndicatorValue() {
    const { indicatorMax, indicatorMin, from, to } = this.sliderElements;
    indicatorMin.value = from.value;
    indicatorMax.value = to.value;
  }

  setStepValue() {
    const { step, min, max } = this.sliderElements;

    const maxStep = ((max.value - min.value) / 2);

    if (+step.value >= maxStep) {
      step.value = maxStep;
    }

    step.value = Math.abs(step.value);
  }

  setFromValue() {
    const { min, step, from, to } = this.sliderElements;
    if (+from.value > (to.value - step.value)) {
      from.value = to.value - step.value;
    }
    if (+from.value < +min.value) {
      from.value = min.value;
    }
    from.value = Math.round(from.value);
  }

  setToValue() {
    const { max, step, from, to } = this.sliderElements;
    if (+to.value > +max.value) {
      to.value = max.value;
    }
    if (+to.value < (+from.value + +step.value)) {
      to.value = +from.value + +step.value;
    }
    to.value = Math.round(to.value);
  }

  calcGapIndicatorMin() {
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
  }

  calcGapIndicatorMax() {
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
  }
}



const slider = new Slider('#slider', {
  min: 0,
  max: 1000,
  from: 200,
  to: 900,
  step: 10,
})
