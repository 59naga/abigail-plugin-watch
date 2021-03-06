// dependencies
import Plugin from 'abigail-plugin';
import chalk from 'chalk';
import Promise from 'bluebird';
import gaze from 'gaze';
import { relative as relativePath } from 'path';

// @class Watch
export default class Watch extends Plugin {
  static defaultOptions = {
    /**
    * @static
    * @property defaultOptions.value
    */
    value: '{src,test}/**/*.{js,mjs}',
  }

  /**
  * @method pluginWillAttach
  * @returns {promise<array>} exitCodes - first task finished
  */
  pluginWillAttach() {
    try {
      this.getPlugin('exit').abort();
      this.getPlugin('launch').abort();
    } catch (e) {
      // ignore
    }

    if (typeof this.opts.value === 'string') {
      this.globs = [this.opts.value];
    } else {
      this.globs = [].slice.call(this.opts.value);
    }
    const json = this.getProps().json || {};
    const gazeOptions = {
      cwd: json.dir,
    };
    this.gaze = gaze(this.globs, gazeOptions, (error) => {
      if (error) {
        throw error;
      }

      this.gaze.on('all', (event, filepath) => {
        this.onChange(event, filepath);
      });
    });

    if (this.opts.lazy) {
      return;
    }

    this.subscribe('launch', () => this.onChange(), true);
  }

  /**
  * @method pluginWillDetach
  * @returns {undefined}
  */
  pluginWillDetach() {
    if (this.gaze) {
      this.gaze.close();
    }
  }

  /**
  * @method onChange
  * @param {string} [event] - a gaze event name
  * @param {string} [filepath=null] - a changed filename
  * @returns {promise<undefined>} task
  */
  onChange(event, filepath = null) {
    if (this.busy) {
      return Promise.resolve();
    }
    this.busy = true;

    let promise = Promise.resolve();
    if (filepath) {
      const path = relativePath(this.opts.process.cwd(), filepath);
      promise = this.parent.emitParallel('watch', path, event);
    }

    return promise
      .then(() => {
        const launchPlugin = this.getPlugin('launch');
        return launchPlugin.launch(this.getProps().task, launchPlugin.opts);
      })
      .finally(() => {
        this.busy = false;
        this.waitLog(this.globs);

        // fix (node) warning: possible EventEmitter memory leak detected.
        this.opts.process.stdin.removeAllListeners();
        this.opts.process.stdout.removeAllListeners();
        this.opts.process.stderr.removeAllListeners();
      });
  }

  /**
  * @method waitLog
  * @param {array} globs - a watch locations
  * @returns {undefined}
  */
  waitLog(globs) {
    const locations = globs.map(glob => chalk.bold(glob)).join(', ');
    this.parent.emitParallel('log', `... watch at ${locations}.`);
  }
}
