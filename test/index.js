// dependencies
import AsyncEmitter from 'carrack';
import sinon from 'sinon';
import assert from 'power-assert';
import stripAnsi from 'strip-ansi';

// target
import Watch from '../src';

// environment
const disableWatcher = {
  watcher: false,
};

// specs
describe('', () => {
  it('should start the task instead of parent(abigail)', () => {
    const emitter = new AsyncEmitter;
    emitter.set = sinon.spy();
    emitter.start = sinon.spy();

    const watch = new Watch(emitter, disableWatcher);// eslint-disable-line no-unused-vars
    return emitter.emit('beforeImmediate')
    .then(() => {
      assert(emitter.set.calledOnce);
      assert(emitter.set.args[0][0].immediate === false);
      assert(emitter.set.args[0][0].exit === false);
      assert(emitter.start.calledOnce);
    });
  });

  it('when detects a change, should start the task unless running', () => {
    const emitter = new AsyncEmitter;
    emitter.set = sinon.spy();
    emitter.start = sinon.spy();

    const watch = new Watch(emitter, disableWatcher);// eslint-disable-line no-unused-vars

    setTimeout(() => {watch.onChange();});

    return emitter.emit('beforeImmediate')
    .then(() => {
      assert(emitter.start.calledOnce);

      setTimeout(() => {watch.onChange();}, 1);
      setTimeout(() => {watch.onChange();}, 10);

      return watch.onChange();
    })
    .then(() => {
      assert(emitter.start.calledTwice);
    });
  });

  it('when the task is completed, should be notify of the watch locations', () => {
    const emitter = new AsyncEmitter;
    emitter.set = sinon.spy();
    emitter.start = sinon.spy();

    const logEvent = sinon.spy();
    emitter.on('log', logEvent);

    const watch = new Watch(emitter, disableWatcher);// eslint-disable-line no-unused-vars
    return emitter.emit('beforeImmediate')
    .then(() => {
      assert(logEvent.calledOnce);

      const notifyMessage = stripAnsi(logEvent.args[0][0]);
      assert(notifyMessage === `... watch at ${watch.opts.globs.join(', ')}.`);
    });
  });
});
