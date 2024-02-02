const DELAY = 1000
const INTERVAL = 12000
let flag = { time: 0, count: 0 }

export function store_policy(fn: Function, delay: number = DELAY, interval: number = INTERVAL) {

    flag.count += 1
    if (flag.time === 0) {
        flag.time = Date.now()
    }
    const count = flag.count
    const timer = setTimeout(() => {
        clearTimeout(timer)
        if (Date.now() >= flag.time + interval || flag.count === count) {
            flag = { time: 0, count: 0 }
            return fn()
        }
    }, delay)
}