'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
var devkit_1 = require('@nrwl/devkit');
var child_process_1 = require('child_process');
var util_1 = require('util');
function uvuExecutor(options) {
  var _a;
  return __awaiter(this, void 0, void 0, function () {
    var success, dashRArgs, command, c8Command, args, fullCommand, _b, stderr, stdout, err_1;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          success = true;
          dashRArgs = [];
          command = 'uvu';
          if (options.coverage) {
            c8Command = 'c8 ';
            if (options.coverageConfig) {
              c8Command += '-c ' + options.coverageConfig + ' ';
            }
            command = c8Command + command;
          }
          if (options.typescript) {
            if (options.useSwc) {
              dashRArgs.push('@swc/register');
            } else {
              dashRArgs.push('ts-node/register');
              if (options.tsconfigPaths) {
                dashRArgs.push('tsconfig-paths/register');
              }
            }
          }
          dashRArgs.push.apply(
            dashRArgs,
            (_a = options.runtimeArgs) !== null && _a !== void 0 ? _a : [],
          );
          args = dashRArgs.reduce(function (prev, curr) {
            return (prev += '-r ' + curr + ' ');
          }, '');
          process.env.FORCE_COLOR = '1';
          if (!options.color) {
            process.env.FORCE_COLOR = '0';
            args += '-c=false ';
          }
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          fullCommand =
            (0, devkit_1.getPackageManagerCommand)().exec +
            ' ' +
            command +
            ' ' +
            args +
            ' ' +
            options.rootDir +
            ' ' +
            options.pattern;
          devkit_1.logger.debug("Running command '" + fullCommand + "'");
          return [4 /*yield*/, (0, util_1.promisify)(child_process_1.exec)(fullCommand)];
        case 2:
          (_b = _c.sent()), (stderr = _b.stderr), (stdout = _b.stdout);
          if (stderr) {
            devkit_1.logger.error(stderr);
            success = false;
          }
          devkit_1.logger.log(stdout);
          return [2 /*return*/, { success: success }];
        case 3:
          err_1 = _c.sent();
          devkit_1.logger.log(err_1.stdout);
          devkit_1.logger.error(err_1.stderr);
          return [2 /*return*/, { success: false }];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
exports['default'] = uvuExecutor;
