<template>
    <div class="video" v-show="url">
        <iframe :src="url"></iframe>
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
            this.url = link;
        },
    },
};
</script>

<style lang="scss" scoped>
.video {
    background-color: #ccc;
    height: 230px;
    iframe {
        border: none;
        width: 100%;
        height: 230px;
    }
}
</style>