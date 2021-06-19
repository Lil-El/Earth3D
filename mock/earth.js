const areaData = [
    {
        id: '1',
        type: 'intercontinental', // 洲际
        label: '亚洲',
        children: [
            {
                id: '11',
                type: 'nation', // 国家
                key: 'CHN',
                label: '中国',
                children: [
                    {
                        id: '111',
                        type: 'province', // 省
                        key: 'SX',
                        label: '陕西',
                        children: [
                            {
                                id: '1111',
                                type: 'factory', // 工厂
                                label: '爱德华仪器制造厂',
                                latitude: 34.194891521232776,
                                longitude: 108.86307109806822,
                                address: '陕西省西安市雁塔区丈八五路爱德华仪器制造厂',
                                content: '实例的开发就实力坑爹房间数量快递费交流可圣诞节弗兰克圣诞节弗兰克',
                                telephone: '150xxxx0351',
                                concat: '刘先生',
                            },
                        ],
                    },
                ],
            },
            {
                id: '12',
                type: 'nation',
                key: 'RUS',
                label: '俄罗斯',
                children: [],
            },
        ],
    },
    {
        id: '2',
        type: 'intercontinental',
        label: '欧洲',
        children: [],
    },
    {
        id: '3',
        type: 'intercontinental',
        label: '北美洲',
        children: [],
    },
    {
        id: '4',
        type: 'intercontinental',
        label: '南美洲',
        children: [],
    },
    {
        id: '5',
        type: 'intercontinental',
        label: '非洲',
        children: [],
    },
];

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
