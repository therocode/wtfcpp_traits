<template>
    <div>
        <h1>Wtf C++ Traits</h1>
        <type-configurator v-on:typeDescChanged="onTypeDescChanged"/>
        <type-viewer v-bind:type_description="type_description"/>
        <traits-inspector v-bind:type_description="type_description"/>
    </div>
</template>

<script>
import TypeConfigurator from './components/typeconfigurator.vue'
import TypeViewer from './components/typeviewer.vue'
import TraitsInspector from './components/traitsinspector.vue'
import { get_default_type_description } from 'type_traits/type_traits.ts';

export default {
    data: {
        type_description: get_default_type_description(),
    },
    components: {
        'type-configurator': TypeConfigurator,
        'type-viewer': TypeViewer,
        'traits-inspector': TraitsInspector,
    },
    methods: {
        onTypeDescChanged: function (type_desc) {
            this.type_description = type_desc;
        }
    }
};

</script>
