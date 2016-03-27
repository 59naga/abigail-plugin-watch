// dependencies
import AsyncEmitter from 'carrack';
import sinon from 'sinon';
import assert from 'power-assert';
import stripAnsi from 'strip-ansi';

// target
import Watch from '../src';

// specs
describe('', () => {
  it('should start the task instead of parent(abigail)', () => {
    // const launch
    const emitter = new AsyncEmitter;
    const watch = new Watch(emitter);
    watch.setProps({
      plugins: {
        launch: {
          launch: sinon.spy(),
        },
      },
    });

    return emitter.emit('attach-plugins')
    .then(() => {
      assert(watch.getProps().plugins.launch.launch.calledOnce);
    });
  });

  it('when detects a change, should start the task unless running', () => {
    const emitter = new AsyncEmitter;
    const watch = new Watch(emitter);
    watch.setProps({
      plugins: {
        launch: {
          launch: sinon.spy(),
        },
      },
    });

    setTimeout(() => {watch.onChange();});

    return emitter.emit('attach-plugins')
    .then(() => {
      assert(watch.getProps().plugins.launch.launch.calledOnce);

      setTimeout(() => {watch.onChange();}, 1);
      setTimeout(() => {watch.onChange();}, 10);

      return watch.onChange();
    })
    .then(() => {
      assert(watch.getProps().plugins.launch.launch.calledTwice);
    });
  });

  it('when the task is completed, should be notify of the watch locations', () => {
    const emitter = new AsyncEmitter;
    const logEvent = sinon.spy();
    emitter.on('log', logEvent);

    const watch = new Watch(emitter);// eslint-disable-line no-unused-vars
    watch.setProps({
      plugins: {
        launch: {
          launch: sinon.spy(),
        },
      },
    });
    return emitter.emit('attach-plugins')
    .then(() => {
      assert(logEvent.calledOnce);

      const notifyMessage = stripAnsi(logEvent.args[0][0]);
      assert(notifyMessage === `... watch at ${watch.opts.value.join(', ')}.`);
    });
  });
});
