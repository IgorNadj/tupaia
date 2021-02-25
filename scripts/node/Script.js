/**
 * Tupaia
 * Copyright (c) 2017 - 2020 Beyond Essential Systems Pty Ltd
 */

const { execSync } = require('child_process');
const { existsSync, readdirSync } = require('fs');
const { platform } = require('os');
const yargs = require('yargs');

const { getLoggerInstance } = require('@tupaia/utils');

/**
 * @abstract
 */
class Script {
  STATUS_CODES = {
    SUCCESS: 0,
    ERROR: 1,
  };

  logger;

  /**
   * @protected Override in child class
   *
   * @property {string} [command] Use '*' or '$0' to refer to the default command
   *   This field is useful for
   *   1. Defining subcommands, eg 'push <branch_name>'
   *   2. Defining positional arguments in the default command, eg '* <path>'
   * @property {Object} [options]
   * @property {string} [usage]
   * @property {string} [version]
   *
   * @see https://github.com/yargs/yargs/blob/master/docs/api.md
   */
  config = {};

  args;

  constructor() {
    this.logger = getLoggerInstance();
  }

  run() {
    this.parseConfig();
    this.runCommands();
  }

  parseConfig() {
    const supportedConfigKeys = ['command', 'options', 'usage', 'version'];

    yargs.strict();
    Object.entries(this.config).forEach(([key, value]) => {
      if (supportedConfigKeys.includes(key)) {
        yargs[key](value);
      }
    });
    this.args = yargs.argv;
  }

  /**
   * @abstract
   */
  runCommands() {
    throw new Error('Any subclass of Script must implement the "runCommands" method');
  }

  logError = (message = '') => {
    this.logger.error(message);
  };

  logWarning = (message = '') => {
    this.logger.warn(message);
  };

  logSuccess = (message = '') => {
    this.logger.success(message);
  };

  logInfo = (message = '') => {
    this.logger.info(message);
  };

  logVerbose = (message = '') => {
    this.logger.verbose(message);
  };

  logDebug = (message = '') => {
    this.logger.debug(message);
  };

  log = (message = '') => {
    this.logger.verbose(message);
  };

  /**
   * @returns {boolean} True if the command exited with a success status
   */
  exec = (command, { printOutput = true } = {}) => {
    execSync(command, {
      stdio: printOutput ? 'inherit' : 'ignore',
    });
  };

  exit(success = true) {
    process.exit(success ? this.STATUS_CODES.SUCCESS : this.STATUS_CODES.ERROR);
  }

  findFolders = (path = '.') =>
    readdirSync(path, { withFileTypes: true }).filter(entry => entry.isDirectory());

  findFolderNames = path => this.findFolders(path).map(({ name }) => name);

  checkPathExists = path => existsSync(path);

  isOsWindows = () => platform() === 'win32';
}

module.exports = Script;
