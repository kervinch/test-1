/* eslint-disable require-jsdoc */
const RandBytes = new require('randbytes');
const crypto = require('crypto');
const cryptoJS = require('crypto-js');

// PHP Javscript ported functions
const { ord, strpos } = require('locutus/php/strings');
const { uniqid } = require('locutus/php/misc');
const { rand } = require('locutus/php/math');
const { microtime } = require('locutus/php/datetime');

class PasswordHash {
  constructor(iterationCountLog2, portableHashes, phpMajorVersion) {
    this.php_major_version = phpMajorVersion || 7;

    this.itoa64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    if (iterationCountLog2 < 4 || iterationCountLog2 > 31) {
      iterationCountLog2 = 8;
    }

    this.iteration_count_log2 = iterationCountLog2;

    this.portable_hashes = portableHashes;

    const mtime = microtime();
    const uniq = uniqid(rand(), true);

    this.random_state = `${mtime}${uniq}`;
  }

  getRandomBytes(count) {
    const promise = new Promise((resolve) => {
      const randomSource = RandBytes.urandom.getInstance();
      randomSource.getRandomBytes(count, function(buff) {
        resolve(buff.toString('binary'));
      });
    });
    return promise;
  }

  encode64(input, count) {
    let output = '';
    let i = 0; let value;
    let v;

    do {
      value = ord(input.charAt(i++));
      v = value & 0x3F;
      output = `${output}${this.itoa64.charAt(v)}`;
      if (i < count) {
        value |= ord(input.charAt(i)) << 8;
      }
      v = (value >> 6) & 0x3F;
      output = `${output}${this.itoa64.charAt(v)}`;
      if (i++ >= count) {
        break;
      }
      if (i < count) {
        value |= ord(input.charAt(i)) << 16;
      }
      v = (value >> 12) & 0x3F;
      output = `${output}${this.itoa64.charAt(v)}`;
      if (i++ >= count) {
        break;
      }
      v = (value >> 18) & 0x3F;
      output = `${output}${this.itoa64.charAt(v)}`;
    } while (i < count);

    return output;
  }

  gensaltPrivate(input) {
    let output = '$P$';

    const inc = this.php_major_version >= 5 ? 5 : 3;
    const index = Math.min(this.iteration_count_log2 + inc, 30);
    const char = this.itoa64.charAt(index);
    const encoded = this.encode64(input, 6);
    output = `${output}${char}`;
    output = `${output}${encoded}`;

    return output;
  }

  cryptPrivate(password, setting) {
    let output = '*0';

    if (setting.substr(0, 2) == output) {
      output = '*1';
    }

    const id = setting.substr(0, 3);
    if (id != '$P$' && id != '$H$') {
      return output;
    }

    const countLog2 = strpos(this.itoa64, setting.charAt(3));
    if (countLog2 < 7 || countLog2 > 30) {
      return output;
    }

    let count = 1 << countLog2;

    const salt = setting.substr(4, 8);
    if (salt.length != 8) {
      return output;
    }

    let hash = crypto.createHash('md5').update(`${salt}${password}`, 'binary').digest('binary');
    do {
      hash = crypto.createHash('md5').update(`${hash}${password}`, 'binary').digest('binary');
    } while (--count);
    output = setting.substr(0, 12);
    output = `${output}${this.encode64(hash, 16)}`;

    return output;
  }

  hashPassword(password) {
    if (password.length > 4096) {
      return '*';
    }

    const random = '';

    return this.hashWithCryptPrivate(random, password);
  }

  hashWithCryptPrivate(random, password) {
    return new Promise((resolve, reject) => {
      if (random.length < 6) {
        this.getRandomBytes(6)
            .then((random) => {
              const hash = this.cryptPrivate(password, this.gensaltPrivate(random));
              if (hash.length == 34) {
                resolve(hash);
              } else {
                resolve('*');
              }
            })
            .catch((error) => reject(error));
      } else {
        const hash = this.cryptPrivate(password, this.gensaltPrivate(random));
        if (hash.length == 34) {
          resolve(hash);
        } else {
          resolve('*');
        }
      }
    });
  }

  checkPassword(password, storedHash) {
    if (password.length > 4096) {
      return false;
    }

    let hash = this.cryptPrivate(password, storedHash);
    if (hash.charAt(0) == '*') {
      hash = cryptoJS.TripleDES.encrypt(password, storedHash);
    }

    return hash === storedHash;
  }
}

module.exports.PasswordHash = PasswordHash;
