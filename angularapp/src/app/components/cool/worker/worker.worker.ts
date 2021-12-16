
addEventListener('message', ({ data }) => {
    const response = `worker response to ${data}`;
    let count = 0;
    console.log('worker开始计算，请稍等')
    for (let i = 0; i <= 1000000000; i++) {
        count++;
        count++;
        count++;
        count++;
        count++;
        count++;
    }
    console.log('count', count)
    postMessage(count);
});
