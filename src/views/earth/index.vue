<template>
    <div id="container">
        <div class="top-ele tree-wrap">
            <el-tree :data="areaData" :props="defaultProps" highlight-current accordion @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="top-ele search-bar">
            <el-select v-model="keyword" filterable placeholder="请输入相关信息">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
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
            options: [
                {
                    value: '选项1',
                    label: '黄金糕',
                },
                {
                    value: '选项2',
                    label: '双皮奶',
                },
                {
                    value: '选项3',
                    label: '蚵仔煎',
                },
                {
                    value: '选项4',
                    label: '龙须面',
                },
                {
                    value: '选项5',
                    label: '北京烤鸭',
                },
            ],
            areaData: [],
            defaultProps: {
                children: 'children',
                label: 'label',
            },
        };
    },
    async mounted() {
        this.getAreaList();
    },
    methods: {
        getAreaList() {
            earthAPI.getAreaList().then(({ data }) => {
                this.areaData = data;
            });
        },
        handleNodeClick(node) {
            let { key } = node;
            this.$refs.MAP.renderAreaLayer(key);
            node.type === "factory" && this.$refs.MAP.addFactory(node, true);
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
    ::v-deep .el-input__inner{
        height: 34px;
        line-height: 34px;
    }
    ::v-deep .el-input__icon{
        line-height: 34px;
    }
}
.tree-wrap {
    $color1: #26282c; // parent
    $color2: #1d1d1d; // child & checked
    $color3: #444444; // hover
    left: 20px;
    top: 20px;
    width: 220px;
    height: 420px;
    border-radius: 4px;
    background-color: $color1;
    .el-tree {
        color: white;
        background-color: $color1;
    }
    ::v-deep .el-tree-node > .el-tree-node__children {
        background-color: $color2;
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
    ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
        background-color: $color2;
    }
}
</style>