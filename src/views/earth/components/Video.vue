<template>
    <div class="video" v-show="url">
        <video muted autoplay controls :src="url"></video>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: '',
        };
    },
    methods: {
        setPlayUrl(link) {
            this.url = require('../../../assets/' + link);
        },
    },
};
</script>

<style lang="scss" scoped>
.video > video {
    width: 100%;
}
</style>