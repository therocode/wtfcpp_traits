<template>
    <div>
        <h2>Config</h2>
        <configurator-checkbox v-bind:label="'Public Base Class'" v-bind:id="'pub_base'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasPublicBaseClass"/>
        <configurator-checkbox v-bind:label="'Private Base Class'" v-bind:id="'priv_base'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasPrivateBaseClass"/>
        <configurator-checkbox v-bind:label="'Virtual Base Class'" v-bind:id="'virt_base'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasVirtualBaseClass"/>

        <configurator-checkbox v-bind:label="'User Provided Default Constructor'" v-bind:id="'user_prov_def_const'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasUserProvidedDefaultConstr"/>
        <configurator-checkbox v-bind:label="'Inherited Default Constructor'" v-bind:id="'inher_def_const'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasInheritedDefaultConstr"/>
        <configurator-checkbox v-bind:label="'Explicit Default Constructor'" v-bind:id="'explic_def_const'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasExplicitDefaultConstr"/>

        <configurator-checkbox v-bind:label="'Virtual member function'" v-bind:id="'virt_mem_fun'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasVirtualMf"/>

        <configurator-checkbox v-bind:label="'Data member with initializer'" v-bind:id="'data_mem_init'" v-bind:type_description="type_description" v-bind:type_attribute="Attribute.HasNsdmWithInitializer"/>
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
