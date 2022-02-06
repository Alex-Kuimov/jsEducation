/**
 * 1. Методы класса enumerable = false
 * 2. Вызов без new не прокатит
 * 3. "use strict"
 * */

class Accordion {
  constructor(options = {}) {
    this._init(options);
  }

  _init(options) {
    this._createOptions(options);

    const testOptions = this._testRequiredOptions([
      'id',
    ]);

    if (!testOptions) {
      console.error(`Не переданы обязательные поля для инициализации модуля ${this.constructor.name}`);
      return;
    }

    this._createNamespace();
    this._createNodes();

    if (!this.coverNode) {
      return;
    }

    this.switchData = {};
    this._changeEventListener('add');
  }

  _createOptions(options) {
    const defaultOptions = {
      id: null,
      single: true,
      afterSwitch: null,
      beforeSwitch: null,
    }

    this.options = { ...defaultOptions, ...options };
  }

  _createNamespace() {
    const blockName = 'accordion';

    this.attrs = {
      cover: blockName,
      head: `${blockName}__head`,
      body: `${blockName}__body`,
      content: `${blockName}__content`,
      contentActive: `${blockName}__content_active`,
    };
  }

  _createNodes() {
    this.coverNode = document.getElementById(this.options.id);
    this.contentNodes = this.coverNode ? [...this.coverNode.querySelectorAll(`.${this.attrs.content}`)] : [];
  }

  _changeEventListener(method) {
    this.coverNode[`${method}EventListener`]('click', this._clickListener);
  }

  _testRequiredOptions(kwargs = []) {
    let resultData = true;

    for (const key of kwargs) {
      if (!this.options[key]) {
        resultData = false;
        break;
      }
    }

    return resultData;
  }

  _getTypeObject = (object) => ({}.toString.call(object).slice(8, -1).toLowerCase())

  _clickListener = (event) => {
    event.preventDefault();

    const headNode = event.target.closest(`.${this.attrs.head}`);

    if (!headNode) {
      return;
    }

    const contentNode = headNode.closest(`.${this.attrs.content}`);

    if (!contentNode || !this.contentNodes.length) {
      return;
    }

    const contentIndex = this.contentNodes.findIndex(node => node === contentNode);
    const contentIsActive = contentNode.classList.contains(this.attrs.contentActive);
    const method = contentIsActive ? '_hide' : '_show';
    const { beforeSwitch } = this.options;

    this.switchData = {
      method,
      contentNode,
      contentIndex,
    };

    if (this._getTypeObject(beforeSwitch) === 'function') {
      beforeSwitch({
        action: this.switchData.method,
        next: this._next,
        nodes: {
          content: contentNode,
          head: contentNode.querySelector(`.${this.attrs.head}`),
          body: contentNode.querySelector(`.${this.attrs.body}`),
        },
        contentIndex,
      });

      return;
    }

    this._next();
  }

  _next = () => {
    const { method, contentIndex } = this.switchData;

    if (this.options.single) {
      this._switchAll('remove');
    }

    this[method](contentIndex);
  }

  _switch = (position = 0, method = '') => {
    this.contentNodes[position].classList[method](this.attrs.contentActive);

    const { afterSwitch } = this.options;

    if (this._getTypeObject(afterSwitch) === 'function') {
      const { method, contentIndex, contentNode } = this.switchData;

      afterSwitch({
        action: method,
        contentIndex: contentIndex,
        nodes: {
          content: contentNode,
          head: contentNode.querySelector(`.${this.attrs.head}`),
          body: contentNode.querySelector(`.${this.attrs.body}`),
        },
      });
    }
  }

  _show = (position = 0) => {
    if (typeof position !== 'number') {
      console.error(`Не передано обязательное поле "position" в модуле ${this.constructor.name}`);
      return;
    }

    this._switch(position, 'add');
  }

  _hide = (position = 0) => {
    if (typeof position !== 'number') {
      console.error(`Не передано обязательное поле "position" в модуле ${this.constructor.name}`);
      return;
    }

    this._switch(position, 'remove');
  }

  _switchAll = (method = '') => {
    this.contentNodes.forEach(node => {
      node.classList[method](this.attrs.contentActive);
    });
  }
}