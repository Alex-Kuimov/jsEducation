/**
 * 1. Наследование происходит с помощью extends, а расширение методов с помощью вызова super()(для конструктора) и super['methodName']()(для метода)
 * 2. В стрелочных функциях нет super()
 * */

class AccordionExtended extends Accordion {
  constructor(options = {}) {
    super(options);
  }

  _createOptions(options) {
    super._createOptions(options);

    console.log(`Привет из ${this.constructor.name}! Здесь расширяю метод "_createOptions"`);
  }
}