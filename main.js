class BMICalculator {
  constructor() {
    this._weight = 0;
    this._height = 0;
    this._BMIScore = 0;
    this._ranges = [
      { score: 18.5, color: "#4c6ef5", name: "کمبود وزن" },
      { score: 24.9, color: "#12b886", name: "نرمال" },
      { score: 29.9, color: "#fab005", name: "اضافه وزن" },
      { score: 39.9, color: "#f76707", name: "چاق" },
      { score: 9999, color: "#f03e3e", name: "خیلی چاق" },
    ];
  }
  get BMIScore() {
    return this._BMIScore;
  }
  get range() {
    return this._ranges.find((range) => this._BMIScore < range.score);
  }
  /**
   * Sets the weight and height in the calculator
   * @param {float} weight weight in `kg`
   * @param {float} height height in `m`
   */
  setValues(weight, height) {
    this._weight = weight;
    this._height = height;

    return this;
  }
  calculate() {
    const rawScore = this._weight / this._height ** 2;
    const floatedScore = parseFloat(rawScore.toFixed(1));
    this._BMIScore = floatedScore;

    return this;
  }
}

class BMIUIManager {
  /**
   * @param {string} formElQuery query string of your BMI form
   * @param {BMICalculator} calculator an instance of `BMICalculator`
   */
  constructor({
    formElQuery,
    outputElQuery,
    rangeOutputElQuery,
    scoreOutputElQuery,
    calculator,
  }) {
    const $ = (q) => document.querySelector(q);

    if (!(calculator instanceof BMICalculator))
      throw new Error("calculator should be an instance of BMICalcultor");
    if (typeof formElQuery !== "string")
      throw new Error("formElQuery should be of type `string`");
    if (typeof outputElQuery !== "string")
      throw new Error("outputElQuery should be of type `string`");
    if (typeof rangeOutputElQuery !== "string")
      throw new Error("rangeOutputElQuery should be of type `string`");
    if (typeof scoreOutputElQuery !== "string")
      throw new Error("scoreOutputElQuery should be of type `string`");

    this._form = $(formElQuery);
    this._output = $(outputElQuery);
    this._rangeOutput = $(rangeOutputElQuery);
    this._scoreOutput = $(scoreOutputElQuery);
    this._calculator = calculator;

    this._form.addEventListener("submit", this.handleFormSubmission);
  }
  handleFormSubmission = (e) => {
    e.preventDefault();

    const weightInput = e.target[0];
    const heightInput = e.target[1];

    this._calculator
      .setValues(parseFloat(weightInput.value), parseFloat(heightInput.value))
      .calculate();

    this.showResult();
  };
  showResult = () => {
    this._rangeOutput.innerText = this._calculator.range.name;
    this._rangeOutput.style.background = this._calculator.range.color;

    const scoreEnStr = this._calculator.BMIScore.toString();
    const scoreFaStr = Utilities.toPersianNums(scoreEnStr);
    this._scoreOutput.innerText = scoreFaStr;
    this._scoreOutput.style.background = this._calculator.range.color;
  };
}

class Utilities {
  /**
   * Gets an English number string and converts it to Persian number string
   * @param {*} number
   */
  static toPersianNums(number) {
    return number
      .replace("0", "۰")
      .replace("1", "۱")
      .replace("2", "۲")
      .replace("3", "۳")
      .replace("4", "۴")
      .replace("5", "۵")
      .replace("6", "۶")
      .replace("7", "۷")
      .replace("8", "۸")
      .replace("9", "۹");
  }
}

const calc = new BMICalculator();
const config = {
  formElQuery: "#bmi-form",
  outputElQuery: "#output",
  rangeOutputElQuery: "#range",
  scoreOutputElQuery: "#score",
  calculator: calc,
};
const manager = new BMIUIManager(config);
