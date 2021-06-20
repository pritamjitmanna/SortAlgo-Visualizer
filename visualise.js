diff = parseInt(getComputedStyle(document.querySelector(':root')).getPropertyValue('--diff'));
delayarr = [200, 400]
delay = 200
swapdelay = 400
bubSort = document.getElementById('bub-sort');
function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}
function generate() {
    bubSort.innerHTML = "";
    for (i = 0; i < 10; i++) {
        let newel = document.createElement('div');
        newel.setAttribute('class', 'box');
        newel.innerText = `${Math.ceil(Math.random() * 99)}`;
        newel.style.transform = `translate(${i * 102}%,0%)`;
        bubSort.appendChild(newel);
    }
}
generate();
let gen = document.querySelector('nav button');
gen.addEventListener('click', () => {
    generate();
    type.disabled = false
    type.disabled = false
})
let type = document.querySelector('select[name="type"]')
type.addEventListener('change', () => {
    gridBox = document.getElementsByClassName('box');
    gridBox = Array.from(gridBox)
    type.disabled = true
    gen.disabled = true
    if (type.value == 'bub') bub();
    else if (type.value == 'sel') sel();
    else if (type.value == 'ins') ins();
    else if (type.value == 'mer') mergeit();
    else {
        type.disabled = false
        gen.disabled = false
    }

});
function swap(x, y, type = 'bub') {
    return new Promise(res => {
        let el1 = gridBox[x];
        let el2 = gridBox[y];
        temp = gridBox[x];
        gridBox[x] = gridBox[y];
        gridBox[y] = temp;
        temp = el1.style.transform;
        el1.style.transform = el2.style.transform;
        el2.style.transform = temp;
        setTimeout(() => {
            el1.parentNode.insertBefore(el2, el1);
            if (type == 'sel') insertAfter(el1, gridBox[y]);
            res();
        }, swapdelay);
    })
}

function mergeswap(str, cnt, i, u) {
    return new Promise(res => {
        el1 = gridBox[u];
        el2 = gridBox[i];
        setTimeout(() => {
            res();
        }, swapdelay);
        gridBox[u].style.transform = `translate(${str[0] + cnt}%,${str[1]}%)`;
    })
}

async function bub() {
    for (let i = 9; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            gridBox[j].style.backgroundColor = 'red';
            gridBox[j + 1].style.backgroundColor = 'red';
            await new Promise(res =>
                setTimeout(() => {
                    res();
                }, delay))
            if (Number(gridBox[j].innerText) > Number(gridBox[j + 1].innerText)) await swap(j, j + 1);
            gridBox[j].style.backgroundColor = 'aquamarine';
            gridBox[j + 1].style.backgroundColor = 'aquamarine';
        }
        gridBox[i].style.backgroundColor = 'green';
    }
    gen.disabled = false
    type.value = 'None'
}

async function sel() {
    for (let i = 0; i < 10; i++) {
        val = Number(gridBox[i].innerText);
        gridBox[i].style.backgroundColor = '#f08585';
        // console.log();
        p = i;
        for (let j = i + 1; j < 10; j++) {
            gridBox[j].style.backgroundColor = 'red';
            await new Promise(res =>
                setTimeout(() => {
                    res();
                }, delay))
            if (Number(gridBox[j].innerText) < val) {
                val = Number(gridBox[j].innerText);
                gridBox[j].style.backgroundColor = '#f08585';
                gridBox[p].style.backgroundColor = 'aquamarine';
                p = j;
            }
            if (p != j) gridBox[j].style.backgroundColor = 'aquamarine';
        }
        if (p > i) await swap(i, p, 'sel');
        gridBox[i].style.backgroundColor = 'green';
    }
    gen.disabled = false
    type.value = 'None'
}

async function ins() {
    for (let i = 1; i < 10; i++) {
        for (let j = i - 1; j >= 0; j--) {
            gridBox[j + 1].style.backgroundColor = 'blue';
            gridBox[j].style.backgroundColor = 'red';
            await new Promise(res =>
                setTimeout(() => {
                    res();
                }, delay))
            if (Number(gridBox[j + 1].innerText) < Number(gridBox[j].innerText)) {
                await swap(j, j + 1);
                gridBox[j + 1].style.backgroundColor = 'aquamarine';
                gridBox[j].style.backgroundColor = 'aquamarine';
            }
            else {
                gridBox[j + 1].style.backgroundColor = 'aquamarine';
                gridBox[j].style.backgroundColor = 'aquamarine';
                break;
            }
        }

    }
    for (i = 0; i < 10; i++)gridBox[i].style.backgroundColor = 'green';
    gen.disabled = false
    type.value = 'None'
}


async function merge(i, mid, j, str) {
    // console.log(str);
    const tempar = []
    let cnt = 0, u = i, v = mid + 1, len = j - i + 1, kp = i;
    while (kp <= j) {
        if (u <= mid && v <= j) {
            gridBox[v].style.backgroundColor = 'red';
            gridBox[u].style.backgroundColor = 'red';
        }
        await new Promise(res => {
            setTimeout(() => {
                res()
            }, delay);
        })
        if (v > j || (u <= mid && Number(gridBox[u].innerText) < Number(gridBox[v].innerText))) {
            tempar.push(gridBox[u]);
            await mergeswap(str, cnt, kp + i, u)
            if (u <= mid && v <= j) {
                gridBox[v].style.background = 'none';
                gridBox[u].style.background = 'none';
            }
            u++;
        }
        else {
            tempar.push(gridBox[v]);
            await mergeswap(str, cnt, kp + i, v);
            if (u <= mid && v <= j) {
                gridBox[v].style.background = 'none';
                gridBox[u].style.background = 'none';
            }
            v++;
        }
        kp++;

        cnt += 102;
    }
    gridBox = gridBox.slice(0, i).concat(tempar).concat(gridBox.slice(j + 1));
}
async function merges(i, j) {
    if (i == j) return new Promise(res => {
        setTimeout(() => {
            res();
        }, delay);
    })
    let mid = Math.floor((i + j) / 2);
    await new Promise(res =>
        setTimeout(() => {
            res();
        }, delay))
    let str;
    for (k = i; k <= mid; k++) {
        style = gridBox[k].style.transform.substring(10, gridBox[k].style.transform.lastIndexOf(')')).split(',');
        if (k == i) str = [parseInt(style[0]), parseInt(style[1])];
        gridBox[k].style.transform = `translate(${parseInt(style[0]) - diff}%,${parseInt(style[1]) + 102}%)`;
    }
    await merges(i, mid);
    for (k = mid + 1; k <= j; k++) {
        style = gridBox[k].style.transform.substring(10, gridBox[k].style.transform.lastIndexOf(')')).split(',');
        gridBox[k].style.transform = `translate(${parseInt(style[0]) + diff}%,${parseInt(style[1]) + 102}%)`;
    }
    await merges(mid + 1, j);
    await merge(i, mid, j, str);
    return new Promise(res => {
        setTimeout(() => {
            res();
        }, delay);
    })
}
async function mergeit() {
    diff = parseInt(getComputedStyle(document.querySelector(':root')).getPropertyValue('--diff'));
    await merges(0, 9);
    for (i = 0; i < 10; i++)gridBox[i].style.backgroundColor = 'green';
    gen.disabled = false
    type.value = 'None'
}


let speed = document.getElementById('speed');
speed.addEventListener('change', e => {
    delay = Math.ceil(((200 - parseInt(speed.value)) * delayarr[0]) / 100);
    swapdelay = Math.ceil(((200 - parseInt(speed.value)) * delayarr[1]) / 100);
})