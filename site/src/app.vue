<template>
    <div class="app">
        <h2>WTF C++ Traits</h2>
        <div class="container">
            <type-configurator v-on:typeDescChanged="onTypeDescChanged"/>
            <type-viewer v-bind:type_description="type_description"/>
            <traits-inspector v-bind:type_description="type_description"/>
        </div>
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

<style>
@import '~bootstrap/dist/css/bootstrap-reboot.css';
</style>

<style scoped>
.app {
  max-width: 550px;
  padding: 1em;
  color: #444;
}

.container {
  padding: 1em 1.8em;
  padding-bottom: 1.5em;
  margin: 1em 0em;
  border-radius: 4px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.4);
}
</style>
