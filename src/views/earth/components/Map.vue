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
                        ground: 'world-elevation'
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
                                this.$refs.myVideo.setPlayUrl(event.action.metadata.link);
                            }
                        });
                    });
                    this.ESRI.view.on('click', (event) => {
                        console.log(event);
                    });

                    this.ESRI.view.ui.remove(['navigation-toggle']);
                    this.ESRI.view.ui.move(['compass', 'zoom'], 'bottom-right');
                    res();
					this.useTDTLayer();
                });
            });
        },
        useTDTLayer() {
            loadModules(['esri/layers/WebTileLayer', 'esri/layers/support/TileInfo'], this.esriOpt).then(
                ([WebTileLayer, TileInfo]) => {
                    let tiledLayerAnno = new WebTileLayer({
                        urlTemplate:
                            'http://{subDomain}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={level}&TILEROW={row}&TILECOL={col}&tk=00f75f2da1786e807697fb6f0d145e64',
                        subDomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
                        copyright: '天地图影像注记',
                        //tileInfo,
                    });
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