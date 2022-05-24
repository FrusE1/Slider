function getTemplateSlider(args) {
  const [min, max, from, to, step] = args;
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
    this.showValueIndicatorValue();
    this.changeValueByEvent();
  }

  #render() {
    const items = [this.min, this.max, this.from, this.to, this.step];
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

  setValue() {
    const { indicatorMin, indicatorMax, step, min, max, from, to } = this.HTMLElement;

    this.min = indicatorMin.min = indicatorMax.min = min.value;
    this.max = indicatorMin.max = indicatorMax.max = max.value;
    this.step = indicatorMin.step = indicatorMax.step = Math.abs(step.value);
    indicatorMin.value = from.value;
    indicatorMax.value = to.value;

    if (!this.isFromValueLargeMin()) {
      this.from = from.value = this.min;
    } else {
      this.from = from.value;
    }

    if (this.isToValueLargeMax()) {
      this.to = to.value = this.max;
    } else {
      this.to = to.value;
    }

    if (this.isStepLargeMax()) {
      step.value = Math.abs(this.max);
    } else {
      step.value = Math.abs(step.value);
    }
  }

  isFromValueLargeMin() {
    const { from } = this.HTMLElement;
    return +from.value > +this.min;
  }
  isToValueLargeMax() {
    const { to } = this.HTMLElement;
    return +to.value > +this.max;
  }
  isStepLargeMax() {
    const { step } = this.HTMLElement;
    return Math.abs(step.value) > Math.abs(this.max);
  }

  changeIndicatorPosition() {
    const { slider, indicatorBody, indicatorMin, indicatorMax } = this.HTMLElement;

    slider.addEventListener('input', (event) => {
      this.indicatorGap(event);
      indicatorBody.style.left = `${((indicatorMin.value - this.min) / (this.max - this.min)) * 100}%`;
      indicatorBody.style.right = `${100 - (((indicatorMax.value - this.min) / (this.max - this.min)) * 100)}%`;
    })
  }

  indicatorGap(event) {
    const { indicatorMin, indicatorMax } = this.HTMLElement;
    if (this.isIndicatorGap()) {
      if (event.target.dataset.slider == "minus") {
        indicatorMin.value = +indicatorMax.value - (this.max * 0.05);
      } else if (event.target.dataset.slider == "plus") {
        indicatorMax.value = +indicatorMin.value + (this.max * 0.05);
      }
    }
  }

  isIndicatorGap() {
    const { indicatorMin, indicatorMax } = this.HTMLElement;
    return ((indicatorMax.value - indicatorMin.value) / (this.max - this.min)) * 100 < 5;
  }

  changeValueByEvent() {
    const { panel } = this.HTMLElement;

    panel.addEventListener('change', (event) => {
      const { slider } = event.target.dataset;

      if (event.target.dataset.slider === slider) {
        this.setValue();
        this.defaultIndicatorPosition();
      }

    })
  }

  defaultIndicatorPosition() {
    const { indicatorBody, from, to } = this.HTMLElement;

    indicatorBody.style.left = `${((from.value - this.min) / (this.max - this.min)) * 100}%`;
    indicatorBody.style.right = `${100 - (((to.value - this.min) / (this.max - this.min)) * 100)}%`;
  }

  showValueIndicatorValue() {
    const { indicatorMin, indicatorMax, from, to, slider } = this.HTMLElement;

    slider.addEventListener('input', () => {
      from.value = this.from = indicatorMin.value;
      to.value = this.to = indicatorMax.value;
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
