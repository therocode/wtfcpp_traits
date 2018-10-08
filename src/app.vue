<template>
    <div>
        <h1>Wtf C++ Traits</h1>
        <type-viewer v-bind:type_description="type_description"/>
    </div>
</template>

<script>
import TypeViewer from './components/typeviewer.vue'
import { get_test_description } from './type_traits/type_traits.ts'

export default {
    data: {
        type_description: get_test_description(),
    },
    components: {
        'type-viewer': TypeViewer
    }
};

</script>
