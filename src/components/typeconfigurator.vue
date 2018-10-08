<template>
    <div>
        <h2>Config</h2>
        <p>{{ type_description }}</p>
        <label for="pub_base">Public Base Class</label>
        <input type="checkbox" id="pub_base" v-model="type_description.has_public_base_class">
        <br>
        <label for="priv_base">Private Base Class</label>
        <input type="checkbox" id="priv_base" v-model="type_description.has_private_base_class">
    </div>
</template>

<script>
import { get_default_type_description } from 'type_traits/type_traits.ts';

export default {
    data: function() {
        return {
            type_description: get_default_type_description()
        }
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
