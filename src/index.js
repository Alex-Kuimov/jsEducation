/**
 * 1. Событийный цикл(event loop)
 * 1.1 Микрозадачи
 * 1.2 Макрозадачи
 * 1.3 Promise
 * 1.4 setTimeout
 * 1.5 setInterval
 * 1.6 performance
 * 1.7 Работа с событиями
 *
 * 2. Наследование и контекст
 * 2.1 prototype
 * 2.2 call
 * 2.4 apply
 * 2.5 bind
 * 2.3 стрелочные функции
 *
 * 3. Организация кода
 * */

/**
 * function declaration:
 * function test() {}
 *
 * function expression:
 * const test = function() {} || const test = () => {};
 * */

document.addEventListener('DOMContentLoaded', contentLoadedListener);

/**
 * EventLoop
 * */

function callEventLoopTest() {
  /**
   * EventLoop. JS - 1 поток.
   * Основная задача - наблюдать за стеком и очередью. Если стек пуст - цикл берет 1 элемент из очереди и помещает в стек
   * --------------------------------------------------------------------------
   * 1. Микрозадачи приходят только из кода(v8 движок)(куча, стек)(очередь - LIFO)
   * 2. Макрозадачи - WebAPI(setTimeout, click, AJAX)(очередь - FIFO)
   * 3. task queue(очередь - FIFO)
   * 4. render queue(наиболее высокий приоритет)(RAF => Style => Layout => Paint)
   * --------------------------------------------------------------------------
   *
   * https://www.youtube.com/watch?v=cCOL7MC4Pl0
   * https://www.youtube.com/watch?v=8aGhZQkoFbQ
   *
   * Последовательность:
   * Script => micro(v8) => render => macro(WebAPI) => micro(v8) => render => ...
   * Такая последовательность гарантирует, что общее окружение остается неизменным(курсор мыши на месте, новые данные не получены и т.д)
   * */

  let a = 5;

  setTimeout(() => { // macro
    console.log(a, 'From Timeout');
    a = 10;
  });

  const promise = new Promise((resolve) => { // stream
    console.log(a, 'From Promise');
    a = 25;
    resolve();
  });

  promise.then(() => { // micro
    console.log(a, 'From then');
  });

  console.log(a, 'From Stream');
}

/**
 * Render
 * */

function createBoxAnimationListener() {
  document.addEventListener('click', boxAnimationListener);
}

function boxAnimationListener({ target }) {
  const containerTarget = target.closest('.animation-box');

  if (!containerTarget) {
    return;
  }

  const box = containerTarget.querySelector('.animation-box__box');
  const button = containerTarget.querySelector('.animation-box__button');

  if (!(box && button)) {
    return;
  }

  const transformValue = 300;
  const boxTarget = target.closest('.animation-box__box');
  const buttonTarget = target.closest('.animation-box__button');

  if (buttonTarget) {
    box.style.transform = `translateX(${transformValue * 2}px)`;

    setTimeout(() => {
      box.style.transform = `translateX(${transformValue}px)`;
    }, 1000);

    return;
  }

  if (boxTarget) {
    box.style.transform = '';
  }
}

/**
 * Call, Apply, Bind, () => {}
 * */

function callFunctionUsedContext() {
  const context = {
    firstName: 'Юзверь',
    lastName: 'Юзверевич',
    skills: ['js', 'ts', 'vue'],
    showSkills() {
      this.skills.forEach(function(skill) {
        console.log(`${this.firstName} has skill - ${skill}`);
      });
    },
    showSkillsArr() {
      this.skills.forEach(skill => {
        console.log(`${this.firstName} has skill - ${skill}`);
      });
    },
  }

  const numberValue = 52;
  const stringValue = 'string';

  // oops

  // showData();

  // function expression(функция создастся после того, как интерпретатор дойдет до строки "const showData = function(numb, str, callWith) {")

  const showData = function(numb, str, callWith) {
    console.log({
      callWith,
      firstName: this.firstName,
      lastName: this.lastName,
      numberValue: numb,
      stringValue: str,
    });
  }

  // function declaration(initialization)

  // function showData(numb, str, callWith) {
  //   console.log({
  //     callWith,
  //     firstName: this.firstName,
  //     lastName: this.lastName,
  //     numberValue: numb,
  //     stringValue: str,
  //   });
  // }

  showData(numberValue, stringValue, '');

  showData.call(context, numberValue, stringValue, 'call');

  // showData.apply(context, [numberValue, stringValue, 'apply']);

  // const showDataBound = showData.bind(context);

  // showDataBound(numberValue, stringValue, 'bind1');
  // showDataBound(numberValue, stringValue, 'bind2');

  // context.showSkills();
  // context.showSkillsArr();
}

