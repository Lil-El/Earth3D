<template>
    <div id="container">
        <div class="top-ele tree-wrap">
            <el-tree
                :data="areaData"
                :props="defaultProps"
                highlight-current
                accordion
                @node-click="handleNodeClick"
            ></el-tree>
        </div>
        <div class="top-ele search-bar">
            <el-select v-model="keyword" filterable :filter-method="filterPOI" placeholder="请输入相关信息">
                <el-option
                    v-for="item in POI"
                    :key="item.label"
                    :label="item.label"
                    :value="item.id"
                ></el-option>
            </el-select>
        </div>
        <Map ref="MAP" />
    </div>
</template>

<script>
import * as earthAPI from '@/api/earth';
import Map from './components/Map.vue';
export default {
    components: { Map },
    data() {
        return {
            keyword: '',
            allFactory: [],
            POI: [],
            areaData: [],
            defaultProps: {
                children: 'children',
                label: 'label',
            },
        };
    },
    watch: {
        keyword(factoryId) {
            this.$refs.MAP.addFactory(factoryId, true);
        },
    },
    async mounted() {
        this.getAreaList();
        await this.$refs.MAP.createView();
        // await this.$refs.MAP.useTDTLayer();
        this.allFactory.forEach(async (factory) => {
            await this.$refs.MAP.addFactory(factory);
        });
    },
    methods: {
        getAreaList() {
            earthAPI.getAreaList().then(({ data }) => {
                this.areaData = data;
                if(this.areaData?.length === 0) return this.getAreaList();
                this.getAllFactory(data);
            })
        },
        getAllFactory(arr) {
            arr.forEach((item) => {
                if (item.type === 'factory') {
                    this.allFactory.push(item);
                } else if (item?.children?.length) {
                    this.getAllFactory(item.children);
                }
            });
        },
        filterPOI(keyword){
            this.POI = keyword ? this.allFactory.filter(item => JSON.stringify(item).includes(keyword)) : [];
        },
        handleNodeClick(node) {
            let { key } = node;
            key && this.$refs.MAP.renderAreaLayer(key);
            node.type === 'factory' && this.$refs.MAP.addFactory(node, true);
        },
    },
};
</script>
<style lang="scss">
.esri-ui-bottom-right.esri-ui-corner {
    display: flex;
    flex-direction: column;
    & > div {
        margin-top: 20px;
    }
}
.el-select-dropdown {
    background-color: #26282c;
    border: none;
    .el-select-dropdown__item {
        color: white;
    }
    .el-select-dropdown__item.hover,
    .el-select-dropdown__item:hover {
        background-color: #1d1d1d;
    }
    .popper__arrow,
    .popper__arrow::after {
        border-bottom-color: #26282c !important;
    }
}
</style>
<style lang="scss" scoped>
#container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #c0c0c0;
}
.top-ele {
    position: absolute;
    z-index: 99;
}
.search-bar {
    right: 20px;
    top: 20px;
    ::v-deep .el-input__inner {
        height: 34px;
        line-height: 34px;
    }
    ::v-deep .el-input__icon {
        line-height: 34px;
    }
}
$color1: #26282c; // parent
$color2: #1d1d1d; // child & checked
$color3: #444444; // hover
.tree-wrap {
    left: 20px;
    top: 20px;
    min-width: 220px;
    min-height: 420px;
    border-radius: 4px;
    background-color: $color1;
    .el-tree {
        color: white;
        background-color: $color1;
    }
    ::v-deep .el-tree-node > .el-tree-node__children {
        background-color: $color2;
        min-width: 220px;
        width: max-content;
    }
    ::v-deep .el-tree-node:focus > .el-tree-node__content {
        background-color: $color2;
    }
    ::v-deep .el-tree-node__content {
        height: 32px;
        &:hover {
            background-color: $color3;
        }
    }
    ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: $color2;
    }
}
.search-bar {
    ::v-deep .el-input__inner {
        background-color: $color1;
        border: none;
        width: 240px;
        color: white;
    }
}
</style>