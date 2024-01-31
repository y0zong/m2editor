// Copyright (C) 2015-2017 by Marijn Haverbeke <marijn@haverbeke.berlin> and others

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

const nav = typeof navigator != "undefined" ? navigator : null
const doc = typeof document != "undefined" ? document : null
const agent = (nav && nav.userAgent) || ""

const ie_edge = /Edge\/(\d+)/.exec(agent)
const ie_upto10 = /MSIE \d/.exec(agent)
const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(agent)

export const ie = !!(ie_upto10 || ie_11up || ie_edge)
export const ie_version = ie_upto10 ? (document as any).documentMode : ie_11up ? +ie_11up[1] : ie_edge ? +ie_edge[1] : 0
export const gecko = !ie && /gecko\/(\d+)/i.test(agent)
export const gecko_version = gecko && +(/Firefox\/(\d+)/.exec(agent) || [0, 0])[1]

const _chrome = !ie && /Chrome\/(\d+)/.exec(agent)
export const chrome = !!_chrome
export const chrome_version = _chrome ? +_chrome[1] : 0
export const safari = !ie && !!nav && /Apple Computer/.test(nav.vendor)
// Is true for both iOS and iPadOS for convenience
export const ios = safari && (/Mobile\/\w+/.test(agent) || !!nav && nav.maxTouchPoints > 2)
export const mac = ios || (nav ? /Mac/.test(nav.platform) : false)
export const windows = nav ? /Win/.test(nav.platform) : false
export const android = /Android \d/.test(agent)
export const webkit = !!doc && "webkitFontSmoothing" in doc.documentElement.style
export const webkit_version = webkit ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0