/**
 * Prototype
 * */

function createPrototypeForFn() {
  /**
   * __proto__
   * Существует по историческим причинам(геттер/сеттер) для prototype
   * Лучше использовать Object.getPrototypeOf/Object.setPrototypeOf
   *
   * Цепочка наследования:
   * Array => Array.prototype(.forEach(), .map(), .push(), ...) => Object.prototype(.toString(), .hasOwnProperty(), ...) => null
   *
   * Примитивы имеют обертку => поэтому доступны методы для них
   *
   * new String(), new Boolean(), new Number()
   *
   * null и undefined оберток не имеют
   *
   * */

  const baseProtoData = { // создаем базовый список
    name: null,
    skills: ['php', 'python'],
  };

  const secondProtoData = { // расширяем базовый список, но наследуем сложные структуры
    ...baseProtoData,
    gender: 'man',
  };

  baseProtoData.status = 'middle'; // в процессе работы модифицируем базовый список

  function User({ name = '', skills = [] } = {}) { // создаем функцию-конструктор
    this.name = name;
    this.skills = [ ...this.skills, ...skills  ];
  }

  User.prototype = { ...baseProtoData }; // расширяем базовый прототип "кастомным"

  const igor = new User({
    name: 'Игорь',
    skills: ['html', 'css'],
  });

  const alex = new User({
    name: 'Алекс',
  });

  console.log(igor);

  igor.skills.push('js');

  console.log(igor);
  console.log(igor.status);

  Object.setPrototypeOf(alex, secondProtoData);

  console.log(alex);
}

/**
 * Оператор опциональной последовательности(?.)
 * Больше информации и примеров - https://learn.javascript.ru/optional-chaining
 * Can I use(support) - https://caniuse.com/?search=optional%20chain
 * */

function createOptionalChainingOperator() {
  const data = {
    firstLevel: {
      secondLevel: {
        boolean: true,
      },
    },
  };

  console.log(data.firstLevel.secondLevel.boolean); // Сработает
  // console.log(data.firstLevel.thirdLevel.boolean); // Ошибка
  console.log(data.firstLevel.thirdLevel && data.firstLevel.thirdLevel.boolean) // Способ нивелировать ошибку, но более громоздкий
  console.log(data.firstLevel.thirdLevel?.boolean); // Нивелирую ошибку выше с помощью ?.
}

/**
 * Организация кода
 * */

function createFirstAccordion() {
  new Accordion({
    id: 'accordion1',
    single: false,
    beforeSwitch (hookData) {
      const { nodes, action, next, contentIndex } = hookData;

      if (action === '_show') {
        if (nodes.body.innerHTML !== '') {
          next();
          return;
        }

        fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify({
            userId: contentIndex,
            body: `body ${contentIndex}`,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        }).then(response => response.json()).then(({ body }) => {
          nodes.body.innerHTML = body;
          next();
        });

        return;
      }

      next();
    },
    afterSwitch(data) {
      console.log(data)
    }
  });
}

function createSecondAccordion() {
  new Accordion({
    id: 'accordion2',
    single: true,
  });
}

function createThirdAccordion() {
  new AccordionExtended({
    id: 'accordion3',
    single: true,
    beforeSwitch({ next }) {
      console.log('Hook "beforeSwitch" from "createThirdAccordion"');
      next();
    }
  });
}

/**
 * DeepMerge - описать можно, но не вижу в этом большой необходимости, так как есть готовые реализации
 * К тому же они покрывают гораздо больше кейсов(array и object)
 * Во время реализации необходимо так же учитывать состояние объекта(Object.freeze например или сливать ли поля прототипа). Есть подводные камни
 *
 * Пример реализации - https://www.npmjs.com/package/deepmerge
 * Или - https://www.npmjs.com/package/merge-deep
 *
 * Если есть необходимость базового слияния - достаточно использовать оператор spread( [ ...array ] || { ...object } )
 *
 * */

/**
 * DOMContentLoaded
 * */

function contentLoadedListener() {
  // callEventLoopTest();
  // createBoxAnimationListener();
  // callFunctionUsedContext();
  // createPrototypeForFn();
  // createFirstAccordion();
  // createSecondAccordion();
  // createThirdAccordion();
  // createOptionalChainingOperator();
}