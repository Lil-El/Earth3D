const request = require('request');
/**
 * 数据的格式：
 * {
        id: '乌兹别克斯坦费尔干纳亚星建筑材料有限公司', // id：保证唯一
        type: 'factory',
        label: '乌兹别克斯坦费尔干纳亚星建筑材料有限公司', // 企业名称
        AKA: '祥盛实业', // 简称
        latitude: 41.534714, // 项目坐标
        longitude: 64.448432, // 项目坐标
        Investors: '陕西祥盛实业集团有限公司', // 投资主体
        link: 'frag_bunny.mp4', // 视频在assets目录的名字
    }
 */
// const areaData = require("../public/areaData.json");

const ip = "http://127.0.0.1:8080";
let areaData = [];
request.get(ip+'/areaData.json', {}, (err, res) => {
    if (err) return void 0;
    areaData = JSON.parse(res.body);
});

module.exports = [
    {
        url: '/earth/getAreaList',
        type: 'get',
        response: config => {
            return {
                code: 20000,
                data: areaData,
            };
        },
    },
];
