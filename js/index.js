const url = [
    // 周榜
    'http://api.douban.com/v2/movie/weekly?apikey=0df993c66c0c636e29ecbb5344252a4a',
    // 北美票房
    'http://api.douban.com/v2/movie/us_box?apikey=0df993c66c0c636e29ecbb5344252a4a',
    // Top250
    'http://api.douban.com/v2/movie/top250?apikey=0df993c66c0c636e29ecbb5344252a4a'
]
let tabIndex = 0
let amount = 0

// 将获取数据渲染进页面
const setData = (data, type = 'normal') => {
    if (!Array.isArray(data)) {
        return
    }
    $('.item-wrap').eq(tabIndex).empty()
    data.forEach(i => {
        let data = null
        if (type !== 'top250') {
            data = i.subject
        } else {
            data = i
        }
        const {
            title,
            images,
            rating,
            genres,
            collect_count,
            year
        } = data
        const artsan = data.casts.map(i => i.name)
        const directors = data.directors.map(i => i.name)

        const $node = `
        <div class="item">
            <img src=${images.small}>
            <div>
                <p>${ title }</p>
                <p>
                    <span class="score">${ rating.average }</span>分 / ${ collect_count }收藏
                </p>
                <p>${ year } / ${ genres.join('、') }</p>
                <p>导演：${ directors.join('、') }</p>
                <p>主演：${ artsan.join('、') || '暂无信息' }</p>
            </div>
        </div>`
        $('.item-wrap').eq(tabIndex).append($node)
    });
}

// 周榜、北美榜Ajax
const getList = (url) => {
    $.ajax({
        url,
        type: 'GET',
        dataType: 'jsonp'
    }).done(({
        subjects
    }) => {
        console.log(subjects)
        return setData(subjects)
    })
}

// top250Ajax
const getTop250 = (url) => {
    const data = {
        start: 1,
        count: 15
    }
    $.ajax({
        url,
        type: 'GET',
        data,
        dataType: 'jsonp'
    }).done(({
        total,
        subjects
    }) => {
        amount = total
        console.log(subjects);
        return setData(subjects, 'top250')
    })
    data.start += 1
}
// 默认获取本周数据
getList(url[tabIndex])

// 切换tab，获取不同数据
$('footer>div').click(function () {
    tabIndex = $(this).index()
    $('section').hide().eq(tabIndex).show()
    $(this).addClass('active').siblings().removeClass('active')
    if (tabIndex !== 2) {
        getList(url[tabIndex])
    } else {
        getTop250(url[tabIndex])
    }
})

$('section').eq(2).scroll(() => {
    const viewH = $(window).height() - 90
    const scroH = $('section').eq(2).scrollTop()
    const textH = $('section').eq(2).height()
    console.log(`页面的高度:${viewH-90}，滚动条距离顶部的位置:${scroH}，内容高度:${textH}`)
    if (viewH - scroH <= 10) {
        console.log('发送请求')
        // getTop250(url[tabIndex])
    }
})