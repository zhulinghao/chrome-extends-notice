// popup.js
// var bg = chrome.extension.getBackgroundPage();
const TIME_DIMENSION = {
    0: '默认',
    1: '每年',
    2: '每月',
    3: '每周',
    4: '每天'
}

const app = new Vue({
    el: "#time-planning",
    data: {
        timer: null,
        TIME_DIMENSION: TIME_DIMENSION,
        pageType: 'setting',

        // setting
        list: [],
        time: '',
        name: '',
        timeDimensionOptions: [
            {
                value: 0,
                label: '默认'
            },
            {
                value: 1,
                label: '每年',
                disabled: true
            }, {
                value: 2,
                label: '每月',
                disabled: true
            }, {
                value: 3,
                label: '每周',
                disabled: true
            }, {
                value: 4,
                label: '每天'
            }
        ],
        timeDimension: 0,
        // page
        currentData: {
            time: null,
            timeDimension: null,
            name: null
        },
        timeDuration: null,
        currentDes: null
    },
    methods: {
        // 生成随机id
        genID(length){
            return Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
        },
        saveListStorage() {
            chrome.storage.sync.set({ list: this.list }, () => console.log('保存成功'));
        },
        addPlanning() {
            const h = this.$createElement;
            let { name, time, timeDimension } = this;
            let id = this.genID(12);
            if(this.list.length >= 5) {
                this.$message({
                    title: '提示',
                    message: h('b', { style: 'color: #fff'}, '不能超过5个哦')
                });
                return;
            }
            this.list.push({ id, name, time, timeDimension });
            this.saveListStorage();
        },
        back() {
            this.pageType = 'setting';
        },
        rmItem(id) {
            this.list = this.list.filter(item => item.id !== id);
            this.saveListStorage();
        },
        changePage(id) {
            if(this.timer) clearInterval(this.timer);
            this.list.forEach(item => {
                if(item.id === id) {
                    this.currentData = item;
                    this.pageType = 'page';
                    this.startTiming();
                }
            });
        },
        startTiming() {
            let { time, timeDimension } = this.currentData;
            if(timeDimension === 4) {
                time = moment().format('YYYY-MM-DD') + ` ${time}`;
            }
            // 50ms更新一次
            this.timer = setInterval(() => {
                // 目标时间和当前时间的差值
                let diff = moment(time).diff(moment());
                if(diff < 0) {
                    this.currentDes = "已过去";
                    diff = -diff;
                } else this.currentDes = "还有";
                let duration = moment.duration(diff);
                let [ Y, M, D, H, m, s ] = [
                    duration.years(),
                    duration.months(),
                    duration.days(),
                    duration.hours(),
                    duration.minutes(),
                    duration.seconds()
                ].map((v) => {
                    if(!v) return null;
                    v = '0' + v;
                    return v.substring(v.length - 2)
                });
                this.timeDuration = `${Y ? Y + '年 ' : ''}${M ? M + '月 ' : ''}${D ? D + '日 ' : ''}${H ? H + '时 ' : ''}${m ? m + '分 ' : ''}${s ? s + '秒' : ''}`;
            }, 50);
        }
    },
    mounted() {
        chrome.storage.sync.get(["list"], (r) => {
            this.list = r.list || [];
        });
        
    }
});
