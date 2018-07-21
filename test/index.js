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
    const emitter = new AsyncEmitter();
    const watch = new Watch(emitter);
    watch.setProps({
      plugins: {
        launch: {
          launch: sinon.spy(),
        },
      },
    });

    return emitter.emitParallel('attach-plugins')
      .then(() => emitter.emitParallel('launch'))
      .then(() => {
        assert(watch.getProps().plugins.launch.launch.calledOnce);
        emitter.emitParallel('detach-plugins');
      });
  });

  it('when detects a change, should start the task unless running', () => {
    const emitter = new AsyncEmitter();
    const watch = new Watch(emitter);
    watch.setProps({
      plugins: {
        launch: {
          launch: sinon.spy(),
        },
      },
    });

    return emitter.emitParallel('attach-plugins')
      .then(() => emitter.emitParallel('launch'))
      .then(() => {
        assert(watch.getProps().plugins.launch.launch.calledOnce);

        setTimeout(() => { watch.onChange(); }, 1);
        setTimeout(() => { watch.onChange(); }, 10);

        return watch.onChange();
      })
      .then(() => {
        assert(watch.getProps().plugins.launch.launch.calledTwice);
        emitter.emitParallel('detach-plugins');
      });
  });

  it('when the task is completed, should be notify of the watch locations', () => {
    const emitter = new AsyncEmitter();
    const logEvent = sinon.spy();
    emitter.on('log', logEvent);

    const watch = new Watch(emitter);
    watch.setProps({
      plugins: {
        launch: {
          launch: sinon.spy(),
        },
      },
    });
    return emitter.emitParallel('attach-plugins')
      .then(() => emitter.emitParallel('launch'))
      .then(() => {
        assert(logEvent.calledOnce);

        const notifyMessage = stripAnsi(logEvent.args[0][0]);
        assert(notifyMessage === `... watch at ${watch.opts.value}.`);

        emitter.emitParallel('detach-plugins');
      });
  });

  it('if lazy is true, should not subscribe the launch', () => {
    const emitter = new AsyncEmitter();
    const watch = new Watch(emitter, true, { lazy: true });
    watch.setProps({
      plugins: {
        launch: {
          launch: sinon.spy(),
        },
      },
    });
    return emitter.emitParallel('attach-plugins')
      .then(() => emitter.emitParallel('launch'))
      .then(() => {
        assert(watch.getProps().plugins.launch.launch.notCalled);
        emitter.emitParallel('detach-plugins');
      });
  });

  it('should no handle watch glob(abigail#19)', () => {
    const emitter = new AsyncEmitter();
    const watch = new Watch(emitter, 'src/**/*.{js,jsx}');

    return emitter.emitParallel('attach-plugins').then(() => {
      assert(watch.globs[0] === 'src/**/*.{js,jsx}');
      emitter.emitParallel('detach-plugins');
    });
  });
});
