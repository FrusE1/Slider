function getTemplateSlider(args) {
  const [min, max, from, to, step] = args;
  return `
  <div class="slider__range range-slider">
    <div class="range-slider__bar">
      <div class="range-slider__progress"></div>
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
    this.HTMLElement = this.getHTMLElement();
    this.changeIndicatorPosition();
    this.defaultIndicatorPosition();
    this.defaultRangePosition();
    this.showValueInterval();
    this.changeValueByEvent();
  }

  #render() {
    const items = [this.min, this.max, this.from, this.to, this.step]
    this.$el.className += ' slider';
    this.$el.innerHTML = getTemplateSlider(items);
  }

  getHTMLElement() {
    return {
      slider: document.querySelector('.range-slider'),
      sliderPanel: document.querySelector('.slider-panel'),
      sliderProgress: document.querySelector('.range-slider__progress'),
      rangeMin: document.querySelector('[data-slider="minus"]'),
      rangeMax: document.querySelector('[data-slider="plus"]'),
      stepSlider: document.querySelector('[data-slider="step"]'),
      sliderMin: document.querySelector('[data-slider="min"]'),
      sliderMax: document.querySelector('[data-slider="max"]'),
      rangeSliderFrom: document.querySelector('[data-slider="from"]'),
      rangeSliderTo: document.querySelector('[data-slider="to"]'),
    }
  }

  setValue() {
    const { rangeMin, rangeMax, stepSlider, sliderMin, sliderMax, rangeSliderFrom, rangeSliderTo } = this.HTMLElement;

    this.min = rangeMin.min = rangeMax.min = sliderMin.value;
    this.max = rangeMin.max = rangeMax.max = sliderMax.value;
    this.step = rangeMin.step = rangeMax.step = stepSlider.value;
    this.from = rangeSliderFrom.value;
    this.to = rangeSliderTo.value;
    rangeMin.value = rangeSliderFrom.value;
    rangeMax.value = rangeSliderTo.value;
  }

  changeIndicatorPosition() {
    const { slider, sliderProgress, rangeMin, rangeMax } = this.HTMLElement;

    slider.addEventListener('input', () => {
      // Вычисление левого положения индикатора
      sliderProgress.style.left = `${((rangeMin.value - this.min) / (this.max - this.min)) * 100}%`;
      // Вычисление правого положения индикатора
      sliderProgress.style.right = `${100 - (((rangeMax.value - this.min) / (this.max - this.min)) * 100)}%`;
    })
  }

  changeValueByEvent() {
    const { sliderPanel, stepSlider, sliderMin, sliderMax, rangeSliderFrom, rangeSliderTo } = this.HTMLElement;

    sliderPanel.addEventListener('change', (event) => {
      const { slider } = event.target.dataset;

      if (slider === "min") {
        this.setValue();
      } else if (slider === "max") {
        this.setValue();
      } else if (slider === "from") {
        this.setValue();
      } else if (slider === "to") {
        this.setValue();
      } else if (slider === "step") {
        this.setValue();
      }

      this.defaultIndicatorPosition();
    })
  }

  defaultIndicatorPosition() {
    const { sliderProgress, rangeSliderFrom, rangeSliderTo } = this.HTMLElement;

    sliderProgress.style.left = `${((rangeSliderFrom.value - this.min) / (this.max - this.min)) * 100}%`;
    sliderProgress.style.right = `${100 - (((rangeSliderTo.value - this.min) / (this.max - this.min)) * 100)}%`;
  }

  defaultRangePosition() {
    const { rangeMin, rangeMax, rangeSliderFrom, rangeSliderTo } = this.HTMLElement;

    rangeMin.value = rangeSliderFrom.value;
    rangeMax.value = rangeSliderTo.value;
  }

  showValueInterval() {
    const { rangeMin, rangeMax, rangeSliderFrom, rangeSliderTo, slider } = this.HTMLElement;

    slider.addEventListener('input', () => {
      rangeSliderFrom.value = this.from = rangeMin.value;
      rangeSliderTo.value = this.to = rangeMax.value;
    })
  }

}



const slider = new Slider('#slider', {
  min: 0,
  max: 1000,
  from: 200,
  to: 900,
  step: 10,
})
