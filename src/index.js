import Promise from 'bluebird';
import gaze from 'gaze';
import { relative as relativePath } from 'path';
import chalk from 'chalk';
import Plugin from 'abigail-plugin';

/**
* @class Watch
*/
export default class Watch extends Plugin {
  static defaultOptions = {
    /**
    * @static
    * @property defaultOptions.value
    */
    value: [
      'package.json',
      'src/**/*.js',
      'test/**/*.js',
    ],
  }

  /**
  * @constructor
  **/
  constructor(...args) {
    super(...args);

    if (typeof this.opts.value === 'string') {
      this.opts.value = this.opts.value.split(',');
    } else {
      this.opts.value = [].slice.call(this.opts.value);
    }
    // if parent is mock, ignore
    if (this.parent.set) {
      this.parent.set({
        immediate: false,
        exit: false,
      });
    }
  }

  /**
  * @method pluginWillAttach
  * @returns {promise<array>} exitCodes - first task finished
  */
  pluginWillAttach() {
    const gazeOptions = {
      cwd: this.parent.packageDir,
    };
    this.gaze = gaze(this.opts.value, gazeOptions, (error) => {
      if (error) {
        throw error;
      }

      this.gaze.on('all', (event, filepath) => {
        this.onChange(event, filepath);
      });
    });

    return this.onChange();
  }

  /**
  * @method pluginWillDetach
  * @returns {undefined}
  */
  pluginWillDetach() {
    if (this.gaze) {
      this.gaze.end();
    }
  }

  /**
  * @method onChange
  * @param {string} event
  * @param {string} [filepath=null]
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
      promise = this.parent.emit('watch', path, event);
    }

    return promise
    .then(() => this.parent.start())
    .finally(() => {
      this.busy = false;
      this.waitLog(this.opts.value);
    });
  }

  /**
  * @method waitLog
  * @param {array} globs
  * @returns {undefined}
  */
  waitLog(globs) {
    const locations = globs.map(glob => chalk.bold(glob)).join(', ');
    this.parent.emit('log', `... watch at ${locations}.`);
  }
}
