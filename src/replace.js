'use strict'

// Internal object for performing search and replace.

const is = require('is')
if (!Object.assign) Object.assign = require('object-assign')

// default options
const defaults = {
  caseSensitive: false,
  matchCase: true,
  isolatedWord: true,
  bypass: '|'
}

// merges user-defined options with defaults and creates regex flags
const initOptions = (options, base) => {
  if ('undefined' == typeof base) base = Object.assign({}, defaults)
  options = Object.assign(base, options)
  let flags = 'g'

  if (!options['caseSensitive']) flags += 'i'

  if (options['bypass'].length > 1) {
    throw new Error('bypass option needs to be a one-character string')
  }

  return {
    options: options,
    flags: flags
  }
}

// replacer function that allows backreferences in the replacement text
// also bypasses matches within bypass brackets
const replaceBackRefFn = (replace) => {
  return (...args) => {
    args = Array.prototype.slice.call(args)

    // matcher captures bypass so first 4 args are (match, p1, p2, p3)
    //   where p1 and p3 are the bypass characters
    // if more than 4 args, then there are more than 1 backreferences
    // search and replace for JS backreferences (i.e. $2, $3, etc.) and
    // replace them with argument values for submatches
    if (args.length > 4) {
      let replacement_text = replace
      for (let i = 2; i < args.length - 1; i++) {
        replacement_text = replacement_text.replace('$' + i, args[i])
      }
      return replacement_text
    }

    // if p1 is empty, then no bypass
    return args[1] ? replace : args[0]
  }
}

// replacer function used when match doesn't contain backreferences
//   and plugin options set to match case
// replaces text while trying to match the original case of the matched text
const replaceMatchCaseFn = (replace) => {
  return (match, p1) => {
    // all caps if original was all caps
    if (p1 && p1 === p1.toUpperCase()) {
      return replace.toUpperCase()
    }
      // capitalize if original was capitalized
    if (p1 && p1[0] === p1[0].toUpperCase()) {
      return replace.charAt(0).toUpperCase() + replace.slice(1)
    }

    if (p1) {
      return replace.toLowerCase()
    }
    return match
  }
}

// removes bypass characters
const removeBypass = (text, bypassChar) => {
  const re = new RegExp('\\' + bypassChar + '(.+?)' + '\\' + bypassChar, 'ig')
  return text.replace(re, '$1')
}

const replace = (text, config) => {
  const subs = config['subs']

  // global options and flags
  const { options: g_options, flags: g_flags } = initOptions(config['options'])

  // substitute
  subs.forEach((sub, index) => {
    if (is.regexp(sub['search'])) {
      text = text.replace(sub['search'], sub['replace'])
    } else {
      // per-match options and flags
      const { options: m_options, flags: m_flags } = initOptions(sub['options'], g_options)
      let regexp;

      if (m_options['isolatedWord']) {
        regexp = new RegExp('\\b(?!\\' + g_options['bypass'] + ')(' + sub['search'] + ')(?!\\' + g_options['bypass'] + ')\\b', m_flags)
      } else {
        regexp = new RegExp('(?!\\' + g_options['bypass'] + ')(' + sub['search'] + ')(?!\\' + g_options['bypass'] + ')', m_flags)
      }

      // check if replace doesn't contain backreferences, then match original case if possible
      if (/\$/.test(sub['replace']) || !m_options['matchCase']) {
        text = text.replace(regexp, replaceBackRefFn(sub['replace']))
      } else {
        text = text.replace(regexp, replaceMatchCaseFn(sub['replace']))
      }
    }
  })

  return removeBypass(text, g_options['bypass'])
}


module.exports = replace
