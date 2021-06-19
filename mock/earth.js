const areaData = [
    {
        id: '1',
        key: 'CHN',
        label: '中国',
        children: [
            {
                id: '3',
                key: 'SX',
                label: '陕西',
            },
        ],
    },
    {
        id: '2',
        key: 'AUT',
        label: '奥地利',
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
