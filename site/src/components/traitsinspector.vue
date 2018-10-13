<template>
    <div>
        <h2>Traits</h2>
        <traits-item v-for="trait in traits" v-bind:item_data="trait"></traits-item>
    </div>
</template>

<script>
import TraitsItem from 'components/traitsitem.vue'
import { is_aggregate } from 'type_traits/type_traits.ts'

export default {
    props: [
        'type_description'
    ],
    computed: {
        'is_aggregate': function () {
            return is_aggregate(this.type_description);
        },
        'traits': function () {
            return [
                this.create_traits_item("std::is_aggregate", is_aggregate),
            ];
        },
    },
    methods: {
        create_traits_item (name, traits_function) {
            var traits_result = traits_function(this.type_description);

            return {
                name: name,
                is_true: traits_result.is_true,
                reasons: traits_result.reasons,
            };
        },
    },
    components: {
        'traits-item': TraitsItem,
    },
}
</script>
