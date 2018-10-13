<template>
    <div>
        <h2>Config</h2>
        <configurator-checkbox v-bind:label="'Public Base Class'" v-bind:id="'pub_base'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasPublicBaseClass"/>
        <configurator-checkbox v-bind:label="'Private Base Class'" v-bind:id="'priv_base'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasPrivateBaseClass"/>
        <configurator-checkbox v-bind:label="'Virtual Base Class'" v-bind:id="'virt_base'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasVirtualBaseClass"/>
    </div>
</template>

<script>
import ConfiguratorCheckbox from 'components/configuratorcheckbox.vue'
import { get_default_type_description, Attribute } from 'type_traits/type_traits.ts';

export default {
    data: function() {
        return {
            type_description: get_default_type_description(),
            Attribute : Attribute
        }
    },
    components: {
        'configurator-checkbox': ConfiguratorCheckbox,
    },
    watch: {
        type_description: {
            handler (val) {
                this.$emit('typeDescChanged', val);
            },
            deep: true
        }
    }
}
</script>
