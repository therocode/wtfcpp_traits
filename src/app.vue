<template>
    <div>
        <h1>Hello World!</h1>
        <type-viewer/>
    </div>
</template>

<script>
import TypeViewer from './components/typeviewer.vue'

export default {
    components: {
        'type-viewer': TypeViewer
    }
};

</script>
