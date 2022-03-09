function add0(m) { return m < 10 ? '0' + m : m }

/**
 * 变换时间格式
 * @param {*} format 
 * @param {*} value 
 * @returns 
 */
export function changeTime(format, value) {
    switch (format) {
        case 'YYMMDDhhmmss':
            var time = new Date(value);
            var y = time.getFullYear();
            var m = time.getMonth() + 1;
            var d = time.getDate();
            var h = time.getHours();
            var mm = time.getMinutes();
            var s = time.getSeconds();
            return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    }
}

/**
 * 计算两个时间之间的差值
 * @param {*} start 2020/03/04 12:12:12 格式的
 * @param {*} end 
 */
export function timeDiff(start, end) {
    console.log('start', start)
    console.log('end', end)
    let sDiff = end.getTime() - start.getTime();  // 时间差的毫秒数 
    let dDiff = Math.floor(sDiff / (24 * 3600 * 1000)); // 计算出天数
    let leavel1 = sDiff % (24 * 3600 * 1000); // 计算天数后剩余的时间
    let hDiff = Math.floor(leavel1 / (3600 * 1000)); // 计算天数后剩余的小时数
    let leavel2 = sDiff % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
    let mDiff = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
    return { sDiff, dDiff, hDiff, mDiff }
}