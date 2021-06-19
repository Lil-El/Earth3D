<template>
    <div id="SceneView"></div>
</template>

<script>
import { loadModules } from 'esri-loader';
export default {
    data() {
        return {
            ESRI: { map: null, view: null, areaGroup: null, graphicsLayer: null },
            esriOpt: {
                url: 'https://js.arcgis.com/4.15/',
                css: 'https://js.arcgis.com/4.15/esri/themes/light/main.css',
            },
        };
    },
    mounted() {
        this.createView();
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
                    });
                    this.ESRI.map.add(this.ESRI.areaGroup);

                    this.ESRI.graphicsLayer = new GraphicsLayer();
                    this.ESRI.map.add(this.ESRI.graphicsLayer);

                    this.ESRI.view.ui.remove(['navigation-toggle']);
                    this.ESRI.view.ui.move(['compass', 'zoom'], 'bottom-right');
                    res();
                });
            });
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
                            url: `http://192.168.0.99:9527/${areaName}.geo.json`,
                            renderer: {
                                type: 'simple',
                                field: 'mag',
                                symbol: {
                                    type: 'simple-fill',
                                    color: [255, 0, 0, 0.5],
                                    outline: {
                                        color: 'white',
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
            loadModules(['esri/Graphic'], this.esriOpt).then(([Graphic]) => {
                let graphic = new Graphic({
                    geometry: {
                        type: 'point',
                        x: data.longitude,
                        y: data.latitude,
                        x: 10,
                    },
                    symbol: {
                        type: 'picture-marker',
                        url: 'https://developers.arcgis.com/javascript/latest/sample-code/satellites-3d/live/satellite.png',
                        width: 48,
                        height: 48,
                    },
                    attributes: {
                        ...data,
                    },
                    popupTemplate: {
                        title: '{label}',
                        content: '{content}',
                        actions: [],
                    },
                });
                this.ESRI.graphicsLayer.add(graphic);
                isGoto && this.ESRI.Map.goTo(graphic);
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