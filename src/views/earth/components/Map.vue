<template>
    <div>
        <div id="SceneView"></div>
        <my-video ref="myVideo" />
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import myVideo from './Video.vue';
export default {
    components: { myVideo },
    data() {
        return {
            httpUrl: window.location.origin,
            ESRI: { map: null, view: null, areaGroup: null, graphicsLayer: null },
            esriOpt: {
                url: 'https://js.arcgis.com/4.15/',
                css: 'https://js.arcgis.com/4.15/esri/themes/light/main.css',
            },
        };
    },
    methods: {
        createView() {
            return new Promise((res) => {
                const esriModule = [
                    'esri/Map',
                    'esri/views/SceneView',
                    'esri/layers/GroupLayer',
                    'esri/layers/GraphicsLayer',
                ];
                loadModules(esriModule, this.esriOpt).then(([Map, SceneView, GroupLayer, GraphicsLayer]) => {
                    this.ESRI.map = new Map({
                        basemap: 'satellite',
                        ground: 'world-elevation',
                    });
                    this.ESRI.areaGroup = new GroupLayer();
                    this.ESRI.view = new SceneView({
                        container: 'SceneView',
                        map: this.ESRI.map,
                        center: [109.89170506116103, 0],
                    });
                    this.ESRI.map.add(this.ESRI.areaGroup);

                    this.ESRI.graphicsLayer = new GraphicsLayer();
                    this.ESRI.map.add(this.ESRI.graphicsLayer);
                    this.ESRI.view.when().then(() => {
                        let setContent = () => this.$refs.myVideo.$el;
                        this.ESRI.view.popup.on('trigger-action', (event) => {
                            if (event.action.id === 'video-this') {
                                this.ESRI.view.popup.open({
                                    title: event.action.metadata.AKA,
                                    content: setContent(),
                                });
                                // this.ESRI.view.ui.add(this.$refs.myVideo.$el, "top-right")
                                this.$refs.myVideo.setPlayUrl(event.action.metadata.link || 'frag_bunny.mp4');
                            }
                        });
                    });
                    this.ESRI.view.on('click', (event) => {
                        console.log(event);
                    });

                    this.ESRI.view.ui.remove(['navigation-toggle']);
                    this.ESRI.view.ui.move(['compass', 'zoom'], 'bottom-right');
                    res();
                });
            });
        },
        useTDTLayer() {
            loadModules(['esri/layers/WebTileLayer', 'esri/layers/support/TileInfo'], this.esriOpt).then(
                ([WebTileLayer, TileInfo]) => {
                    let tileInfo = new TileInfo({
                        dpi: 90.71428571427429,
                        rows: 256,
                        cols: 256,
                        compressionQuality: 0,
                        origin: {
                            x: -180,
                            y: 90,
                        },
                        spatialReference: {
                            wkid: 3857,
                        },
                        lods: [
                            { level: 2, levelValue: 2, resolution: 0.3515625, scale: 147748796.52937502 },
                            { level: 3, levelValue: 3, resolution: 0.17578125, scale: 73874398.264687508 },
                            { level: 4, levelValue: 4, resolution: 0.087890625, scale: 36937199.132343754 },
                            { level: 5, levelValue: 5, resolution: 0.0439453125, scale: 18468599.566171877 },
                            { level: 6, levelValue: 6, resolution: 0.02197265625, scale: 9234299.7830859385 },
                            { level: 7, levelValue: 7, resolution: 0.010986328125, scale: 4617149.8915429693 },
                            { level: 8, levelValue: 8, resolution: 0.0054931640625, scale: 2308574.9457714846 },
                            { level: 9, levelValue: 9, resolution: 0.00274658203125, scale: 1154287.4728857423 },
                            { level: 10, levelValue: 10, resolution: 0.001373291015625, scale: 577143.73644287116 },
                            { level: 11, levelValue: 11, resolution: 0.0006866455078125, scale: 288571.86822143558 },
                            { level: 12, levelValue: 12, resolution: 0.00034332275390625, scale: 144285.93411071779 },
                            { level: 13, levelValue: 13, resolution: 0.000171661376953125, scale: 72142.967055358895 },
                            { level: 14, levelValue: 14, resolution: 8.58306884765625e-5, scale: 36071.483527679447 },
                            { level: 15, levelValue: 15, resolution: 4.291534423828125e-5, scale: 18035.741763839724 },
                            { level: 16, levelValue: 16, resolution: 2.1457672119140625e-5, scale: 9017.8708819198619 },
                            { level: 17, levelValue: 17, resolution: 1.0728836059570313e-5, scale: 4508.9354409599309 },
                            { level: 18, levelValue: 18, resolution: 5.3644180297851563e-6, scale: 2254.4677204799655 },
                            {
                                level: 19,
                                levelValue: 19,
                                resolution: 2.68220901489257815e-6,
                                scale: 1127.23386023998275,
                            },
                            {
                                level: 20,
                                levelValue: 2,
                                resolution: 1.341104507446289075e-6,
                                scale: 563.616930119991375,
                            },
                        ],
                    });
                    var mapBaseLayer = new WebTileLayer({
                        urlTemplate:
                            'http://${subDomain}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&tk=c6b38ec0b71ad168e94541ebeccb45b8',
                        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        copyright: '天地图影像图',
                        tileInfo,
                    });
                    let tiledLayerAnno = new WebTileLayer({
                        urlTemplate:
                            'http://{subDomain}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=00f75f2da1786e807697fb6f0d145e64',
                        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        copyright: '天地图影像注记',
                        tileInfo,
                    });

                    // this.ESRI.map.add(tiledLayerAnno);
                    this.ESRI.map.add(mapBaseLayer);
                    this.ESRI.map.add(tiledLayerAnno);
                    window.map = this.ESRI.map;
                }
            );
        },
        renderAreaLayer(areaName) {
            let isExist = this.ESRI.areaGroup.findLayerById(areaName);
            return new Promise((resolve) => {
                if (isExist) {
                    this.ESRI.view.goTo(isExist.fullExtent);
                    resolve();
                } else {
                    loadModules(['esri/layers/GeoJSONLayer'], this.esriOpt).then(([GeoJSONLayer]) => {
                        const geoJSONLayer = new GeoJSONLayer({
                            id: areaName,
                            url: `${this.httpUrl}/countries/${areaName}.geo.json`,
                            renderer: {
                                type: 'simple',
                                field: 'mag',
                                symbol: {
                                    type: 'simple-fill',
                                    color: [208, 231, 255, 0.3],
                                    outline: {
                                        color: '#164EFF',
                                        width: 2
                                    },
                                },
                            },
                        });
                        this.ESRI.areaGroup?.removeAll();
                        this.ESRI.areaGroup.add(geoJSONLayer);
                        geoJSONLayer.when(() => {
                            this.ESRI.view.goTo(geoJSONLayer.fullExtent);
                        });
                        resolve();
                    });
                }
            });
        },
        addFactory(data = {}, isGoto = false) {
            let factoryId = typeof data === 'string' ? data : data.id;
            let isExist = this.ESRI.graphicsLayer?.graphics.filter((item) => item.id == factoryId);
            return new Promise((resolve) => {
                if (isExist && isExist.length == 1) {
                    this.ESRI.areaGroup?.removeAll();
                    isGoto && this.ESRI.view.goTo({ target: isExist, zoom: 12 });
                    resolve();
                } else {
                    loadModules(['esri/Graphic'], this.esriOpt).then(([Graphic]) => {
                        let graphic = new Graphic({
                            id: data.id,
                            geometry: {
                                type: 'point',
                                latitude: data.latitude,
                                longitude: data.longitude,
                            },
                            symbol: {
                                type: 'picture-marker',
                                url: `${this.httpUrl}/company.png`,
                                width: 24,
                                height: 24,
                            },
                            attributes: {
                                ...data,
                            },
                            popupTemplate: {
                                title: '{label}',
                                content: `
                                    <div style="margin-bottom: 6px;">
                                        <span style="font-weight: bold;">企业简称：</span><span>{AKA}</span>
                                    </div>
                                    <div style="margin-bottom: 6px;">
                                        <span style="font-weight: bold;">企业名称：</span><span>{label}</span>
                                    </div>
                                    <div style="margin-bottom: 6px;">
                                        <span style="font-weight: bold;">投资主体：</span><span>{Investors}</span>
                                    </div>
                                `,
                                actions:
                                    (data.link && [
                                        {
                                            title: '视频监控',
                                            id: 'video-this',
                                            metadata: { ...data },
                                            className: 'esri-icon-navigation',
                                        },
                                    ]) ||
                                    [],
                            },
                        });
                        this.ESRI.graphicsLayer.add(graphic);
                        isGoto && this.ESRI.view.goTo({ target: graphic, zoom: 12 });
                        resolve();
                    });
                }
            });
        },
        //   this.ESRI.areaGroup.removeAll();
        //   this.renderAreaLayer("CHN");

        //   return new Promise((res) => {
        //     loadModules(
        //       [
        //         "esri/layers/GeoJSONLayer",
        //         "esri/tasks/support/Query",
        //         "esri/geometry/Polygon",
        //         "esri/Graphic",
        //       ],
        //       this.esriOpt
        //     ).then(([GeoJSONLayer, Query, Polygon, Graphic]) => {

        //       //   const query = new Query();
        //       //   query.where = "name = 'Austria'";

        //       //   geoJSONLayer.queryExtent(query).then((result) => {
        //       //     this.ESRI.view.goTo(result.extent);
        //       //   });

        //       //   geoJSONLayer.queryFeatures(query).then((result) => {
        //       //     let features = result.features;
        //       //     // const graphic = new Graphic({
        //       //     //   geometry: ,
        //       //     //   symbol: { type: "simple-fill", color: "black" },
        //       //     // });
        //       //     features[0].symbol = { type: "simple-fill", color: "black" };
        //       //     console.log(result);
        //       //     // this.ESRI.view.goTo(results.extent); // go to the extent of the results satisfying the query
        //       //     this.ESRI.view.graphics.add(features[0]);
        //       //   });
        //       this.ESRI.areaGroup.add(geoJSONLayer);
        //       //   this.ESRI.map.add(geoJSONLayer);
        //       res();
        //     });
        //   });
    },
};
</script>

<style lang="scss" scoped>
#SceneView {
    width: 100vw;
    height: 100vh;
    background-color: #c0c0c0;
}
</style>